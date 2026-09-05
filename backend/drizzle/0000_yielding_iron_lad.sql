CREATE TYPE "public"."contacts" AS ENUM('customer', 'vendor', 'both');--> statement-breakpoint
CREATE TYPE "public"."types" AS ENUM('goods', 'services', 'combo');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('admin', 'accountant');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL,
	"email" text NOT NULL,
	"mobile" text NOT NULL,
	"address" text NOT NULL,
	"profile_url" text DEFAULT null,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"types" "types",
	"salesPrice" integer NOT NULL,
	"purchasePrice" integer NOT NULL,
	"category" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
