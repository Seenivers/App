import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';

export const season = {
	add: async (data: typeof schema.season.$inferInsert) =>
		await db.insert(schema.season).values(data),
	get: async (id: number) => await db.query.season.findFirst({ where: eq(schema.season.id, id) }),
	getAll: async () => await db.select().from(schema.season),
	delete: async (id: number) => await db.delete(schema.season).where(eq(schema.season.id, id)),
	update: async (id: number, data: Partial<typeof schema.season.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.season).set(data).where(eq(schema.season.id, id));
		} catch (err) {
			error(`Update Season: ${err}`);
		}
	},

	isIDUnique: async (id: number) => {
		const existingSeason = await season.get(id);
		return !existingSeason;
	}
};
