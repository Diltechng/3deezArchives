import { ORGANISATION_ADMIN_CODE, ORGANISATION_ADMIN_DESCRIPTION, ORGANISATION_ADMIN_NAME } from "@/server/lib/constants";
import { roles } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { BACKFILL_ORGANISATION_ID } from "./organisations";

const BACKFILL_ORGANISATION_ADMIN_ID = "041afb08-a0d3-49ba-b6c1-4859852da2d7";
const BACKFILL_ORGANISATION_MEMBER_ID = "1ba07e34-fd4f-4d14-81be-ddfeda26243a";

async function backfillRoles(tx: DbTransaction) {
  await tx.insert(roles)
    .values([
      {
        id: BACKFILL_ORGANISATION_ADMIN_ID,
        organisationId: BACKFILL_ORGANISATION_ID,
        name: ORGANISATION_ADMIN_NAME,
        code: ORGANISATION_ADMIN_CODE,
        description: ORGANISATION_ADMIN_DESCRIPTION,
      },
      {
        id: BACKFILL_ORGANISATION_MEMBER_ID,
        organisationId: BACKFILL_ORGANISATION_ID,
        name: "Member",
        code: "MEMBER",
        description: "Organisation member role.",
      }
    ]);

    console.log("Backfill roles created")
}

export {
  BACKFILL_ORGANISATION_ADMIN_ID,
  BACKFILL_ORGANISATION_MEMBER_ID,
  backfillRoles,
};