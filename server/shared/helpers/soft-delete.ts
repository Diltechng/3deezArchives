import { db } from "@/db";
import { and, isNull, sql, SQL } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { SoftDeleteInput } from "../types";


export function softDelete(
  executor: typeof db,
  table: PgTableWithColumns<any>,
  options: SoftDeleteInput
) {
  return executor.update(table).set({
    deletedAt: sql`now()`,
    deletedBy: options.actorId,
  }).where(and(
    options.where,
    isNull(table.deletedAt)
  ));
}