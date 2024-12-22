import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

function parseId(url: URL): number {
	const idParam = url.searchParams.get('id');
	if (!idParam) {
		error(400, 'ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'ID must be a valid number');
	}
	return parsedId;
}

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
		if (navigator.onLine) {
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
