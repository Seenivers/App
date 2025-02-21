import type { Serie } from '$lib/types/tv';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const season = sqliteTable('season', {
	id: int('id').notNull().primaryKey().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	episode: int('episode').notNull().default(1),
	tmdb: text('tmdb', { mode: 'json' }).$type<Serie>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date(0))
});
