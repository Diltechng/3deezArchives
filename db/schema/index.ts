import {
  users,
  sessions,
  invitations,
  organisations,
  roles,
  permissions,
  rolePermissions,

  userRelations,
  organisationRelations,
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
} from "./users";
import { media, categories, posts, postRelations, mediaRelations } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,
  posts,
  categories,
  organisations,
  roles,
  permissions,
  rolePermissions,

  postRelations,
  mediaRelations,
  userRelations,
  organisationRelations,
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
} as const;

export type DbSchema = typeof schema;