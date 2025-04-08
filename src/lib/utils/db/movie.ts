import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';

export const movie = {
	add: async (data: typeof schema.movies.$inferInsert) =>
		await db.insert(schema.movies).values(data),
	get: async (id: number) => await db.query.movies.findFirst({ where: eq(schema.movies.id, id) }),
	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			return await db.select().from(schema.movies).where(inArray(schema.movies.id, ids));
		}
		await db.select().from(schema.movies);
	},
	delete: async (id: number) => await db.delete(schema.movies).where(eq(schema.movies.id, id)),
	update: async (id: number, data: Partial<typeof schema.movies.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.movies).set(data).where(eq(schema.movies.id, id));
		} catch (err) {
			error(`Update Movie: ${err}`);
		}
	},
	isIDUnique: async (id: number) => {
		const existingMovie = await movie.get(id);
		return !existingMovie;
	},
	isPathUnique: async (path: string) => {
		const existingMovie = await db.query.movies.findFirst({ where: eq(schema.movies.path, path) });
		return !existingMovie;
	}
};
