CREATE TABLE
	IF NOT EXISTS `actors` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`profile_path` text,
		`biography` text NOT NULL,
		`adult` integer NOT NULL,
		`known_for_department` text,
		`birthday` integer,
		`deathday` integer,
		`also_known_as` text DEFAULT '[]' NOT NULL,
		`gender` integer DEFAULT 0 NOT NULL,
		`homepage` text,
		`popularity` integer,
		`imdb_id` text NOT NULL,
		`place_of_birth` integer
	);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `collection` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`overview` text NOT NULL,
		`poster_path` text,
		`backdrop_path` text,
		`part` text NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `movies` (
		`id` integer PRIMARY KEY NOT NULL,
		`path` text NOT NULL,
		`watched` integer DEFAULT false NOT NULL,
		`watchTime` integer DEFAULT 0 NOT NULL,
		`tmdb` text NOT NULL
	);

--> statement-breakpoint
CREATE UNIQUE INDEX `movies_path_unique` ON `movies` (`path`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `settings` (
		`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
		`language` text DEFAULT 'en' NOT NULL,
		`keywords` text DEFAULT '["mp4","tv","HD","HDTV","720p","1080p","4K","HDR","HDR10","HDR10+","4K+"]' NOT NULL,
		`adult` integer DEFAULT false NOT NULL,
		`toastPosition` text DEFAULT '{"horizontal":"end","vertical":"bottom"}' NOT NULL
	);