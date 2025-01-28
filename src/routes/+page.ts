import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load = (async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const module = await import('$lib/db/funktion');

	const result = await module.getAllMovies();

	// Nur relevante Daten zurückgeben
	return { result: result ?? [] };
}) satisfies PageLoad;
