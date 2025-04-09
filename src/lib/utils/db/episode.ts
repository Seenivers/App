import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';
import { getSerieSeasonEpisode } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const episode = {
	add: async (data: typeof schema.episode.$inferInsert) =>
		await db.insert(schema.episode).values(data),

	get: async (id: number, seriesId?: number, seasonNumber?: number, episodeNumber?: number) => {
		let result = await db.query.episode.findFirst({ where: eq(schema.episode.id, id) });

		if (!result && online.current && seriesId && seasonNumber && episodeNumber) {
			const fetched = await getSerieSeasonEpisode(seriesId, seasonNumber, episodeNumber);

			if (fetched) {
				await db.insert(schema.episode).values({
					id,
					tmdb: fetched,
					path: null,
					watched: false,
					watchTime: 0
				});
				result = {
					id,
					tmdb: fetched,
					path: null,
					watched: false,
					watchTime: 0,
					updated: new Date()
				};
			}
		}

		return result;
	},

	getAll: async (
		items: { id: number; seriesId: number; seasonNumber: number; episodeNumber: number }[]
	) => {
		if (items && items.length > 0) {
			const localResults = await db
				.select()
				.from(schema.episode)
				.where(
					inArray(
						schema.episode.id,
						items.map((s) => s.id)
					)
				);

			const foundIds = localResults.map((r) => r.id);
			const missingIds = items.filter((item) => !foundIds.includes(item.id));

			if (missingIds.length > 0 && online.current) {
				const fetchedEpisodes = await Promise.all(
					missingIds.map(async (item) => {
						if (!item.seriesId || !item.seasonNumber || !item.episodeNumber) return null;
						const onlineResult = await getSerieSeasonEpisode(
							item.seriesId,
							item.seasonNumber,
							item.episodeNumber
						);
						if (onlineResult) {
							await db.insert(schema.episode).values({
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								watchTime: 0
							});
							return {
								id: item,
								tmdb: onlineResult,
								path: null,
								watched: false,
								watchTime: 0,
								updated: new Date()
							};
						}

						return null;
					})
				);

				const validFetched = fetchedEpisodes.filter((e) => e !== null);
				return [...localResults, ...validFetched];
			}

			return localResults;
		}

		return await db.select().from(schema.episode);
	},

	delete: async (id: number) => await db.delete(schema.episode).where(eq(schema.episode.id, id)),

	update: async (id: number, data: Partial<typeof schema.episode.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.episode).set(data).where(eq(schema.episode.id, id));
		} catch (err) {
			error(`Update Episode (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number) => {
		const existing = await episode.get(id);
		return !existing;
	}
};
