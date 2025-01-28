import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { parseId } from '$lib/load/loadUtils';
import type { schema } from '$lib/db/schema';

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen

	if (!browser) {
		throw error(500, 'This operation is only supported in the browser');
	}

	const module = await import('$lib/db/funktion');

	let result = await module.getCollection(id);

	const movies: (typeof schema.movies.$inferSelect)[] = [];

	if (!result && navigator.onLine) {
		// Daten von TMDB abrufen
		const tmdb = await import('$lib/tmdb');

		const collection = await tmdb.getCollection(id);

		result = { ...collection, updated: new Date() };

		module.addCollection(result);
	}

	if (!result) {
		throw error(404, 'Collection not found');
	}

	if (result.parts.length > 0) {
		await Promise.all(
			result.parts.map(async (part) => {
				const movie = await module.getMovie(part.id);
				if (movie?.path) {
					movies.push(movie);
				}
			})
		);
	}

	// Nur relevante Daten zurückgeben
	return { id, result, movies };
}) satisfies PageLoad;
