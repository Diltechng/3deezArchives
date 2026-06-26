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
} as const;

export const PermissionValues = Object.values(PERMISSIONS) as [
  Permission,
  ...Permission[]
];

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];