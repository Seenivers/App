import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Movie } from '$lib/types/searchMovie';

export const collections = sqliteTable('collection', {
	id: int('id').notNull().primaryKey().unique(),
	name: text('name').notNull(),
	overview: text('overview'),
	poster_path: text('poster_path'),
	backdrop_path: text('backdrop_path'),
	parts: text('parts', { mode: 'json' }).notNull().$type<Movie[]>(),
	// @ts-expect-error "0" ist in Unix-Format vorhanden und daher ist es das gleiche wie Type "Date"
	updated: int('updated', { mode: 'timestamp' }).notNull().default(0)
});
