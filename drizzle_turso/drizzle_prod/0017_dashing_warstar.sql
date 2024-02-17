ALTER TABLE profiles ADD `accessible_courses_read` text;--> statement-breakpoint
ALTER TABLE profiles ADD `theme` text DEFAULT 'light' NOT NULL;