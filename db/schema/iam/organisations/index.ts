import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../../shared";
import { relations } from "drizzle-orm";
import { users } from "../users";
import { roles } from "../roles";
import { categories, media, posts } from "../../gallery";

export const organisations = pgTable("organisations", {
  id: primaryId("id"),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: text("description"),
  ...timestamps
});

export const organisationRelations = relations(organisations, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  categories: many(categories),
  media: many(media),
  posts: many(posts),
}));