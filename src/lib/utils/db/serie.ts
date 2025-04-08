import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';

export const serie = {
	add: async (data: typeof schema.serie.$inferInsert) => await db.insert(schema.serie).values(data),
	get: async (id: number) => await db.query.serie.findFirst({ where: eq(schema.serie.id, id) }),
	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			return await db.select().from(schema.serie).where(inArray(schema.serie.id, ids));
		}
		await db.select().from(schema.serie);
	},
	delete: async (id: number) => await db.delete(schema.serie).where(eq(schema.serie.id, id)),
	update: async (id: number, data: Partial<typeof schema.serie.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.serie).set(data).where(eq(schema.serie.id, id));
		} catch (err) {
			error(`Update Serie: ${err}`);
		}
	},
	isIDUnique: async (id: number) => {
		const existingSerie = await serie.get(id);
		return !existingSerie;
	},
	isPathUnique: async (path: string) => {
		const existingSerie = await db.query.serie.findFirst({ where: eq(schema.serie.path, path) });
		return !existingSerie;
	}
};
