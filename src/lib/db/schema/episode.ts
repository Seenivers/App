import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiEpisode = Awaited<ReturnType<typeof api.media.getEpisodeDetails.query>>;

export const episode = sqliteTable('episode', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<ApiEpisode>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	rating: int('rating').notNull().default(0)
});

export type Episode = typeof episode.$inferSelect;
export type NewEpisode = typeof episode.$inferInsert;
