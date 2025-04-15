PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	IF NOT EXISTS `__new_collection` (
		`id` integer PRIMARY KEY NOT NULL,
		`name` text NOT NULL,
		`overview` text,
		`poster_path` text,
		`backdrop_path` text,
		`parts` text NOT NULL
	);

--> statement-breakpoint
INSERT INTO
	`__new_collection` (
		"id",
		"name",
		"overview",
		"poster_path",
		"backdrop_path",
		"parts"
	)
SELECT
	"id",
	"name",
	"overview",
	"poster_path",
	"backdrop_path",
	"parts"
FROM
	`collection`;

--> statement-breakpoint
DROP TABLE `collection`;

--> statement-breakpoint
ALTER TABLE `__new_collection`
RENAME TO `collection`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;