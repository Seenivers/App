import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Settings } from '$lib/types';

export const settings = sqliteTable('settings', {
	id: int('id').primaryKey(),
	language: text('language').notNull().default('en'),
	keywords: text('keywords', { mode: 'json' })
		.notNull()
		.$type<string[]>()
		.default(['mp4', 'tv', 'HD', 'HDTV', '720p', '1080p', '4K', 'HDR', 'HDR10', 'HDR10+', '4K+']),
	adult: int('adult', { mode: 'boolean' }).notNull().default(false),
	toastPosition: text('toastPosition', { mode: 'json' })
		.notNull()
		.$type<Settings['toastPosition']>()
		.default({ horizontal: 'end', vertical: 'bottom' })
});