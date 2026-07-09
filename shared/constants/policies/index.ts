import { UserRole } from "../enums";
import { Permission, PERMISSIONS, PermissionValues } from "../permissions";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: PermissionValues,
  [UserRole.STAFF]: [
    PERMISSIONS.POSTS_VIEW,
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,

    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.USERS_VIEW,
  ]
};

export function hasPermission(role: UserRole, permission: Permission) {
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) return false;

  return permissions.includes(permission);
}