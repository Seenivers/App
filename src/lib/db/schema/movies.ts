import type { Movie } from '$lib/types/movie';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const movies = sqliteTable('movies', {
	id: int('id').notNull().primaryKey().unique(),
	path: text('path').notNull().unique(),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<Movie>().notNull(),
	// @ts-ignore
	updated: int('updated', { mode: 'timestamp' }).notNull().default(0)
});
