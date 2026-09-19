import { days } from "@/shared/utils/time"
import { and, gte, lt } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"

export function buildDateFilter(column: PgColumn, startDate?: Date, endDate?: Date) {
  const conditions = [
    startDate
      ? gte(column, startDate)
      : undefined,
    endDate
      ? lt(column, new Date(endDate.getTime() + days(1)))
      : undefined,
  ].filter(Boolean);

  return and(...conditions);
}