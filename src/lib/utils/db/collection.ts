import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';

export const collection = {
	add: async (data: typeof schema.collections.$inferInsert) =>
		await db.insert(schema.collections).values(data),
	get: async (id: number) =>
		await db.query.collections.findFirst({ where: eq(schema.collections.id, id) }),
	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			return await db.select().from(schema.collections).where(inArray(schema.collections.id, ids));
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
			error(`Update Collection: ${err}`);
		}
	},
	isIDUnique: async (id: number) => {
		const existingCollection = await collection.get(id);
		return !existingCollection;
	}
};
