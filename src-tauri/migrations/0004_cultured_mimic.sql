ALTER TABLE `actors` ADD `updated` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX `actors_id_unique` ON `actors` (`id`);

--> statement-breakpoint
ALTER TABLE `collection` ADD `updated` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX `collection_id_unique` ON `collection` (`id`);

--> statement-breakpoint
CREATE UNIQUE INDEX `settings_id_unique` ON `settings` (`id`);