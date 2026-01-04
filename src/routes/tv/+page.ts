import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { exists } from '@tauri-apps/plugin-fs';
import { parseId } from '$lib/utils/loadUtils';

export const load = (async ({ url }) => {
	// ID validieren und parsen
	const id = parseId(url);

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	// Serie abrufen bzw. online holen und in DB speichern
	const { serie } = await import('$lib/utils/db/serie');
	const resultSerie = await serie.get(id, id);

	if (!resultSerie) {
		error(404, `Serie with id ${id} not found`);
	}

	// Seasons verarbeiten:
	const { season } = await import('$lib/utils/db/season');

	// Alle Staffeln aus der TMDB-Datenquelle (falls vorhanden) abrufen
	const seasonsData = resultSerie.tmdb.seasons ?? [];

	// Array mit den benötigten Parametern für jede Staffel erstellen
	const arraySeasons = seasonsData.map((s) => ({
		id: s.id,
		seriesId: id,
		seasonNumber: s.season_number
	}));

	const resultSeasons = await season.getAll(arraySeasons);

	if (!resultSeasons || resultSeasons.length === 0) {
		error(404, `No seasons found for Serie with id ${id}`);
	}

	// Prüfe, welche Staffeln fehlen (IDs aus TMDB vs. erhaltene DB-Ergebnisse)
	const missingSeasonIds = seasonsData
		.filter((s) => !resultSeasons.find((r) => r && r.id === s.id))
		.map((s) => s.id);

	if (missingSeasonIds.length > 0) {
		error(404, `Missing season(s) with id(s): ${missingSeasonIds.join(', ')}`);
	}

	const newResultSeasons = resultSeasons.filter((s) => s !== undefined);

	// Episodes verarbeiten:
	const { episode } = await import('$lib/utils/db/episode');

	// Erstelle ein Array mit den benötigten Parametern für jede Episode über alle Staffeln
	const arrayEpisode = newResultSeasons.flatMap((s) =>
		s.tmdb.episodes.map((e) => ({
			id: e.id,
			seriesId: id,
			seasonNumber: s.tmdb.season_number,
			episodeNumber: e.episode_number
		}))
	);

	// Alle Episoden anhand des Arrays abrufen (lokal bzw. mit Online-Fallback)
	const episodesBySeason = await episode.getAll(arrayEpisode);

	if (!episodesBySeason || episodesBySeason.length === 0) {
		error(404, `No episodes found for Serie with id ${id}`);
	}

	// Prüfe, ob für jede Episode des Arrays ein Resultat vorhanden ist
	const missingEpisodeMappings = arrayEpisode.filter(
		(ae) => !episodesBySeason.find((ep) => ep && ep.id === ae.id)
	);

	// Gruppiere fehlende Episoden nach Staffel, damit du doppelte Meldungen vermeidest
	const missingEpisodeInfo = Array.from(
		new Set(missingEpisodeMappings.map((ae) => `Season ${ae.seasonNumber}`))
	);

	if (missingEpisodeInfo.length > 0) {
		error(404, `Episodes not found for: ${missingEpisodeInfo.join(', ')}`);
	}

	// Prüfe, ob der Pfad für die Serie existiert
	const pathExists = resultSerie.path ? await exists(resultSerie.path) : false;

	return {
		id,
		serie: resultSerie,
		seasons: newResultSeasons,
		episodes: episodesBySeason.filter((s) => s !== undefined),
		pathExists
	};
}) satisfies PageLoad;
