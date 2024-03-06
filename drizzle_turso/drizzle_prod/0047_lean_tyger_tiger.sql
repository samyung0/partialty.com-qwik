ALTER TABLE content_category ADD `approved` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE tag ADD `approved` integer DEFAULT true NOT NULL;