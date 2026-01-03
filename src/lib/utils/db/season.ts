import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';

import { eq, inArray } from 'drizzle-orm';
import { getSerieSeason } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const season = {
	add: async (data: typeof schema.season.$inferInsert) =>
		(await season.isIDUnique(data.id))
			? await db.insert(schema.season).values(data)
			: await season.update(data.id, data),

	get: async (
		id: number,
		seriesId?: number,
		seasonNumber?: number
	): Promise<typeof schema.season.$inferSelect | undefined> => {
		let result = await db.query.season.findFirst({ where: eq(schema.season.id, id) });

		if (!result && online.current && seriesId !== undefined && seasonNumber !== undefined) {
			const fetched = await getSerieSeason(seriesId, seasonNumber);
			if (fetched) {
				await db.insert(schema.season).values({
					id: fetched.id,
					tmdb: fetched,
					path: null,
					watched: false,
					episode: 0
				});
				result = {
					id,
					tmdb: fetched,
					path: null,
					watched: false,
					episode: 0,
					updated: new Date()
				};
			}
		}
		return result;
	},

	getAll: async (
		items: { id: number; seriesId?: number; seasonNumber?: number }[]
	): Promise<(typeof schema.season.$inferSelect)[]> => {
		if (items && items.length > 0) {
			const localResults = await db
				.select()
				.from(schema.season)
				.where(
					inArray(
						schema.season.id,
						items.map((s) => s.id)
					)
				);
			const foundIds = localResults.map((r) => r.id);
			const missingIds = items.filter((item) => !foundIds.includes(item.id));

			if (missingIds.length > 0 && online.current) {
				const fetchedSeasons: (typeof schema.season.$inferSelect | null)[] = await Promise.all(
					missingIds.map(async (item) => {
						if (item.seriesId === undefined || item.seasonNumber === undefined) return null;
						const onlineResult = await getSerieSeason(item.seriesId, item.seasonNumber);
						if (onlineResult) {
							await db.insert(schema.season).values({
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								episode: 0
							});
							return {
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								episode: 0,
								updated: new Date()
							};
						}
						return null;
					})
				);
				const validFetched = fetchedSeasons.filter((s) => s !== null);
				return [...localResults, ...validFetched];
			}

			return localResults;
		}

		return await db.select().from(schema.season);
	},

	delete: async (id: number) => await db.delete(schema.season).where(eq(schema.season.id, id)),

	update: async (id: number, data: Partial<typeof schema.season.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.season).set(data).where(eq(schema.season.id, id));
		} catch (err) {
			console.error(`Update Season (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existingSeason = await season.get(id);
		return !existingSeason;
	}
};
