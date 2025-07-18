import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type {
	BackupConfig,
	BackupInterval,
	Player,
	Theme,
	ToastPosition
} from '$lib/types/settings';

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
			'hevc'
		]),
	ignoredKeywords: text('ignoredKeywords', { mode: 'json' })
		.notNull()
		.$type<string[]>()
		.default(['Trailer', 'Preview', 'Sample']),
	theme: text('theme').notNull().$type<Theme>().default('Default'),
	adult: int('adult', { mode: 'boolean' }).notNull().default(false),
	toastPosition: text('toastPosition', { mode: 'json' })
		.notNull()
		.$type<ToastPosition>()
		.default({ horizontal: 'end', vertical: 'bottom' }),
	player: text('player').notNull().$type<Player>().default('Plyr'),
	castImages: int('castImages').notNull().default(5), // 5 Actors Bilder Runterladen / 0 = Alle / -1 = Keine
	discordAktiv: int('discordAktiv', { mode: 'boolean' }).notNull().default(true),
	backupInterval: text('backupInterval').notNull().$type<BackupInterval>().default('manual'),
	backupConfig: text('backupConfig', { mode: 'json' })
		.notNull()
		.$type<BackupConfig>()
		.default({ maxAgeDays: 0, maxBackups: 14, maxSizeMB: 0 }),
	watchPaths: text('watchPaths', { mode: 'json' }).notNull().$type<string[]>().default([]),
	tmdbAccountID: text('tmdbAccountID'),
	tmdbAccessToken: text('tmdbAccessToken'),
	tmdbGuestSessionId: text('tmdbGuestSessionId'),
	tmdbGuestSessionCreatedAt: int('tmdbGuestSessionCreatedAt', { mode: 'timestamp' })
});
