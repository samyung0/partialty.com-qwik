CREATE TABLE `content_group` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`chapter_index` blob NOT NULL,
	`link` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE profiles ADD `accessible_courses` blob;