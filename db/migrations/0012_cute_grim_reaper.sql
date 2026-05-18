CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" varchar NOT NULL,
	"secure_url" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"original_file_name" text NOT NULL,
	"resource_type" varchar(32) NOT NULL,
	"format" varchar(16) NOT NULL,
	"mime_type" varchar(128) NOT NULL,
	"bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "media_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "media_asset_id_unique" UNIQUE("asset_id")
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;