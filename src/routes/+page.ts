import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import type {
	collections as schemaCollections,
	movies as schemaMovie,
	serie as schemaSerie
} from '$lib/db/schema';

export const load = (async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { collection } = await import('$lib/utils/db/collection');
	const { movie } = await import('$lib/utils/db/movie');
	const { serie } = await import('$lib/utils/db/serie');

	// Daten aus der Datenbank abrufen
	const collections: (typeof schemaCollections.$inferSelect)[] = (await collection.getAll()) ?? [];
	const movies: (typeof schemaMovie.$inferSelect)[] = (await movie.getAll()) ?? [];
	const series: (typeof schemaSerie.$inferSelect)[] = (await serie.getAll()) ?? [];

	if (movies.length === 0 && collections.length === 0 && series.length === 0) {
		return { movies: [], series: [], collections: [], genres: [] };
	}

	// Nur Filme & Serien mit gesetztem `path`
	const moviesWithPath = movies
		.filter((movie) => movie.path)
		.map((c) => ({
			...c,
			tmdb: { ...c.tmdb, name: c.tmdb.title } // Platzhalter-Struktur für spätere Nutzung
		}));

	const seriesWithPath = series.filter((serie) => serie.path);

	// Collections filtern: Nur, wenn mindestens ein Film mit `path` existiert
	const filteredCollections = collections
		.filter((c) => moviesWithPath.some((m) => m.tmdb.belongs_to_collection?.id === c.id))
		.map((c) => ({
			...c,
			tmdb: { name: c.name } // Platzhalter-Struktur für spätere Nutzung
		}));

	// 🎯 Alle Genres aus Filmen & Serien extrahieren
	const genreSet = new Set<string>();

	for (const item of [...moviesWithPath, ...seriesWithPath]) {
		if (item.tmdb?.genres && Array.isArray(item.tmdb.genres)) {
			for (const genre of item.tmdb.genres) {
				if (genre?.name) {
					genreSet.add(genre.name);
				}
			}
		}
	}

	const genres = Array.from(genreSet)
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({ name }));

	return {
		movies: moviesWithPath,
		series: seriesWithPath,
		collections: filteredCollections,
		genres
	};
}) satisfies PageLoad;
