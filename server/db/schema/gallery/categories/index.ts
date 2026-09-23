import { pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";
import { organisations } from "../../iam";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  organisationId: uuid("organisation_id").references(() => organisations.id),

  ...timestamps,
}, (table) => [
  unique("categories_name_unique")
    .on(table.organisationId, table.name),

  unique("categories_slug_unique")
    .on(table.organisationId, table.slug),

  unique("categories_organisation_id_id_unique")
    .on(table.organisationId, table.id),
]);