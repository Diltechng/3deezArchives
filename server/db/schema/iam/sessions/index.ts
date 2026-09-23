import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { users } from "../users";
import { timestamps } from "../../shared";
import { organisations } from "../organisations";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tokenHash: varchar("token_hash").notNull().unique(),
  
  revoked: boolean("revoked").default(false).notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  
  organisationId: uuid("organisation_id").references(() => organisations.id, { onDelete: "restrict" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  ...timestamps
});