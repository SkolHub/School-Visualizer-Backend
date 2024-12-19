ALTER TABLE "time_slot" RENAME COLUMN "name" TO "display_name";--> statement-breakpoint
ALTER TABLE "time_slot" RENAME COLUMN "time" TO "start_time";--> statement-breakpoint
ALTER TABLE "time_slot" ADD COLUMN "color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "time_slot" ADD COLUMN "symbol_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "time_slot" ADD COLUMN "end_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "time_slot" ADD COLUMN "weekday" integer NOT NULL;