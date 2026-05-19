import { db } from "@/db";
import { and, isNull, SQL } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

interface SoftDeleteInput {
  actorId: string;
  where: SQL;
}

export function softDelete(
  executor: typeof db,
  table: PgTableWithColumns<any>,
  options: SoftDeleteInput
) {
  return executor.update(table).set({
    deletedAt: new Date(),
    deletedBy: options.actorId
  }).where(and(
    options.where,
    isNull(table.deletedAt)
  ));
}