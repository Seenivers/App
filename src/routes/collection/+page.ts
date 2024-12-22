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

	const result = await module.getCollection(id);
	if (!result) {
		throw error(404, 'Collection not found');
	}

	// Nur relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;
