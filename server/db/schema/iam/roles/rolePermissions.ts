import { boolean, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { permissions } from "./permissions";
import { primaryId, timestamps } from "../../shared";
import { relations, sql } from "drizzle-orm";
import { roles } from "./roles";

export const rolePermissions = pgTable("role_permissions", {
  id: primaryId("id"),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id).notNull(),
  isAllowed: boolean("is_allowed").notNull().default(false),
  ...timestamps,
}, (table) => [
  uniqueIndex("role_permissions_role_id_permission_id_unique_idx")
    .on(table.roleId, table.permissionId)
    .where(sql`${table.deletedAt} IS NULL`)
]);

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),

  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id]
  })
}));