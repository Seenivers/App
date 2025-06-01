PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `__new_settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+","unrated","proper","limited","internal","telesync","dvdrip","bdrip","xvid","bluray","x264","x265","hevc"]' NOT NULL,
		`ignoredKeywords` text DEFAULT '["Trailer","Preview","Sample"]' NOT NULL,
		`theme` text DEFAULT 'Default' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL,
		`player` text DEFAULT 'Plyr' NOT NULL,
		`castImages` integer DEFAULT 5 NOT NULL,
		`discordAktiv` integer DEFAULT true NOT NULL,
		`backupInterval` text DEFAULT 'manual' NOT NULL,
		`backupConfig` text DEFAULT '{"maxAgeDays":0,"maxBackups":14,"maxSizeMB":0}' NOT NULL,
		`watchPaths` text DEFAULT '[]' NOT NULL,
		`tmdbSessionId` text DEFAULT ''
	);

--> statement-breakpoint
INSERT INTO
	`__new_settings` (
		"id",
		"language",
		"keywords",
		"ignoredKeywords",
		"theme",
		"adult",
		"toastPosition",
		"player",
		"castImages",
		"discordAktiv",
		"backupInterval",
		"backupConfig",
		"watchPaths",
		"tmdbSessionId"
	)
SELECT
	"id",
	"language",
	"keywords",
	"ignoredKeywords",
	"theme",
	"adult",
	"toastPosition",
	"player",
	"castImages",
	"discordAktiv",
	"backupInterval",
	COALESCE(
		"backupConfig",
		'{"maxAgeDays":0,"maxBackups":14,"maxSizeMB":0}'
	),
	COALESCE("watchPaths", '[]'),
	COALESCE("tmdbSessionId", '')
FROM
	(
		SELECT
			*,
			'{"maxAgeDays":0,"maxBackups":14,"maxSizeMB":0}' as "backupConfig",
			'[]' as "watchPaths",
			'' as "tmdbSessionId"
		FROM
			`settings`
	);

--> statement-breakpoint
DROP TABLE `settings`;

--> statement-breakpoint
ALTER TABLE `__new_settings`
RENAME TO `settings`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `settings_id_unique` ON `settings` (`id`);

--> statement-breakpoint
ALTER TABLE `backups` ADD `size` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
ALTER TABLE `collection` ADD `watched` integer DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE `collection` ADD `wantsToWatch` integer DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE `movies` ADD `wantsToWatch` integer DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE `series` ADD `wantsToWatch` integer DEFAULT false NOT NULL;