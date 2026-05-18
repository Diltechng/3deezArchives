import { users, sessions, invitations } from "./users";

export * from "./users";

export const schema = {
  users,
  sessions,
  invitations,
} as const;

export type DbSchema = typeof schema;
