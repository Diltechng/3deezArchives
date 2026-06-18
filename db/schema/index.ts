import { users, sessions, invitations, userRelations } from "./users";
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

  postRelations,
  mediaRelations,
  userRelations,
} as const;

export type DbSchema = typeof schema;