import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description").notNull(),
  ...timestamps,
});