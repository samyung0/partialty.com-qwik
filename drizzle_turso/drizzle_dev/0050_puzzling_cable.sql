CREATE TABLE `content_user_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`index_id` text NOT NULL,
	`started_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`finished_date` text,
	`user_id` text NOT NULL,
	`progress` blob NOT NULL,
	FOREIGN KEY (`index_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
