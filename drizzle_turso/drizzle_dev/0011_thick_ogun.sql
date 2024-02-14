CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE content ADD `tags` blob;--> statement-breakpoint
ALTER TABLE content ADD `category` text;--> statement-breakpoint
ALTER TABLE content ADD `author` text NOT NULL;