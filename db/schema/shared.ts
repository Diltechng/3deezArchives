import { UserRoleValues } from "@/shared/constants/enums";
import { sql } from "drizzle-orm";
import { pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";

export const primaryId = (name: string = "id") =>
  uuid(name).primaryKey().defaultRandom();

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql<Date>`now()`)
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true })
}

export const userRoleEnum = pgEnum("user_role", UserRoleValues);