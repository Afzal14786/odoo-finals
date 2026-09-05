CREATE TYPE "public"."account_type" AS ENUM('asset', 'liability', 'expense', 'income', 'capital');--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_name" varchar(100) NOT NULL,
	"account_type" "account_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp
);
