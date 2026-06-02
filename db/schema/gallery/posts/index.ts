import { foreignKey, pgEnum, pgTable, PgTableExtraConfigValue, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { PostVisibilityValues } from "@/shared/constants/enums";
import { timestamps } from "@/db/schema/shared";
import { media, users, categories } from "@/db/schema";
import { relations } from "drizzle-orm";

export const visibilityEnum = pgEnum("visibility", PostVisibilityValues);

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  coverMediaId: uuid("cover_media_id"),
  tags: varchar("tags").array(),
  visibility: visibilityEnum("visibility").notNull(),

  dateOfMoment: timestamp("date_of_moment", { withTimezone: true }).notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
}, (table): PgTableExtraConfigValue[] => [
  foreignKey({
    name: "posts_cover_image_id_media_id_fk",
    columns: [table.coverMediaId],
    foreignColumns: [media.id],
  }).onDelete("set null"),

  foreignKey({
    name: "posts_cover_media_ownership_fk",
    columns: [table.coverMediaId, table.uploadedBy],
    foreignColumns: [media.id, media.uploadedBy]
  })
]);

export const postRelations = relations(posts, ({ one, many }) => ({
  media: many(media, {
    relationName: "postMedia",
  }),
  
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),

  coverMedia: one(media, {
    fields: [posts.coverMediaId],
    references: [media.id],
    relationName: "postCoverMedia",
  }),

  uploadedByUser: one(users, {
    fields: [posts.uploadedBy],
    references: [users.id],
  }),

  deletedByUser: one(users, {
    fields: [posts.deletedBy],
    references: [users.id],
  }),
}));