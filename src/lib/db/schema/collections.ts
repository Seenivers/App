import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const collections = sqliteTable('collection', {
	id: int('id').notNull().primaryKey(),
	name: text('name').notNull(),
	overview: text('overview').notNull(),
	poster_path: text('poster_path'),
	backdrop_path: text('backdrop_path'),
	part: text('part', { mode: 'json' }).notNull().$type<string[]>()
});
