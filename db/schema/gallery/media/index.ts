import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "../../users";
import { moments } from "../moments";
import { timestamps } from "../../shared";

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

  momentId: uuid("moment_id").references(() => moments.id, { onDelete: "cascade" }),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});