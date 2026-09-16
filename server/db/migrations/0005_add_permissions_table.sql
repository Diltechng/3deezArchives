CREATE TYPE "public"."permission_enum" AS ENUM('posts:create', 'posts:view', 'posts:update', 'posts:delete', 'categories:create', 'categories:update', 'categories:delete', 'categories:view', 'users:invite', 'users:view', 'users:update', 'users:delete', 'users:suspend', 'invitations:view');--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "permission_enum" NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
