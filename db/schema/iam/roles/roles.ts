import { pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../../shared";
import { organisations } from "../organisations";
import { relations, sql } from "drizzle-orm";
import { rolePermissions } from "./rolePermissions";
import { users } from "../users";

export const roles = pgTable("roles", {
  id: primaryId("id"),
  organisationId: uuid("organisation_id").references(() => organisations.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 128 }).notNull(),
  description: text("description"),
  ...timestamps
}, (table) => [
  uniqueIndex("roles_organisation_id_name_unique_index")
    .on(table.organisationId, table.name)
    .where(sql`${table.deletedAt} IS NULL`),
]);

export const rolesRelations = relations(roles, ({ one, many }) => ({
  rolePermissions: many(rolePermissions),
  
  organisation: one(organisations, {
    fields: [roles.organisationId],
    references: [organisations.id]
  }),

  users: many(users),
}));