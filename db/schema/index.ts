import {
  users,
  sessions,
  invitations,
  organisations,
  roles,
  permissions,

  userRelations,
  organisationRelations,
  rolesRelations,
  permissionsRelations,
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

  postRelations,
  mediaRelations,
  userRelations,
  organisationRelations,
  rolesRelations,
  permissionsRelations,
} as const;

export type DbSchema = typeof schema;