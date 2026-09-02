import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { users } from "../user";
import { timestamps } from "../../shared";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tokenHash: varchar("token_hash").notNull().unique(),

  revoked: boolean("revoked").default(false).notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps
});