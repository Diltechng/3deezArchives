import { pgTable, text, boolean, pgEnum, uniqueIndex, uuid, foreignKey } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps, primaryId } from "../../shared";
import { UserStatusValues } from "@/shared/constants/enums";
import { relations, sql } from "drizzle-orm";
import { media, events } from "../../gallery";
import { organisations } from "../organisations";
import { roles } from "../roles";

/**
 * Users table
 */

export const statusEnum = pgEnum("status", UserStatusValues);

export const users = pgTable(
  "users",
  {
    id: primaryId("id"),
    organisationId: uuid("organisation_id").references(() => organisations.id, { onDelete: "restrict" }),
    roleId: uuid("role_id").references(() => roles.id, { onDelete: "restrict" }),
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

    foreignKey({
        name: "users_organisation_id_role_id_fk",
        columns: [table.organisationId, table.roleId],
        foreignColumns: [roles.organisationId, roles.id],
      })
      .onDelete("restrict"),
  ]
);

export const userRelations = relations(users, ({ one, many }) => ({
  media: many(media, {
    relationName: "userMedia",
  }),

  posts: many(events, {
    relationName: "userPosts",
  }),
}));
