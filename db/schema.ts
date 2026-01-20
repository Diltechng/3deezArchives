
import { pgTable, uuid, text, timestamp, boolean,varchar } from "drizzle-orm/pg-core";

/**
 * Users table
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  name: text("name").notNull(),
  password: varchar("password").notNull(),
  phone: varchar("phone_number").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
