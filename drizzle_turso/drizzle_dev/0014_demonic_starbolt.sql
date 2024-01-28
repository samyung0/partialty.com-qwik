ALTER TABLE content ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `content_slug_unique` ON `content` (`slug`);