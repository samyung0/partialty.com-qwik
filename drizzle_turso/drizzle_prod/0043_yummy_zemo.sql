CREATE TABLE `content_index` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`chapter_order` blob NOT NULL,
	`link` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_single_page` integer DEFAULT false NOT NULL,
	`author` text NOT NULL,
	`tags` blob,
	`category` text,
	`created_by_admin` integer DEFAULT false NOT NULL,
	`lang` text NOT NULL,
	`supported_lang` blob NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`index_id` text NOT NULL,
	`slug` text,
	`name` text NOT NULL,
	`link` text,
	`renderedHTML` text,
	`content_slate` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`audio_track_playback_id` text,
	`audio_track_asset_id` text,
	`is_deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`index_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `course_approval` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`link` text NOT NULL,
	`ready_for_approval` integer DEFAULT false NOT NULL,
	`added_tags` blob NOT NULL,
	`added_categories` text,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rejected_reason` text,
	`need_amendment_reason` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action
);
