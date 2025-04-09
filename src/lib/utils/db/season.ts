import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';
import { getSerieSeason } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const season = {
	add: async (data: typeof schema.season.$inferInsert) =>
		await db.insert(schema.season).values(data),

	get: async (id: number, seriesId?: number, seasonNumber?: number) => {
		let result = await db.query.season.findFirst({ where: eq(schema.season.id, id) });

		if (!result && online.current && seriesId && seasonNumber) {
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

	getAll: async (items: { id: number; seriesId: number; seasonNumber: number }[]) => {
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
						if (!item.seriesId || !item.seasonNumber) return null;
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
			error(`Update Season (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number) => {
		const existingSeason = await season.get(id);
		return !existingSeason;
	}
};
