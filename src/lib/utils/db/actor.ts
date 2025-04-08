import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';

export const actor = {
	add: async (data: typeof schema.actors.$inferInsert) =>
		await db.insert(schema.actors).values(data),
	get: async (id: number) => await db.query.actors.findFirst({ where: eq(schema.actors.id, id) }),
	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			return await db.select().from(schema.actors).where(inArray(schema.actors.id, ids));
		}
		return await db.select().from(schema.actors);
	},
	delete: async (id: number) => await db.delete(schema.actors).where(eq(schema.actors.id, id)),
	update: async (id: number, data: Partial<typeof schema.actors.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.actors).set(data).where(eq(schema.actors.id, id));
		} catch (err) {
			error(`Update Actor: ${err}`);
		}
	},
	isIDUnique: async (id: number) => {
		const existingActor = await actor.get(id);
		return !existingActor;
	}
};
