ALTER TABLE "events" DROP CONSTRAINT "posts_cover_image_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "posts_cover_media_ownership_fk";
--> statement-breakpoint
DROP INDEX "posts_category_id_idx";--> statement-breakpoint
DROP INDEX "posts_date_of_moment_idx";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_cover_media_ownership_fk" FOREIGN KEY ("cover_media_id","uploaded_by") REFERENCES "public"."media"("id","uploaded_by") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_category_id_idx" ON "events" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "events_date_of_moment_idx" ON "events" USING btree ("date_of_moment");