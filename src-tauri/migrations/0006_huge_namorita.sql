PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	`__new_movies` (
		`id` integer PRIMARY KEY NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer DEFAULT '"1970-01-01T00:00:00.000Z"' NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_movies` (
		"id",
		"path",
		"watched",
		"watchTime",
		"tmdb",
		"updated"
	)
SELECT
	"id",
	"path",
	"watched",
	"watchTime",
	"tmdb",
	"updated"
FROM
	`movies`;

--> statement-breakpoint
DROP TABLE `movies`;

--> statement-breakpoint
ALTER TABLE `__new_movies`
RENAME TO `movies`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
CREATE UNIQUE INDEX `movies_id_unique` ON `movies` (`id`);

--> statement-breakpoint
CREATE TABLE
	`__new_settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+","unrated","proper","limited","internal","telesync","dvdrip","bdrip","xvid","bluray","x264","x265","hevc","Trailer"]' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL,
		`player` text DEFAULT 'Plyr' NOT NULL,
		`castImages` integer DEFAULT 5 NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_settings` (
		"id",
		"language",
		"keywords",
		"adult",
		"toastPosition",
		"player",
		"castImages"
	)
SELECT
	"id",
	"language",
	"keywords",
	"adult",
	"toastPosition",
	COALESCE("player", 'Plyr'),
	COALESCE("castImages", 5)
FROM
	(
		SELECT
			*,
			'Plyr' as player,
			5 as castImages
		FROM
			settings
	);

--> statement-breakpoint
DROP TABLE `settings`;

--> statement-breakpoint
ALTER TABLE `__new_settings`
RENAME TO `settings`;

--> statement-breakpoint
CREATE UNIQUE INDEX `settings_id_unique` ON `settings` (`id`);