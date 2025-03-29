import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { exists } from '@tauri-apps/plugin-fs';
import {
	parseEpisodeId,
	parseId,
	parseSeasonId,
	parseSeasonNumber,
	parseSerieId
} from '$lib/load/loadUtils';
import { online } from 'svelte/reactivity/window';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen
	const tvShowID = parseSerieId(url); // ID validieren und parsen
	const seasonNumber = parseSeasonNumber(url); // ID validieren und parsen
	const seasonID = parseSeasonId(url); // ID validieren und parsen
	const episodeID = parseEpisodeId(url); // ID validieren und parsen

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { episode } = await import('$lib/utils/db/episode');

	// Zuerst versuchen, den Film lokal zu finden
	let result = await episode.get(episodeID);

	if (!result && online.current) {
		// Wenn die Episode nicht lokal gefunden wurde und online verfügbar ist, Daten von TMDB abrufen

		const tmdb = await import('$lib/utils/tmdb');
		const fetchedEpisode = await tmdb.getSerieSeasonEpisode(tvShowID, seasonNumber, id);

		if (!fetchedEpisode) {
			// Wenn die Episode auch online nicht gefunden wurde
			error(404, 'Episode not found');
		}

		// Film in die Datenbank speichern
		await episode.add({
			id: episodeID,
			path: null,
			tmdb: fetchedEpisode
		});

		result = await episode.get(episodeID);
	}

	if (!result) {
		error(404, 'Episode not found');
	}

	// Wenn der path leer ist, setzen wir es auf false, ansonsten prüfen wir, ob der Pfad existiert
	const pathExists = result.path ? await exists(result.path) : false;

	// Nur relevante Daten zurückgeben
	return { id, result, pathExists, tvShowID, seasonID, episodeID };
}) satisfies PageLoad;
