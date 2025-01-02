ALTER TABLE "users" ADD COLUMN "pauseUntil" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_live" boolean DEFAULT false NOT NULL;