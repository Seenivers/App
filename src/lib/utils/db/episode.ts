import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq, inArray } from 'drizzle-orm';

export const episode = {
	add: async (data: typeof schema.episode.$inferInsert) =>
		await db.insert(schema.episode).values(data),
	get: async (id: number) => await db.query.episode.findFirst({ where: eq(schema.episode.id, id) }),
	getAll: async (ids?: number[]) => {
		if (ids && ids.length > 0) {
			return await db.select().from(schema.episode).where(inArray(schema.episode.id, ids));
		}
		await db.select().from(schema.episode);
	},
	delete: async (id: number) => await db.delete(schema.episode).where(eq(schema.episode.id, id)),
	update: async (id: number, data: Partial<typeof schema.episode.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.episode).set(data).where(eq(schema.episode.id, id));
		} catch (err) {
			error(`Update Episode: ${err}`);
		}
	},
	isIDUnique: async (id: number) => {
		const existingEpisode = await episode.get(id);
		return !existingEpisode;
	}
};
