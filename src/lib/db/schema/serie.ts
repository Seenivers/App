import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiSerie = Awaited<ReturnType<typeof api.media.getTvDetails.query>>;

export const serie = sqliteTable('series', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	wantsToWatch: int('wantsToWatch', { mode: 'boolean' }).notNull().default(false),
	season: int('season').notNull().default(1),
	tmdb: text('tmdb', { mode: 'json' }).$type<ApiSerie>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	rating: int('rating').notNull().default(0)
});

export type Serie = typeof serie.$inferSelect;
export type NewSerie = typeof serie.$inferInsert;
