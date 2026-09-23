import { foreignKey, index, pgEnum, pgTable, PgTableExtraConfigValue, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { EventVisibilityValues } from "@/shared/constants/enums";
import { timestamps } from "@/server/db/schema/shared";
import { media, users, categories, organisations } from "@/server/db/schema";
import { relations } from "drizzle-orm";

export const visibilityEnum = pgEnum("visibility", EventVisibilityValues);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  tags: varchar("tags").array(),
  visibility: visibilityEnum("visibility").notNull(),

  dateOfMoment: timestamp("date_of_moment", { withTimezone: true }).notNull(),
  
  organisationId: uuid("organisation_id").references(() => organisations.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  coverMediaId: uuid("cover_media_id"),
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
  
  unique("events_organisation_id_id_unique")
    .on(table.organisationId, table.id),

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