import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";
import { schema } from "../..";

/**
 * Users table
 */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  ...timestamps,
});
