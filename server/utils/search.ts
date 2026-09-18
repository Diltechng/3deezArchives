import { ilike, or, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export function buildSearch(columns: PgColumn[], search?: string) {
  if (!search || !columns.length)
    return sql`true`;

  const sqlSearch = `%${search}%`;
  return or(...columns.map((c) => ilike(c, sqlSearch)))!;
}