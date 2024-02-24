CREATE TABLE `course_approval` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`link` text NOT NULL,
	`ready_for_approval` integer DEFAULT false NOT NULL,
	`added_tags` blob NOT NULL,
	`added_categories` text,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rejected_reason` text,
	`need_amendment_reason` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action
);
