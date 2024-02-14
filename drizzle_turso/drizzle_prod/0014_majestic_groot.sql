ALTER TABLE content_index ADD `author` text NOT NULL;--> statement-breakpoint
ALTER TABLE `content` DROP COLUMN `author`;