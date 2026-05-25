import { UserRoleValues } from "@/shared/constants/enums";
import { sql } from "drizzle-orm";
import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql<Date>`now()`)
    .notNull(),
}

export const userRoleEnum = pgEnum("user_role", UserRoleValues);