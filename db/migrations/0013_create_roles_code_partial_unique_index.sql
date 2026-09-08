DROP INDEX "roles_organisation_id_name_unique_index";--> statement-breakpoint
CREATE UNIQUE INDEX "roles_organisation_id_name_unique_idx" ON "roles" USING btree ("organisation_id","name") WHERE "roles"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "roles_organisation_id_code_unique_idx" ON "roles" USING btree ("organisation_id","code") WHERE "roles"."deleted_at" IS NULL;