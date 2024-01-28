CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`is_index` integer DEFAULT false NOT NULL,
	`chapter_order` blob,
	`blob` text,
	`last_signed_in` text DEFAULT CURRENT_TIMESTAMP,
	`renderedHTML` text,
	`content_slate` blob
);
