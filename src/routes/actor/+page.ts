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
		error(500, 'This operation is only supported in the browser'); // Fehler auslösen, wenn nicht im Browser
	}

	// Lokale Datenbank abfragen
	const { actor } = await import('$lib/utils/db/actor');
	let result = (await actor.get(id))?.tmdb;

	// Prüfen, ob das Ergebnis ein JSON-String ist, und konvertieren
	if (typeof result === 'string') {
		try {
			result = JSON.parse(result);
		} catch {
			error(500, 'Invalid data format from database'); // Fehler auslösen, wenn das JSON ungültig ist
		}
	}

	// Wenn kein Ergebnis in der lokalen Datenbank und online
	if (!result && online.current) {
		// Daten von TMDB abrufen
		const tmdb = await import('$lib/utils/tmdb');
		const fetchedActor = await tmdb.getActor(id);

		if (!fetchedActor) {
			error(404, 'Actor not found'); // Fehler auslösen, wenn der Schauspieler nicht gefunden wurde
		}

		result = fetchedActor;

		// Schauspieler in die Datenbank speichern
		actor.add({
			name: result.name,
			tmdb: result,
			id: id
		});
	}

	// Wenn keine Daten gefunden wurden, Fehler auslösen
	if (!result) {
		error(404, 'Actor not found'); // Fehler auslösen, wenn immer noch keine Daten gefunden wurden
	}

	// Relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;
