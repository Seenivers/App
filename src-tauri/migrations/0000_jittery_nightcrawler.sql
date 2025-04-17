CREATE TABLE
	`actors` (
		`id` integer NOT NULL,
		`name` text NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `actors_id_unique` ON `actors` (`id`);

--> statement-breakpoint
CREATE TABLE
	`backups` (
		`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		`path` text NOT NULL,
		`created_at` integer NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	`collection` (
		`id` integer NOT NULL,
		`name` text NOT NULL,
		`overview` text,
		`poster_path` text,
		`backdrop_path` text,
		`parts` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `collection_id_unique` ON `collection` (`id`);

--> statement-breakpoint
CREATE TABLE
	`episode` (
		`id` integer NOT NULL,
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
	`movies` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `movies_id_unique` ON `movies` (`id`);

--> statement-breakpoint
CREATE TABLE
	`season` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`episode` integer DEFAULT 1 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `season_id_unique` ON `season` (`id`);

--> statement-breakpoint
CREATE TABLE
	`series` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`season` integer DEFAULT 1 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `series_id_unique` ON `series` (`id`);

--> statement-breakpoint
CREATE TABLE
	`settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+","unrated","proper","limited","internal","telesync","dvdrip","bdrip","xvid","bluray","x264","x265","hevc"]' NOT NULL,
		`ignoredKeywords` text DEFAULT '["Trailer","Preview","Sample"]' NOT NULL,
		`theme` text DEFAULT 'default' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL,
		`player` text DEFAULT 'Plyr' NOT NULL,
		`castImages` integer DEFAULT 5 NOT NULL,
		`discordAktiv` integer DEFAULT true NOT NULL,
		`backupInterval` text DEFAULT 'manual' NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `settings_id_unique` ON `settings` (`id`);