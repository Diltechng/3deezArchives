export const PERMISSIONS = {
  POSTS_CREATE: "posts:create",
  POSTS_VIEW: "posts:view",
  POSTS_UPDATE: "posts:update",
  POSTS_DELETE: "posts:delete",

  CATEGORIES_CREATE: "categories:create",
  CATEGORIES_UPDATE: "categories:update",
  CATEGORIES_DELETE: "categories:delete",
  CATEGORIES_VIEW: "categories:view",

  USERS_INVITE: "users:invite",
  USERS_VIEW: "users:view",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_SUSPEND: "users:suspend",

  INVITATIONS_VIEW: "invitations:view"
} as const;

export const PermissionValues = Object.values(PERMISSIONS) as [
  Permission,
  ...Permission[]
];

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_CATEGORY: Record<Permission, string> = {
  [PERMISSIONS.CATEGORIES_CREATE]: "Categories",
  [PERMISSIONS.CATEGORIES_DELETE]: "Categories",
  [PERMISSIONS.CATEGORIES_UPDATE]: "Categories",
  [PERMISSIONS.CATEGORIES_VIEW]: "Categories",

  [PERMISSIONS.INVITATIONS_VIEW]: "Invitations",
  [PERMISSIONS.USERS_INVITE]: "Invitations",

  [PERMISSIONS.POSTS_CREATE]: "Events",
  [PERMISSIONS.POSTS_UPDATE]: "Events",
  [PERMISSIONS.POSTS_DELETE]: "Events",
  [PERMISSIONS.POSTS_VIEW]: "Events",

  [PERMISSIONS.USERS_VIEW]: "Users",
  [PERMISSIONS.USERS_UPDATE]: "Users",
  [PERMISSIONS.USERS_DELETE]: "Users",
  [PERMISSIONS.USERS_SUSPEND]: "Users",
}

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [PERMISSIONS.CATEGORIES_CREATE]: "Can create categories",
  [PERMISSIONS.CATEGORIES_DELETE]: "Can delete categories",
  [PERMISSIONS.CATEGORIES_UPDATE]: "Can update categories",
  [PERMISSIONS.CATEGORIES_VIEW]: "Can view categories",

  [PERMISSIONS.INVITATIONS_VIEW]: "Can view invitations",
  [PERMISSIONS.USERS_INVITE]: "Can invite users",

  [PERMISSIONS.POSTS_CREATE]: "Can create events",
  [PERMISSIONS.POSTS_UPDATE]: "Can update events",
  [PERMISSIONS.POSTS_DELETE]: "Can delete events",
  [PERMISSIONS.POSTS_VIEW]: "Can view events",

  [PERMISSIONS.USERS_VIEW]: "Can view users",
  [PERMISSIONS.USERS_UPDATE]: "Can update users",
  [PERMISSIONS.USERS_DELETE]: "Can delete users",
  [PERMISSIONS.USERS_SUSPEND]: "Can suspend users",
}