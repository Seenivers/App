import { db } from '$lib/db/database';
import { episode as schemaEpisode } from '$lib/db/schema';

import { eq, inArray } from 'drizzle-orm';
import { getSerieSeasonEpisode } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const episode = {
	add: async (data: typeof schemaEpisode.$inferInsert) =>
		(await episode.isIDUnique(data.id))
			? await db.insert(schemaEpisode).values(data)
			: await episode.update(data.id, data),

	get: async (
		id: number,
		seriesId?: number,
		seasonNumber?: number,
		episodeNumber?: number
	): Promise<typeof schemaEpisode.$inferSelect | undefined> => {
		let result = await db.query.episode.findFirst({ where: eq(schemaEpisode.id, id) });

		if (
			!result &&
			online.current &&
			seriesId !== undefined &&
			seasonNumber !== undefined &&
			episodeNumber !== undefined
		) {
			const fetched = await getSerieSeasonEpisode(seriesId, seasonNumber, episodeNumber);

			if (fetched) {
				await db.insert(schemaEpisode).values({
					id: fetched.id,
					tmdb: fetched
				});
				result = {
					id: fetched.id,
					tmdb: fetched,
					path: null,
					watched: false,
					watchTime: 0,
					updated: new Date(),
					rating: 0
				};
			}
		}

		return result;
	},

	getAll: async (
		items: { id: number; seriesId?: number; seasonNumber?: number; episodeNumber?: number }[]
	): Promise<(typeof schemaEpisode.$inferSelect)[]> => {
		if (items && items.length > 0) {
			const localResults = await db
				.select()
				.from(schemaEpisode)
				.where(
					inArray(
						schemaEpisode.id,
						items.map((s) => s.id)
					)
				);

			const foundIds = localResults.map((r) => r.id);
			const missingIds = items.filter((item) => !foundIds.includes(item.id));

			if (missingIds.length > 0 && online.current) {
				const fetchedEpisodes: (typeof schemaEpisode.$inferSelect | null)[] = await Promise.all(
					missingIds.map(async (item) => {
						if (
							item.seriesId === undefined ||
							item.seasonNumber === undefined ||
							item.episodeNumber === undefined
						)
							return null;
						const onlineResult = await getSerieSeasonEpisode(
							item.seriesId,
							item.seasonNumber,
							item.episodeNumber
						);
						if (onlineResult) {
							await db.insert(schemaEpisode).values({
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								watchTime: 0
							});
							return {
								id: onlineResult.id,
								tmdb: onlineResult,
								path: null,
								watched: false,
								watchTime: 0,
								updated: new Date(),
								rating: 0
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

		return await db.select().from(schemaEpisode);
	},

	delete: async (id: number) => await db.delete(schemaEpisode).where(eq(schemaEpisode.id, id)),

	update: async (id: number, data: Partial<typeof schemaEpisode.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schemaEpisode).set(data).where(eq(schemaEpisode.id, id));
		} catch (err) {
			console.error(`Update Episode (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existing = await episode.get(id);
		return !existing;
	}
};
