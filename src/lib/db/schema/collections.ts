import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Movie } from '$lib/types/searchMovie';

export const collections = sqliteTable('collection', {
	id: int('id').notNull().unique(),
	name: text('name').notNull(),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	wantsToWatch: int('wantsToWatch', { mode: 'boolean' }).notNull().default(false),
	overview: text('overview'),
	poster_path: text('poster_path'),
	backdrop_path: text('backdrop_path'),
	parts: text('parts', { mode: 'json' }).notNull().$type<Movie[]>(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
