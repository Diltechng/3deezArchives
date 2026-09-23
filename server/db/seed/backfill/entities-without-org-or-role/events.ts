import { events } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { and, isNull } from "drizzle-orm";
import { BACKFILL_ORGANISATION_ID } from "./organisations";

export async function backfillEvents(tx: DbTransaction) {
  const withoutOrgConditions = [
    isNull(events.organisationId),
    isNull(events.deletedAt),
  ];

  await tx.update(events)
    .set({ organisationId: BACKFILL_ORGANISATION_ID })
    .where(and(...withoutOrgConditions));

  console.log("Events organisation backfilled successfully");
}