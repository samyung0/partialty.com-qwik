CREATE TABLE `course_approval` (
	`id` text PRIMARY KEY NOT NULL,
	`link` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rejected_reason` text,
	`need_amendment_reason` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE content_index ADD `approval_id` text;