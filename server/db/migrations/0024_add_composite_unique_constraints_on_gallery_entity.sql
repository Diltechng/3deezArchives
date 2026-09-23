ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_slug_unique";--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "organisation_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "organisation_id" uuid;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "organisation_id" uuid;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_organisation_id_id_unique" UNIQUE("organisation_id","id");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organisation_id_id_unique" UNIQUE("organisation_id","id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_organisation_id_id_unique" UNIQUE("organisation_id","id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("organisation_id","name");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE("organisation_id","slug");