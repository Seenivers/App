import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const serie = {
	add: async (data: typeof schema.serie.$inferInsert) => await db.insert(schema.serie).values(data),
	get: async (id: number) => await db.query.serie.findFirst({ where: eq(schema.serie.id, id) }),
	getAll: async () => await db.select().from(schema.serie),
	delete: async (id: number) => await db.delete(schema.serie).where(eq(schema.serie.id, id)),
	update: async (id: number, data: typeof schema.serie.$inferInsert) =>
		await db.update(schema.serie).set(data).where(eq(schema.serie.id, id)),
	isIDUnique: async (id: number) => {
		const existingSerie = await serie.get(id);
		return !existingSerie;
	},
	isPathUnique: async (path: string) => {
		const existingSerie = await db.query.serie.findFirst({ where: eq(schema.serie.path, path) });
		return !existingSerie;
	}
};
