import { db } from '$lib/db/database';
import { collections } from '$lib/db/schema';

import { eq, inArray } from 'drizzle-orm';
import { getCollection } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const collection = {
	add: async (data: typeof collections.$inferInsert) =>
		(await collection.isIDUnique(data.id))
			? await db.insert(collections).values(data)
			: await collection.update(data.id, data),

	get: async (id: number): Promise<typeof collections.$inferSelect | undefined> => {
		let result = await db.query.collections.findFirst({ where: eq(collections.id, id) });
		if (!result && online.current && id !== undefined) {
			result = {
				...(await getCollection(id)),
				updated: new Date(),
				watched: false
			};
			if (result) {
				await db.insert(collections).values(result);
			}
		}
		return result;
	},

	getAll: async (ids?: number[]): Promise<(typeof collections.$inferSelect)[]> => {
		if (ids && ids.length > 0) {
			const localResults = await db.select().from(collections).where(inArray(collections.id, ids));

			const foundIds = localResults.map((item) => item.id);
			const missingIds = ids.filter((id) => !foundIds.includes(id));

			if (missingIds.length > 0 && online.current) {
				const fetchedCollections = await Promise.all(
					missingIds.map(async (id) => {
						if (id === undefined) return null;
						const onlineResult = await getCollection(id);
						if (onlineResult) {
							const collectionWithUpdated = {
								...onlineResult,
								updated: new Date(),
								wantsToWatch: false,
								watched: false
							};
							await db.insert(collections).values(collectionWithUpdated);
							return collectionWithUpdated;
						}

						return null;
					})
				);
				const validFetched = fetchedCollections.filter((c) => c !== null);
				return [...localResults, ...validFetched];
			}
			return localResults;
		}
		return await db.select().from(collections);
	},

	delete: async (id: number) => await db.delete(collections).where(eq(collections.id, id)),

	update: async (id: number, data: Partial<typeof collections.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(collections).set(data).where(eq(collections.id, id));
		} catch (err) {
			console.error(`Update Collection (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existingCollection = await collection.get(id);
		return !existingCollection;
	}
};
