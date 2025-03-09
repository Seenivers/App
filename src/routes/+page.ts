import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import type { schema } from '$lib/db/schema';

export const load = (async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const module = await import('$lib/db/funktion');
	const { movie } = await import('$lib/utils/db/movie');

	// Sicherstellen, dass diese Funktionen existieren und Collections & Movies zurückgeben
	const collections: (typeof schema.collections.$inferSelect)[] =
		(await module.getAllCollections()) ?? [];
	const movies: (typeof schema.movies.$inferSelect)[] = (await movie.getAll()) ?? [];

	if (movies.length === 0) {
		return { result: [] };
	}

	// Nur Filme mit gesetztem Pfad berücksichtigen
	const moviesWithPath = movies.filter((movie) => movie.path);

	// Map für die Zählung der Filme in Collections
	const collectionCount = new Map<number, number>();
	const standaloneMovies: (typeof schema.movies.$inferSelect)[] = [];

	// Anzahl der Filme pro Collection zählen
	for (const movie of moviesWithPath) {
		const collectionId = movie.tmdb.belongs_to_collection?.id;
		if (collectionId) {
			collectionCount.set(collectionId, (collectionCount.get(collectionId) ?? 0) + 1);
		}
	}

	// Nur Collections mit mindestens zwei Filmen behalten
	const filteredCollections = collections.filter((c) => (collectionCount.get(c.id) ?? 0) > 1);

	// Filme, die keiner Collection angehören oder deren Collection zu klein ist, als Einzel-Filme speichern
	for (const movie of moviesWithPath) {
		const collectionId = movie.tmdb.belongs_to_collection?.id;
		if (!collectionId || (collectionCount.get(collectionId) ?? 0) <= 1) {
			standaloneMovies.push(movie);
		}
	}

	// Ergebnisliste: Erst Collections (ohne Filme), dann einzelne Filme
	const result = [...filteredCollections, ...standaloneMovies];

	return { result };
}) satisfies PageLoad;
