CREATE TABLE IF NOT EXISTS "users" (
	"device_token" text PRIMARY KEY NOT NULL,
	"push_to_start_token" text NOT NULL,
	"update_token" text NOT NULL
);
