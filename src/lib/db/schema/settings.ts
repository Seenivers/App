import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Settings-Tabelle (Key-Value-Format)
export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(), // Eindeutiger Schlüssel
	value: text('value').notNull() // Wert als Text gespeichert (JSON möglich)
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
