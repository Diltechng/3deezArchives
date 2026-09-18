import { and, isNull, ne } from "drizzle-orm";
import { organisations, users } from "../../../schema";
import { DbTransaction } from "../../../types";
import { PLATFORM_ORGANISATION_ID } from "../../organisations";

const BACKFILL_ORGANISATION_ID = "39e036d8-927b-438d-a937-178fec32dfc3";
const BACKFILL_ORGANISATION_NAME = "3Deez Global Investments Limited";
const BACKFILL_ORGANISATION_DESC = "Founded on the principles of innovation, reliability, and digital transformation, 3Deez Global Investment specializes in custom software development tailored to the unique needs of schools, government agencies, and private enterprises.";

async function backfillOrganisation(tx: DbTransaction) {
  const unorganisedUsers = await tx.select()
    .from(users)
    .where(and(
      isNull(users.organisationId),
      isNull(users.roleId),
      isNull(users.deletedAt),
    ));

  if (unorganisedUsers.length === 0) {
    throw new Error("No users without organisation and role.\nStopping bacfill...");
  }

  await tx.insert(organisations).values({
    id: BACKFILL_ORGANISATION_ID,
    name: BACKFILL_ORGANISATION_NAME,
    description: BACKFILL_ORGANISATION_DESC,
  });

  console.log("Backfill organisation created")
}

export {
  BACKFILL_ORGANISATION_ID,
  backfillOrganisation,
};