import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Settings } from '$lib/types/settings';

export const settings = sqliteTable('settings', {
	id: int('id').primaryKey().default(1).unique().notNull(),
	language: text('language').notNull().default('en'),
	keywords: text('keywords', { mode: 'json' })
		.notNull()
		.$type<string[]>()
		.default([
			'mp4',
			'tv',
			'HD',
			'HDTV',
			'720p',
			'1080p',
			'4K',
			'HDR',
			'HDR10',
			'HDR10+',
			'4K+',
			'unrated',
			'proper',
			'limited',
			'internal',
			'telesync',
			'dvdrip',
			'bdrip',
			'xvid',
			'bluray',
			'x264',
			'x265',
			'hevc',
			'Trailer'
		]),
	adult: int('adult', { mode: 'boolean' }).notNull().default(false),
	toastPosition: text('toastPosition', { mode: 'json' })
		.notNull()
		.$type<Settings['toastPosition']>()
		.default({ horizontal: 'end', vertical: 'bottom' }),
	player: text('player').notNull().$type<Settings['player']>().default('Plyr')
});
