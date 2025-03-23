import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { exists } from '@tauri-apps/plugin-fs';
import { parseId } from '$lib/load/loadUtils';
import { online } from 'svelte/reactivity/window';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { movie } = await import('$lib/utils/db/movie');

	// Zuerst versuchen, den Film lokal zu finden
	let result = await movie.get(id);

	if (!result && online.current) {
		// Wenn der Film nicht lokal gefunden wurde und online verfügbar ist, Daten von TMDB abrufen

		const tmdb = await import('$lib/utils/tmdb');
		const fetchedMovie = await tmdb.getMovie(id);

		if (!fetchedMovie) {
			// Wenn der Film auch online nicht gefunden wurde
			error(404, 'Movie not found');
		}

		// Film in die Datenbank speichern
		movie.add({
			id,
			path: null,
			tmdb: fetchedMovie
		});

		result = await movie.get(id);
	}

	if (!result) {
		error(404, 'Movie not found');
	}

	// Wenn der path leer ist, setzen wir es auf false, ansonsten prüfen wir, ob der Pfad existiert
	const pathExists = result.path ? await exists(result.path) : false;

	// Nur relevante Daten zurückgeben
	return { id, result, pathExists };
}) satisfies PageLoad;
