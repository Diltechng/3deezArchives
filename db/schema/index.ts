import { users, sessions, invitations } from "./users";
import { media, categories, posts } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,
  posts,
  categories,
} as const;

export type DbSchema = typeof schema;
