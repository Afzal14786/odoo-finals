CREATE TYPE "public"."analytic_account_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "analytic_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "analytic_account_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp
);
