import { integer, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users, events } from "@/db/schema";
import { timestamps } from "@/db/schema/shared";
import { relations } from "drizzle-orm";

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicId: varchar("public_id").unique().notNull(),
  secureUrl: varchar("secure_url").notNull(),
  assetId: varchar("asset_id").unique().notNull(),
  
  originalFileName: text("original_file_name").notNull(),
  resourceType: varchar("resource_type", { length: 32 }).notNull(),
  format: varchar("format", { length: 16 }).notNull(),
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  bytes: integer("bytes").notNull(),
  width: integer("width"),
  height: integer("height"),

  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull(),
  ...timestamps,
}, (table) => [
  unique("media_id_uploaded_by_uq").on(table.id, table.uploadedBy)
]);

export const mediaRelations = relations(media, ({ one }) => ({
  event: one(events, {
    fields: [media.eventId],
    references: [events.id],
    relationName: "eventMedia"
  }),

  uploadedByUser: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
    relationName: "userMedia",
  }),
}));