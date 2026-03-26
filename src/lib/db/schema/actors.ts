import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiActor = Awaited<ReturnType<typeof api.media.getPersonDetails.query>>;

// https://developer.themoviedb.org/reference/person-details
export const actors = sqliteTable('actors', {
	id: int('id').notNull().unique(),
	name: text('name').notNull(),
	tmdb: text('tmdb').notNull().$type<ApiActor>(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type Actor = typeof actors.$inferSelect;
export type NewActor = typeof actors.$inferInsert;
