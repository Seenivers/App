CREATE TABLE
	IF NOT EXISTSbackups ` (
	` id ` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	` path ` text NOT NULL,
	` created_at ` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTSepisode` (
		`id` integer PRIMARY KEY NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `episode_id_unique` ON `episode` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTSseason ` (
	` id ` integer PRIMARY KEY NOT NULL,
	` path ` text,
	` watched ` integer DEFAULT false NOT NULL,
	` episode ` integer DEFAULT 1 NOT NULL,
	` tmdb ` text NOT NULL,
	` updated ` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX ` season_id_unique ` ON ` season ` (` id `);--> statement-breakpoint
CREATE TABLE IF NOT EXISTSseries` (
		`id` integer PRIMARY KEY NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`season` integer DEFAULT 1 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `series_id_unique` ON `series` (`id`);

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS__new_actors ` (
	` id ` integer PRIMARY KEY NOT NULL,
	` name ` text NOT NULL,
	` tmdb ` text NOT NULL,
	` updated ` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO ` __new_actors `("id", "name", "tmdb", "updated") SELECT "id", "name", "tmdb", "updated" FROM ` actors `;--> statement-breakpoint
DROP TABLE ` actors `;--> statement-breakpoint
ALTER TABLE ` __new_actors ` RENAME TO ` actors `;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX ` actors_id_unique ` ON ` actors ` (` id `);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS__new_collection` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`overview` text,
		`poster_path` text,
		`backdrop_path` text,
		`parts` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_collection` (
		"id",
		"name",
		"overview",
		"poster_path",
		"backdrop_path",
		"parts",
		"updated"
	)
SELECT
	"id",
	"name",
	"overview",
	"poster_path",
	"backdrop_path",
	"parts",
	"updated"
FROM
	`collection`;

--> statement-breakpoint
DROP TABLE `collection`;

--> statement-breakpoint
ALTER TABLE `__new_collection`
RENAME TO `collection`;

--> statement-breakpoint
CREATE UNIQUE INDEX `collection_id_unique` ON `collection` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS__new_movies ` (
	` id ` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	` path ` text,
	` watched ` integer DEFAULT false NOT NULL,
	` watchTime ` integer DEFAULT 0 NOT NULL,
	` tmdb ` text NOT NULL,
	` updated ` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO ` __new_movies `("id", "path", "watched", "watchTime", "tmdb", "updated") SELECT "id", "path", "watched", "watchTime", "tmdb", "updated" FROM ` movies `;--> statement-breakpoint
DROP TABLE ` movies `;--> statement-breakpoint
ALTER TABLE ` __new_movies ` RENAME TO ` movies `;--> statement-breakpoint
CREATE UNIQUE INDEX ` movies_id_unique ` ON ` movies ` (` id `);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS__new_settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+","unrated","proper","limited","internal","telesync","dvdrip","bdrip","xvid","bluray","x264","x265","hevc"]',
		`ignoredKeywords` text DEFAULT '["Trailer","Preview","Sample"]',
		`theme` text DEFAULT 'default' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL,
		`player` text DEFAULT 'Plyr' NOT NULL,
		`castImages` integer DEFAULT 5 NOT NULL,
		`discordAktiv` integer DEFAULT true NOT NULL,
		`backupInterval` text DEFAULT 'manual' NOT NULL
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
		"backupInterval"
	)
SELECT
	"id",
	"language",
	"keywords",
	CASE
		WHEN "ignoredKeywords" IS NULL
		OR TRIM("ignoredKeywords") = ''
		OR NOT json_valid ("ignoredKeywords") THEN '["Trailer", "Preview", "Sample"]'
		ELSE "ignoredKeywords"
	END,
	CASE
		WHEN TRIM("theme") = ''
		OR "theme" IS NULL
		OR "theme" = 'theme' THEN 'default'
		ELSE "theme"
	END,
	"adult",
	"toastPosition",
	"player",
	"castImages",
	CASE
		WHEN TRIM("discordAktiv") = ''
		OR "discordAktiv" IS NULL
		OR "discordAktiv" = 'discordAktiv' THEN true
		ELSE "discordAktiv"
	END,
	CASE
		WHEN TRIM("backupInterval") = ''
		OR "backupInterval" IS NULL
		OR "backupInterval" = 'backupInterval' THEN 'manual'
		ELSE "backupInterval"
	END
FROM
	`settings`;

--> statement-breakpoint
DROP TABLE `settings`;

--> statement-breakpoint
ALTER TABLE `__new_settings`
RENAME TO `settings`;

--> statement-breakpoint
CREATE UNIQUE INDEX `settings_id_unique` ON `settings` (`id`);