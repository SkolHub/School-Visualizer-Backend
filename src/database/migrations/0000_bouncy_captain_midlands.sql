CREATE TABLE IF NOT EXISTS "time_slot" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_token" text NOT NULL,
	"name" text NOT NULL,
	"repeat_after" integer NOT NULL,
	"time" time NOT NULL
);
