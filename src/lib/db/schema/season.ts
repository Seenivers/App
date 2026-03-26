import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiSeason = Awaited<ReturnType<typeof api.media.getSeasonDetails.query>>;

export const season = sqliteTable('season', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	episode: int('episode').notNull().default(1),
	tmdb: text('tmdb', { mode: 'json' }).$type<ApiSeason>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type Season = typeof season.$inferSelect;
export type NewSeason = typeof season.$inferInsert;
