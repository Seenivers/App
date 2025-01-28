import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { parseId } from '$lib/load/loadUtils';
import { online } from 'svelte/reactivity/window';

export const load = (async ({ url }) => {
	// ID validieren und parsen
	const id = parseId(url);

	// Prüfen, ob der Code im Browser läuft
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	// Lokale Datenbank abfragen
	const db = await import('$lib/db/funktion');
	let result = (await db.getActor(id))?.tmdb;

	// Prüfen, ob das Ergebnis ein JSON-String ist, und konvertieren
	if (typeof result === 'string') {
		try {
			result = JSON.parse(result);
		} catch {
			error(500, 'Invalid data format from database');
		}
	}

	// Wenn kein Ergebnis in der lokalen Datenbank und online
	if (!result) {
		if (online.current) {
			// Daten von TMDB abrufen
			const tmdb = await import('$lib/tmdb');
			const fetchedActor = await tmdb.getActor(id);

			if (!fetchedActor) {
				// Wenn der Schauspieler auch online nicht gefunden wurde
				error(404, 'Actor not found');
			}
			result = fetchedActor;
		} else {
			// Wenn offline und keine Daten gefunden
			error(404, 'Actor not found and you are offline');
		}
	}

	// Relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;
