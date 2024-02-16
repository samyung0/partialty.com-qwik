CREATE TABLE `content_category` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE content_index ADD `created_by_admin` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE content_index ADD `lang` blob;