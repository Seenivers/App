PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `__new_actors` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`tmdb` text NOT NULL,
		`updated` integer DEFAULT '"1970-01-01T00:00:00.000Z"' NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_actors` ("id", "name", "tmdb", "updated")
SELECT
	"id",
	"name",
	"tmdb",
	"updated"
FROM
	`actors`;

--> statement-breakpoint
DROP TABLE `actors`;

--> statement-breakpoint
ALTER TABLE `__new_actors`
RENAME TO `actors`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
CREATE UNIQUE INDEX `actors_id_unique` ON `actors` (`id`);

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `__new_collection` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`overview` text,
		`poster_path` text,
		`backdrop_path` text,
		`parts` text NOT NULL,
		`updated` integer DEFAULT '"1970-01-01T00:00:00.000Z"' NOT NULL
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
	IF NOT EXISTS `__new_movies` (
		`id` integer PRIMARY KEY NOT NULL,
		`path` text NOT NULL,
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
CREATE UNIQUE INDEX `movies_id_unique` ON `movies` (`id`);

--> statement-breakpoint
CREATE UNIQUE INDEX `movies_path_unique` ON `movies` (`path`);