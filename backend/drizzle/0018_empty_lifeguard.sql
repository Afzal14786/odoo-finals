ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'STAFF' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" text DEFAULT 'ACTIVE' NOT NULL;