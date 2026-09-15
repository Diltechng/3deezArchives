import { UserRole } from "../enums";
import { Permission, PERMISSIONS, ALL_PERMISSIONS } from "../permissions.constants";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: ALL_PERMISSIONS,
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