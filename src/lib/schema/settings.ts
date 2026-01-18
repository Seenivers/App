import { themes } from '$lib';
import { z } from 'zod';

const toastPositionSchema = z.object({
	horizontal: z.enum(['start', 'center', 'end']),
	vertical: z.enum(['top', 'center', 'bottom'])
});

const backupConfigSchema = z.object({
	maxAgeDays: z.number().int().min(0),
	maxBackups: z.number().int().min(0),
	maxSizeMB: z.number().int().min(0)
});

const themeSchema = z.enum([...themes.map((v) => v.toLocaleLowerCase()), 'Default']);
const playerSchema = z.enum(['Plyr', 'Vidstack']);
const backupIntervalSchema = z.enum(['manual', 'onStartup', 'daily', 'weekly', 'monthly']);

const defaultKeywords = [
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
];

const defaultIgnoredKeywords = ['Trailer', 'Preview', 'Sample'];

export const settingsSchema = z.object({
	keywords: z.array(z.string()).default(defaultKeywords),
	ignoredKeywords: z.array(z.string()).default(defaultIgnoredKeywords),
	theme: themeSchema.default('default'),
	adult: z.boolean().default(false),
	toastPosition: toastPositionSchema.default({ horizontal: 'end', vertical: 'bottom' }),
	player: playerSchema.default('Plyr'),
	castImages: z.number().int().min(0).default(5),
	discordAktiv: z.boolean().default(true),
	backupInterval: backupIntervalSchema.default('manual'),
	backupConfig: backupConfigSchema.default({ maxAgeDays: 0, maxBackups: 14, maxSizeMB: 0 }),
	watchPaths: z.array(z.string()).default([]),
	tmdbAccountID: z.string().nullable().optional(),
	tmdbAccessToken: z.string().nullable().optional(),
	tmdbGuestSessionId: z.string().nullable().optional(),
	tmdbGuestSessionCreatedAt: z.number().int().nullable().optional(),
	sentryEnabled: z.boolean().default(true),
	sentrySampleRate: z.number().int().min(0).max(100).default(100),
	sentryReplaySampleRate: z.number().int().min(0).max(100).default(10),
	// sentryReplayOnErrorSampleRate: z.number().int().min(0).max(100).default(100),
	// sentryMaxReplayDuration: z.number().int().min(0).default(60_000),
	// sentryBlockAllMedia: z.boolean().default(true),
	sentrySendDefaultPii: z.boolean().default(true)
});

export type Settings = z.infer<typeof settingsSchema>;
