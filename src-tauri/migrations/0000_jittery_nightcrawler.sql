CREATE TABLE
	IF NOT EXISTS `actors` (
		`id` integer NOT NULL,
		`name` text NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `actors_id_unique` ON `actors` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `backups` (
		`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		`path` text NOT NULL,
		`created_at` integer NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `collection` (
		`id` integer NOT NULL,
		`name` text NOT NULL,
		`overview` text,
		`poster_path` text,
		`backdrop_path` text,
		`parts` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `collection_id_unique` ON `collection` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `episode` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `episode_id_unique` ON `episode` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `movies` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `movies_id_unique` ON `movies` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `season` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`episode` integer DEFAULT 1 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `season_id_unique` ON `season` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `series` (
		`id` integer NOT NULL,
		`path` text,
		`watched` integer DEFAULT false NOT NULL,
		`season` integer DEFAULT 1 NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `series_id_unique` ON `series` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `settings` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `settings_id_unique` ON `settings` (`id`);