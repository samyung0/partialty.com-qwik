CREATE TABLE `content_user_quiz` (
	`user_id` text NOT NULL,
	`content_index_id` text NOT NULL,
	`content_id` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`correct_attempts` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`content_id`, `content_index_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`content_index_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action
);
