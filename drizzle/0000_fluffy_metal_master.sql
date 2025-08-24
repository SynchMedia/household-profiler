CREATE TABLE `household_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`date_of_birth` text,
	`age` integer,
	`sex` text NOT NULL,
	`height` real,
	`weight` real,
	`activity_level` text NOT NULL,
	`goals` text NOT NULL,
	`allergens` text,
	`exclusions` text,
	`likes` text,
	`dislikes` text,
	`medical_notes` text,
	`created_at` text DEFAULT 'datetime('now')' NOT NULL,
	`updated_at` text DEFAULT 'datetime('now')' NOT NULL
);
