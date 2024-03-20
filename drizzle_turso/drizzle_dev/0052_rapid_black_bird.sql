CREATE TABLE `content_share_token` (
	`id` text PRIMARY KEY NOT NULL,
	`index_id` text NOT NULL,
	`expires` blob,
	FOREIGN KEY (`index_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action
);
