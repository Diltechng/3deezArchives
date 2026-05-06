import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "../user";
import { timestamps } from "../../shared";

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  tokenHash: varchar("token_hash").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});

