import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";
import { categories } from "../categories";
import { MomentVisibilityValues } from "@/shared/constants/enums";
import { users } from "../../users";

export const visibilityEnum = pgEnum("visibility", MomentVisibilityValues);

export const moments = pgTable("moments", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  title: varchar("title", { length: 255 }).notNull(),
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