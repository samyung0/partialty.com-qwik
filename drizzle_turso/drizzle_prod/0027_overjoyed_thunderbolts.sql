ALTER TABLE content_category ADD `content_index_id` blob DEFAULT [] NOT NULL;--> statement-breakpoint
ALTER TABLE tag ADD `content_index_id` blob DEFAULT [] NOT NULL;