import type { api } from '$lib/trpc';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type ApiCollection = Awaited<ReturnType<typeof api.media.getCollectionDetails.query>>;

export const collections = sqliteTable('collection', {
	id: int('id').notNull().unique(),
	name: text('name').notNull(),
	watched: int('watched', { mode: 'boolean' }).notNull().default(false),
	overview: text('overview'),
	poster_path: text('poster_path'),
	backdrop_path: text('backdrop_path'),
	parts: text('parts', { mode: 'json' }).notNull().$type<ApiCollection['parts']>(),
	updated: int('updated', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
