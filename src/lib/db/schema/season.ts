import type { Season } from '$lib/types/tv/season';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const season = sqliteTable('season', {
	id: int('id').notNull().unique(),
	path: text('path'),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	episode: int('episode').notNull().default(1),
	tmdb: text('tmdb', { mode: 'json' }).$type<Season>().notNull(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
