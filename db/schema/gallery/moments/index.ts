import { foreignKey, pgEnum, pgTable, PgTableExtraConfigValue, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { MomentVisibilityValues } from "@/shared/constants/enums";
import { timestamps } from "@/db/schema/shared";
import { categories } from "@/db/schema";
import { media, users } from "@/db/schema";

export const visibilityEnum = pgEnum("visibility", MomentVisibilityValues);

export const moments = pgTable("moments", {
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
    name: "moments_cover_image_id_media_id_fk",
    columns: [table.coverMediaId],
    foreignColumns: [media.id],
  }).onDelete("set null"),

  foreignKey({
    name: "moments_cover_media_ownership_fk",
    columns: [table.coverMediaId, table.uploadedBy],
    foreignColumns: [media.id, media.uploadedBy]
  })
]);