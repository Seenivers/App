import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { parseId } from '$lib/load/loadUtils';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen

	if (!browser) {
		throw error(500, 'This operation is only supported in the browser');
	}

	const module = await import('$lib/db/funktion');

	let result = await module.getCollection(id);
	if (!result && navigator.onLine) {
		// Daten von TMDB abrufen
		const tmdb = await import('$lib/tmdb');

		// @ts-expect-error Die Eigenschaft "updated" fehlt im Typ "CollectionDetails", aber wird nicht benötigt
		result = await tmdb.getCollection(id);
	}

	if (!result) {
		throw error(404, 'Collection not found');
	}

	// Nur relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;
