import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';

import { eq, inArray } from 'drizzle-orm';
import { getSerie } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const serie = {
	add: async (data: typeof schema.serie.$inferInsert) =>
		(await serie.isIDUnique(data.id))
			? await db.insert(schema.serie).values(data)
			: await serie.update(data.id, data),

	get: async (
		id: number,
		seriesId?: number
	): Promise<typeof schema.serie.$inferSelect | undefined> => {
		let result = await db.query.serie.findFirst({ where: eq(schema.serie.id, id) });

		if (!result && online.current && seriesId !== undefined) {
			const fetched = await getSerie(seriesId);
			if (fetched) {
				await db.insert(schema.serie).values({
					id: fetched.id,
					tmdb: fetched,
					path: null,
					watched: false
				});
				result = {
					id,
					tmdb: fetched,
					path: null,
					watched: false,
					updated: new Date(),
					wantsToWatch: false,
					season: 0,
					rating: 0
				};
			}
		}
		return result;
	},

	getAll: async (ids?: number[]): Promise<(typeof schema.serie.$inferSelect)[]> => {
		if (ids && ids.length > 0) {
			const localResults = await db
				.select()
				.from(schema.serie)
				.where(inArray(schema.serie.id, ids));

			const foundIds = localResults.map((r) => r.id);
			// Filtere nur Elemente, bei denen id definiert ist
			const missingItems = ids.filter((item) => item !== undefined && !foundIds.includes(item));

			if (missingItems.length > 0 && online.current) {
				const fetchedResults: (typeof schema.serie.$inferSelect | null)[] = await Promise.all(
					missingItems.map(async (item) => {
						if (item === undefined) return null;
						const onlineResult = await getSerie(item);
						if (onlineResult) {
							await db.insert(schema.serie).values({
								id: onlineResult.id,
								tmdb: onlineResult
							});
							return {
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								updated: new Date(),
								wantsToWatch: false,
								season: 0,
								rating: 0
							};
						}
						return null;
					})
				);
				const validFetched = fetchedResults.filter((r) => r !== null);
				return [...localResults, ...validFetched];
			}
			return localResults;
		}

		return await db.select().from(schema.serie);
	},

	delete: async (id: number) => await db.delete(schema.serie).where(eq(schema.serie.id, id)),

	update: async (id: number, data: Partial<typeof schema.serie.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.serie).set(data).where(eq(schema.serie.id, id));
		} catch (err) {
			console.error(`Update Serie (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existingSerie = await serie.get(id);
		return !existingSerie;
	},

	isPathUnique: async (path: string): Promise<boolean> => {
		const existingSerie = await db.query.serie.findFirst({ where: eq(schema.serie.path, path) });
		return !existingSerie;
	}
};
