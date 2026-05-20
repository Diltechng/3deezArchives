import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps } from "../../shared";
import { UserStatusValues } from "@/shared/constants/enums";

/**
 * Users table
 */

export const statusEnum = pgEnum("status", UserStatusValues);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("staff").notNull(),
  status: statusEnum("status").default("active").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  ...timestamps,
});
