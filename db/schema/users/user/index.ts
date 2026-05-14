import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";

/**
 * Users table
 */

export const statusEnum = pgEnum("status", ["active", "verified", "pending"])

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  status: statusEnum().default("pending").notNull(),
  ...timestamps,
});
