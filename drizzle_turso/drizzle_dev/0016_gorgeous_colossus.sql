ALTER TABLE content_index ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE content_index ADD `is_deleted` integer DEFAULT false NOT NULL;