import { foreignKey, index, pgEnum, pgTable, PgTableExtraConfigValue, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { EventVisibilityValues } from "@/shared/constants/enums";
import { timestamps } from "@/db/schema/shared";
import { media, users, categories } from "@/db/schema";
import { relations } from "drizzle-orm";

export const visibilityEnum = pgEnum("visibility", EventVisibilityValues);

export const events = pgTable("events", {
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

  ...timestamps,
}, (table): PgTableExtraConfigValue[] => [
  foreignKey({
    name: "events_cover_image_id_media_id_fk",
    columns: [table.coverMediaId],
    foreignColumns: [media.id],
  }).onDelete("set null"),

  foreignKey({
    name: "events_cover_media_ownership_fk",
    columns: [table.coverMediaId, table.uploadedBy],
    foreignColumns: [media.id, media.uploadedBy],
  }),
  index("events_category_id_idx").on(table.categoryId),
  index("events_date_of_moment_idx").on(table.dateOfMoment),
]);

export const eventRelations = relations(events, ({ one, many }) => ({
  media: many(media, {
    relationName: "eventMedia",
  }),
  
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),

  coverMedia: one(media, {
    fields: [events.coverMediaId],
    references: [media.id],
    relationName: "eventCoverMedia",
  }),

  uploadedByUser: one(users, {
    fields: [events.uploadedBy],
    references: [users.id],
    relationName: "userEvents"
  }),

  deletedByUser: one(users, {
    fields: [events.deletedBy],
    references: [users.id],
  }),
}));