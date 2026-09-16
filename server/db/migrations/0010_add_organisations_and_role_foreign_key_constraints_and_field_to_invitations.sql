ALTER TABLE "invites" ADD COLUMN "organisation_id" uuid;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "role_id" uuid;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;