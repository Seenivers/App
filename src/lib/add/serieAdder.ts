import * as tmdb from '$lib/utils/tmdb';
import { online } from 'svelte/reactivity/window';
import { updateSearchStatus } from './utils';
import { serie } from '$lib/utils/db/serie';
import { searchList } from '$lib/stores.svelte';
import type { Serie } from '$lib/types/tv/serie';
import { error, warn } from '@tauri-apps/plugin-log';
import { findSeasonsAndEpisodes } from './findEpisodes';
import { loadImages } from './imageLoader';
import { season } from '$lib/utils/db/season';
import { episode } from '$lib/utils/db/episode';
import { join } from '@tauri-apps/api/path';

export async function addNewSerie(entrie: { id: number; index: number }) {
	if (!entrie || !online.current) {
		updateSearchStatus(entrie.index, 'notFound');
		return;
	}

	// Status auf "downloading" setzen
	updateSearchStatus(entrie.index, 'downloading');

	if (!(await serie.isIDUnique(entrie.id))) {
		serie.update(entrie.id, { path: searchList[entrie.index].options.path });
		updateSearchStatus(entrie.index, 'downloaded');
		return;
	}

	try {
		// Serie abrufen
		const response = await tmdb.getSerie(entrie.id);

		// Serie speichern
		await serie.add({
			id: response.id,
			path: searchList[entrie.index].options.path,
			tmdb: response
		});

		await addSeasonToDatabase(entrie.index, response.id, response.seasons);

		await loadImages(response);

		updateSearchStatus(entrie.index, 'downloaded');
	} catch (err) {
		// Falls die gesamte Anfrage fehlschlägt, Serie als "notFound" markieren
		updateSearchStatus(entrie.index, 'notFound');
		error(
			`Fehler beim Abrufen der Serie: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

export async function addSeasonToDatabase(
	index: number,
	serieId: number,
	seasons: Serie['seasons']
) {
	const seriesPath = searchList[index]?.options?.path;
	if (!seriesPath) {
		warn(`Kein gültiger Pfad für Serie mit ID ${serieId} gefunden.`);
		return;
	}

	// Finde die Staffel- und Episodenpfade
	const seasonData = await findSeasonsAndEpisodes(seriesPath);

	// Verarbeite jede Staffel basierend auf ihrem season_number
	for (const seasonInfo of seasons) {
		const seasonNumber = seasonInfo.season_number;
		const resultSeason = await tmdb.getSerieSeason(serieId, seasonNumber);
		if (!resultSeason) continue;

		// Überprüfe, ob für diese Staffel spezielle Episodenpfade existieren
		const seasonPath = seasonData[seasonNumber]
			? await join(seriesPath, seasonNumber.toString())
			: seriesPath;

		// Staffel zur Datenbank hinzufügen
		await season.add({
			id: resultSeason.id,
			path: seasonPath,
			tmdb: resultSeason
		});

		await loadImages(resultSeason);

		// Episoden zur Datenbank hinzufügen
		await addEpisodeToDatabase(serieId, seasonNumber, seasonData[seasonNumber] || {});
	}
}
export async function addEpisodeToDatabase(
	serieId: number,
	seasonNumber: number,
	episodePaths: Record<number, string>
) {
	for (const episodeNumber in episodePaths) {
		const resultEpisode = await tmdb.getSerieSeasonEpisode(
			serieId,
			seasonNumber,
			Number(episodeNumber)
		);
		if (!resultEpisode) continue;

		// Pfad zur Episode hinzufügen
		const episodePath = episodePaths[Number(episodeNumber)] || null;

		// Episode hinzufügen
		await episode.add({
			id: resultEpisode.id,
			path: episodePath, // Den Pfad zur Episode speichern
			tmdb: resultEpisode
		});

		await loadImages(resultEpisode);
	}
}
