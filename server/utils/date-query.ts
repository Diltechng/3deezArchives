import { days } from "@/shared/utils/time"
import { and, gte, lt } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"

export function buildDateFilter(column: PgColumn, dateFrom?: Date, dateTo?: Date) {
  const conditions = [
    dateFrom
      ? gte(column, dateFrom)
      : undefined,
    dateTo
      ? lt(column, new Date(dateTo.getTime() + days(1)))
      : undefined,
  ].filter(Boolean);

  return and(...conditions);
}