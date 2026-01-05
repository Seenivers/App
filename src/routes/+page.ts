import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { movies as schemaMovie, serie as schemaSerie } from '$lib/db/schema';
import { isNotNull } from 'drizzle-orm';

export const load = (async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	// ⏱️ Performance-Start
	performance.mark('load:start');

	const { collection } = await import('$lib/utils/db/collection');
	const { db } = await import('$lib/db/database');

	// Parallele Abfragen: nur relevante Spalten laden
	const [collections, movies, series] = await Promise.all([
		collection.getAll().then((r) => r ?? []),

		db.select().from(schemaMovie).where(isNotNull(schemaMovie.path)),

		db.select().from(schemaSerie).where(isNotNull(schemaSerie.path))
	]);

	if (movies.length === 0 && collections.length === 0 && series.length === 0) {
		performance.mark('load:end');
		performance.measure('load:main', 'load:start', 'load:end');
		return { movies: [], series: [], collections: [], genres: [] };
	}

	// TMDB-Name direkt setzen
	const moviesWithPath = movies.map((c) => ({
		...c,
		tmdb: { ...c.tmdb, name: c.tmdb.title }
	}));

	const seriesWithPath = series.map((serie) => serie);

	// Collections nur für Filme, die tatsächlich einer Collection zugeordnet sind
	const movieCollectionIds = new Set(
		moviesWithPath.map((m) => m.tmdb.belongs_to_collection?.id).filter(Boolean)
	);

	const filteredCollections = collections
		.filter((c) => movieCollectionIds.has(c.id))
		.map((c) => ({ ...c, tmdb: { name: c.name } }));

	// const genres = Array.from(new Set([...moviesWithPath, ...seriesWithPath].flatMap((item) => item.tmdb?.genres?.map((g) => g?.name).filter(Boolean) ?? []))).sort().map((name) => ({ name }));

	// ⏱️ Performance-Ende
	performance.mark('load:end');
	performance.measure('load:main', 'load:start', 'load:end');

	const [measure] = performance.getEntriesByName('load:main');
	console.debug('[perf] load:main', `${measure.duration.toFixed(2)} ms`);

	return {
		movies: moviesWithPath,
		series: seriesWithPath,
		collections: filteredCollections
		// genres
	};
}) satisfies PageLoad;
