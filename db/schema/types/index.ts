import { verificationTokens } from "../users/token";
import { users } from "../users/user";

export type Users = typeof users.$inferSelect;
export type verificationTokens = typeof verificationTokens.$inferSelect;

