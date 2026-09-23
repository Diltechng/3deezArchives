import { media } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { and, isNull } from "drizzle-orm";
import { BACKFILL_ORGANISATION_ID } from "./organisations";

export async function backfillMedia(tx: DbTransaction) {
  const withoutOrgConditions = [
    isNull(media.organisationId),
    isNull(media.deletedAt),
  ];

  await tx.update(media)
    .set({ organisationId: BACKFILL_ORGANISATION_ID })
    .where(and(...withoutOrgConditions));

  console.log("Media organisation backfilled successfully");
}