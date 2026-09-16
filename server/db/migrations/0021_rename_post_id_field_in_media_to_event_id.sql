ALTER TABLE "media" RENAME COLUMN "post_id" TO "event_id";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_post_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;