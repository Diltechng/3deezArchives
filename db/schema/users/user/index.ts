import { pgTable, text, boolean, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps, primaryId } from "../../shared";
import { UserStatusValues } from "@/shared/constants/enums";
import { relations, sql } from "drizzle-orm";
import { media, posts } from "../../gallery";

/**
 * Users table
 */

export const statusEnum = pgEnum("status", UserStatusValues);

export const users = pgTable(
  "users",
  {
    id: primaryId("id"),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("staff").notNull(),
    status: statusEnum("status").default("active").notNull(),
    onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_unique_idx")
      .on(table.email)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

export const userRelations = relations(users, ({ one, many }) => ({
  media: many(media, {
    relationName: "userMedia",
  }),

  posts: many(posts, {
    relationName: "userPosts",
  }),
}));
