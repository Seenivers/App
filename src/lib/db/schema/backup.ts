import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const backups = sqliteTable('backups', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	path: text('path').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	/* The size of the file, in bytes.*/
	size: integer('size').notNull()
});
