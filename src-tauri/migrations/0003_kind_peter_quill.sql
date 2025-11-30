ALTER TABLE `settings` ADD `sentryEnabled` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentrySampleRate` integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentryReplaySampleRate` integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentryReplayOnErrorSampleRate` integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentryMaxReplayDuration` integer DEFAULT 60000 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentryBlockAllMedia` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sentrySendDefaultPii` integer DEFAULT true NOT NULL;