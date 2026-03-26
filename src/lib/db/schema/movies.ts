import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiMovie = Awaited<ReturnType<typeof api.media.getMovieDetails.query>>;

export const movies = sqliteTable('movies', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	wantsToWatch: int('wantsToWatch', { mode: 'boolean' }).notNull().default(false),
	watchTime: int('watchTime').notNull().default(0),
	tmdb: text('tmdb', { mode: 'json' }).$type<ApiMovie>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	rating: int('rating').notNull().default(0)
});

export type Movies = typeof movies.$inferSelect;
export type NewMovies = typeof movies.$inferInsert;
