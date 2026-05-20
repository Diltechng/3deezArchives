import { users, sessions, invitations } from "./users";
import { media, categories, moments } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,
  moments,
  categories,
} as const;

export type DbSchema = typeof schema;
