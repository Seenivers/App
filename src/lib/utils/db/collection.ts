import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';
import { getCollection } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const collection = {
	add: async (data: typeof schema.collections.$inferInsert) =>
		await db.insert(schema.collections).values(data),

	get: async (id: number) => {
		let result = await db.query.collections.findFirst({ where: eq(schema.collections.id, id) });
		if (!result && online.current && id !== undefined) {
			result = { ...(await getCollection(id)), updated: new Date() };
			if (result) {
				await db.insert(schema.collections).values(result);
			}
		}
		return result;
	},

	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			const localResults = await db
				.select()
				.from(schema.collections)
				.where(inArray(schema.collections.id, ids));

			const foundIds = localResults.map((item) => item.id);
			const missingIds = ids.filter((id) => !foundIds.includes(id));

			if (missingIds.length > 0 && online.current) {
				const fetchedCollections = await Promise.all(
					missingIds.map(async (id) => {
						if (id === undefined) return null;
						const onlineResult = await getCollection(id);
						if (onlineResult) {
							const collectionWithUpdated = { ...onlineResult, updated: new Date() };
							await db.insert(schema.collections).values(collectionWithUpdated);
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
		return await db.select().from(schema.collections);
	},

	delete: async (id: number) =>
		await db.delete(schema.collections).where(eq(schema.collections.id, id)),

	update: async (id: number, data: Partial<typeof schema.collections.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.collections).set(data).where(eq(schema.collections.id, id));
		} catch (err) {
			error(`Update Collection (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number) => {
		const existingCollection = await collection.get(id);
		return !existingCollection;
	}
};
