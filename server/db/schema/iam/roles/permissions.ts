import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../../shared";
import { relations } from "drizzle-orm";
import { rolePermissions } from "./rolePermissions";
import { Permission, PermissionCategory } from "@/shared/constants/permissions.constants";

export const permissions = pgTable("permissions", {
  id: primaryId("id"),

  name: varchar("name", { length: 100  })
    .unique()
    .notNull()
    .$type<Permission>(),

  category: varchar("category", { length: 100 })
    .notNull()
    .$type<PermissionCategory>(),

  description: text("description"),

  ...timestamps,
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}));