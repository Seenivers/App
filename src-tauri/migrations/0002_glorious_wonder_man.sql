ALTER TABLE `episode` ADD `rating` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
ALTER TABLE `movies` ADD `rating` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
ALTER TABLE `series` ADD `rating` integer DEFAULT 0 NOT NULL;

--> statement-breakpoint
ALTER TABLE `settings` ADD `tmdbAccountID` text;

--> statement-breakpoint
ALTER TABLE `settings` ADD `tmdbAccessToken` text;

--> statement-breakpoint
ALTER TABLE `settings` ADD `tmdbGuestSessionId` text;

--> statement-breakpoint
ALTER TABLE `settings` ADD `tmdbGuestSessionCreatedAt` integer;

--> statement-breakpoint
ALTER TABLE `settings`
DROP COLUMN `tmdbSessionId`;

--> statement-breakpoint
ALTER TABLE `collection`
DROP COLUMN `wantsToWatch`;