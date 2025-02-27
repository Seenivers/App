import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { parseId } from '$lib/load/loadUtils';
import { online } from 'svelte/reactivity/window';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen

	// Sicherstellen, dass die Funktion nur im Browser ausgeführt wird
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	// Import von Modulen, die Datenbankoperationen durchführen
	const { getCollection, getMovie, addCollection } = await import('$lib/db/funktion');

	// Versuchen, die Collection aus der lokalen Datenbank zu laden
	let result = await getCollection(id);

	if (!result && online.current) {
		// Wenn nicht vorhanden und online, Daten von TMDB abrufen
		const { getCollection: getTMDBCollection } = await import('$lib/utils/tmdb');

		const collection = await getTMDBCollection(id);

		// Wenn keine Daten gefunden wurden, Fehler auslösen
		if (!collection) {
			error(404, 'Collection not found');
		}

		// Collection speichern und aktualisiert setzen
		result = { ...collection, updated: new Date() };
		await addCollection(result);
	}

	// Wenn selbst nach TMDB-Aufruf keine Daten vorhanden sind, Fehler auslösen
	if (!result) {
		error(404, 'Collection not found');
	}

	// Filme aus der lokalen Datenbank laden, nur mit Pfad
	const movies = (
		await Promise.all(
			result.parts.map(async (part) => {
				const movie = await getMovie(part.id);
				return movie?.path ? movie : null;
			})
		)
	).filter(Boolean); // Filtert `null` oder `undefined` heraus

	// Nur relevante Daten zurückgeben
	return { id, result, movies };
}) satisfies PageLoad;
