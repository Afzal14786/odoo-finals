CREATE TYPE "public"."journal_type" AS ENUM('sales', 'purchase', 'bank', 'cash');--> statement-breakpoint
CREATE TABLE "journals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_name" varchar(100) NOT NULL,
	"journal_type" "journal_type" NOT NULL,
	"default_debit_account_id" uuid NOT NULL,
	"default_credit_account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "journals" ADD CONSTRAINT "journals_default_debit_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("default_debit_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journals" ADD CONSTRAINT "journals_default_credit_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("default_credit_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE restrict ON UPDATE no action;