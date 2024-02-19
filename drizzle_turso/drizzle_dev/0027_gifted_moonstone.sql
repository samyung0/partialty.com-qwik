ALTER TABLE course_approval ADD `ready_for_approval` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE course_approval ADD `added_tags` blob NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `theme`;