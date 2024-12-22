import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

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
	const id = parseId(url); // ID validieren und parsen

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const db = await import('$lib/db/funktion');

	let result = (await db.getActor(id))?.tmdb;
	if (!result && !navigator.onLine) {
		error(404, 'Actor not found');
	} else {
		// Wenn der Schauspieler nicht in der Datenbank gefunden wurde, versuche ihn von TMDB zu holen
		const tmdb = await import('$lib/tmdb');
		let fetchedActor = await tmdb.getActor(id);
		if (!fetchedActor) {
			error(404, 'Actor not found');
		}
		result = fetchedActor;
	}

	// Nur relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;
