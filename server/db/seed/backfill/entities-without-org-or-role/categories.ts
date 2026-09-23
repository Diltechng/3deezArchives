import { categories } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { BACKFILL_ORGANISATION_ID } from "./organisations";
import { and, isNull } from "drizzle-orm";

export async function backfillCategories(tx: DbTransaction) {
  const withoutOrgConditions = [
    isNull(categories.organisationId),
    isNull(categories.deletedAt),
  ];

  await tx.update(categories)
    .set({ organisationId: BACKFILL_ORGANISATION_ID })
    .where(and(...withoutOrgConditions));

  console.log("Categories organisation backfilled successfully");
}