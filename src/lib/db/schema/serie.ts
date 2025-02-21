import type { Tv } from '$lib/types/tv';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const serie = sqliteTable('series', {
	id: int('id').notNull().primaryKey().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<Tv>().notNull(),
	updated: int('updated', { mode: 'timestamp' }).notNull().default(new Date(0))
});
