import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../../shared";
import { permissionEnum } from "../../enums";
import { relations } from "drizzle-orm";
import { rolePermissions } from "./rolePermissions";

export const permissions = pgTable("permissions", {
  id: primaryId("id"),
  name: permissionEnum().unique().notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}));