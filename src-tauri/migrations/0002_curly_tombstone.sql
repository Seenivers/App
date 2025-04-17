ALTER TABLE `movies` ADD `updated` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX `movies_id_unique` ON `movies` (`id`);