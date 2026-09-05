ALTER TABLE "products" RENAME COLUMN "types" TO "type";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "salesPrice" TO "sales_price";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "purchasePrice" TO "purchase_price";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."types";--> statement-breakpoint
CREATE TYPE "public"."types" AS ENUM('goods', 'service', 'combo');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "type" SET DATA TYPE "public"."types" USING "type"::"public"."types";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "archived_at" timestamp;