import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";
import { categories } from "../categories";
import { GalleryVisibilityValues } from "@/shared/constants/enums";
import { users } from "../../users";

export const visibilityEnum = pgEnum("visibility", GalleryVisibilityValues);

export const gallery = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  tags: varchar("tags").array(),
  visibility: visibilityEnum("visibility").notNull(),

  dateOfMoment: timestamp("date_of_moment", { withTimezone: true }).notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});