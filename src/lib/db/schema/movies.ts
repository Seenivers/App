import type { Movie } from '$lib/types/movie';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const movies = sqliteTable('movies', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<Movie>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
