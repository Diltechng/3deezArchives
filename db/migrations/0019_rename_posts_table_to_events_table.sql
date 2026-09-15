ALTER TABLE "posts" RENAME TO "events";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_uploaded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_deleted_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_cover_image_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_cover_media_ownership_fk";
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_post_id_events_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "posts_cover_media_ownership_fk" FOREIGN KEY ("cover_media_id","uploaded_by") REFERENCES "public"."media"("id","uploaded_by") ON DELETE no action ON UPDATE no action;