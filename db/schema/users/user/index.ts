import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps } from "../../shared";
import { UserStatusValues } from "@/shared/constants/enums";
import { relations } from "drizzle-orm";
import { media, posts } from "../../gallery";

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

export const userRelations = relations(users, ({ one, many }) => ({
  media: many(media, {
    relationName: "userMedia",
  }),

  posts: many(posts, {
    relationName: "userPosts",
  }),
}));
