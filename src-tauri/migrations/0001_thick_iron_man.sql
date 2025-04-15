PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `__new_settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+","unrated","proper","limited","internal","telesync","dvdrip","bdrip","xvid","bluray","x264","x265","hevc"]' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_settings` (
		"id",
		"language",
		"keywords",
		"adult",
		"toastPosition"
	)
SELECT
	"id",
	"language",
	"keywords",
	"adult",
	"toastPosition"
FROM
	`settings`;

--> statement-breakpoint
DROP TABLE `settings`;

--> statement-breakpoint
ALTER TABLE `__new_settings`
RENAME TO `settings`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;