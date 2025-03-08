import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const episode = {
	add: async (data: typeof schema.episode.$inferInsert) =>
		await db.insert(schema.episode).values(data),
	get: async (id: number) => await db.query.episode.findFirst({ where: eq(schema.episode.id, id) }),
	getAll: async () => await db.select().from(schema.episode),
	delete: async (id: number) => await db.delete(schema.episode).where(eq(schema.episode.id, id)),
	update: async (id: number, data: typeof schema.episode.$inferInsert) =>
		await db.update(schema.episode).set(data).where(eq(schema.episode.id, id)),
	isIDUnique: async (id: number) => {
		const existingEpisode = await episode.get(id);
		return !existingEpisode;
	}
};
