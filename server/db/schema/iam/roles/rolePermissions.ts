import { boolean, pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { permissions } from "./permissions";
import { primaryId, timestamps } from "../../shared";
import { relations, sql } from "drizzle-orm";
import { roles } from "./roles";
import { PermissionScope } from "@/shared/constants/permissions.constants";

export const rolePermissions = pgTable("role_permissions", {
  id: primaryId("id"),
  isAllowed: boolean("is_allowed").notNull().default(false),

  permissionId: uuid("permission_id").references(() => permissions.id).notNull(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),

  scope: varchar("scope", { length: 100 })
    .notNull()
    .$type<PermissionScope>(),
  
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