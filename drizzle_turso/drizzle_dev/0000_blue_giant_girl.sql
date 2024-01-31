CREATE TABLE `content_group` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`chapter_index` blob NOT NULL,
	`link` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `content_index` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`chapter_order` blob NOT NULL,
	`link` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`index_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`chapter_order` blob NOT NULL,
	`link` text,
	`renderedHTML` text,
	`content_slate` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`audio_track_playback_id` text,
	`audio_track_asset_id` text,
	FOREIGN KEY (`index_id`) REFERENCES `content_index`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_verification_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` blob,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mux_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`email` text,
	`phone` text,
	`last_signed_in` text DEFAULT CURRENT_TIMESTAMP,
	`role` text DEFAULT 'free' NOT NULL,
	`stripe_id` text,
	`username` text,
	`avatar_url` text NOT NULL,
	`github_id` text,
	`google_id` text,
	`nickname` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`github_username` text,
	`membership_plan` integer,
	`accessible_courses` blob
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_index_slug_unique` ON `content_index` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_email_unique` ON `profiles` (`email`);