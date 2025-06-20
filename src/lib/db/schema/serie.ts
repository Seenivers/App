import type { Serie } from '$lib/types/tv/serie';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const serie = sqliteTable('series', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	wantsToWatch: int('wantsToWatch', { mode: 'boolean' }).notNull().default(false),
	season: int('season').notNull().default(1),
	tmdb: text('tmdb', { mode: 'json' }).$type<Serie>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	rating: int('rating').notNull().default(0)
});
