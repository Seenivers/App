import type { Episode } from '$lib/types/tv/episode';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const episode = sqliteTable('episode', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<Episode>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
