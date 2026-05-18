import { users, sessions, invitations } from "./users";
import { media } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,

} as const;

export type DbSchema = typeof schema;
