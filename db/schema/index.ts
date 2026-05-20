import { users, sessions, invitations } from "./users";
import { media, categories, gallery } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,
  gallery,
  categories,
} as const;

export type DbSchema = typeof schema;
