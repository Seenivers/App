import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';
import { getMovie, getMovies } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const movie = {
	add: async (data: typeof schema.movies.$inferInsert) =>
		(await movie.isIDUnique(data.id))
			? await db.insert(schema.movies).values(data)
			: await movie.update(data.id, data),

	get: async (id: number): Promise<typeof schema.movies.$inferSelect | undefined> => {
		let result = await db.query.movies.findFirst({ where: eq(schema.movies.id, id) });

		if (!result && online.current && id !== undefined) {
			const fetched = await getMovie(id);
			if (fetched) {
				await db
					.insert(schema.movies)
					.values({ id: fetched.id, tmdb: fetched, path: null, watched: false, watchTime: 0 });

				result = {
					id: fetched.id,
					tmdb: fetched,
					path: null,
					watched: false,
					watchTime: 0,
					wantsToWatch: false,
					updated: new Date()
				};
			}
		}

		return result;
	},

	getAll: async (ids?: number[]): Promise<(typeof schema.movies.$inferSelect)[]> => {
		if (ids && ids.length > 0) {
			const localResults = await db
				.select()
				.from(schema.movies)
				.where(inArray(schema.movies.id, ids));

			const foundIds = localResults.map((m) => m.id);
			const missingIds = ids.filter((id) => !foundIds.includes(id));

			if (missingIds.length > 0 && online.current && ids !== undefined) {
				const { movies: fetchedMovies, errors } = await getMovies(missingIds);

				// Erfolgreich gefundene speichern
				for (const { id, data } of fetchedMovies) {
					await db
						.insert(schema.movies)
						.values({ id, tmdb: data, path: null, watched: false, watchTime: 0 });
				}

				const fetchedResults = fetchedMovies.map(({ id, data }) => ({
					id,
					tmdb: data,
					path: null,
					watched: false,
					watchTime: 0,
					wantsToWatch: false,
					updated: new Date()
				}));

				for (const err of errors) {
					error(`Fehler beim Abrufen von Movie ${err.id}: ${err.error}`);
				}

				return [...localResults, ...fetchedResults];
			}

			return localResults;
		}

		return await db.select().from(schema.movies);
	},

	delete: async (id: number) => await db.delete(schema.movies).where(eq(schema.movies.id, id)),

	update: async (id: number, data: Partial<typeof schema.movies.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.movies).set(data).where(eq(schema.movies.id, id));
		} catch (err) {
			error(`Update Movie (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existingMovie = await movie.get(id);
		return !existingMovie;
	},

	isPathUnique: async (path: string): Promise<boolean> => {
		const existingMovie = await db.query.movies.findFirst({
			where: eq(schema.movies.path, path)
		});
		return !existingMovie;
	}
};
