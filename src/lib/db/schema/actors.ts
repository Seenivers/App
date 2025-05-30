import type { Actor } from '$lib/types/actor';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// https://developer.themoviedb.org/reference/person-details
export const actors = sqliteTable('actors', {
	id: int('id').notNull().unique(),
	name: text('name').notNull(),
	tmdb: text('tmdb').notNull().$type<Actor>(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
