ALTER TABLE "gallery" RENAME TO "moments";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "gallery_id" TO "moment_id";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_gallery_id_gallery_id_fk";
--> statement-breakpoint
ALTER TABLE "moments" DROP CONSTRAINT "gallery_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "moments" DROP CONSTRAINT "gallery_uploaded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "moments" DROP CONSTRAINT "gallery_deleted_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;