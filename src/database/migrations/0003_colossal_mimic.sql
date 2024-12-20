DROP TABLE "time_slot" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "start_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "push_to_start_token";