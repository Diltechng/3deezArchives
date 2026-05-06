import { users, verificationTokens } from "./users";

export * from "./users";

export const schema = {
  users,
  verificationTokens,
} as const;

export type DbSchema = typeof schema;
