DROP TABLE `content_group`;--> statement-breakpoint
ALTER TABLE content_index ADD `tags` blob;--> statement-breakpoint
ALTER TABLE content_index ADD `category` text;--> statement-breakpoint
ALTER TABLE `content` DROP COLUMN `tags`;--> statement-breakpoint
ALTER TABLE `content` DROP COLUMN `category`;