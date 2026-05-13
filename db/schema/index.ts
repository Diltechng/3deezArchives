import { users, verificationTokens, sessions } from "./users";

export * from "./users";

export const schema = {
  users,
  verificationTokens,
  sessions,
} as const;

export type DbSchema = typeof schema;
