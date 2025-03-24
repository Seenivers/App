import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { exists } from '@tauri-apps/plugin-fs';
import { parseId, parseSerieId } from '$lib/load/loadUtils';
import { online } from 'svelte/reactivity/window';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen
	const tvShowID = parseSerieId(url); // ID validieren und parsen

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { season } = await import('$lib/utils/db/season');

	// Zuerst versuchen, den Film lokal zu finden
	let result = await season.get(id);

	if (!result && online.current) {
		// Wenn die Season nicht lokal gefunden wurde und online verfügbar ist, Daten von TMDB abrufen

		const tmdb = await import('$lib/utils/tmdb');
		const fetchedSeason = await tmdb.getSerieSeason(tvShowID, id);

		if (!fetchedSeason) {
			// Wenn die Season auch online nicht gefunden wurde
			error(404, 'Season not found');
		}

		// Film in die Datenbank speichern
		await season.add({
			id,
			path: null,
			tmdb: fetchedSeason
		});

		result = await season.get(id);
	}

	if (!result) {
		error(404, 'Season not found');
	}

	// Wenn der path leer ist, setzen wir es auf false, ansonsten prüfen wir, ob der Pfad existiert
	const pathExists = result.path ? await exists(result.path) : false;

	// Nur relevante Daten zurückgeben
	return { id, result, pathExists, tvShowID };
}) satisfies PageLoad;
