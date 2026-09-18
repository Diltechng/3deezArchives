import { db } from "../../..";
import { DbClient } from "../../../types";
import { backfillOrganisation } from "./organisations";
import { backfillRolePermissions } from "./rolePermissions";
import { backfillRoles } from "./roles";
import { backfillUsers } from "./users";

async function main(db: DbClient) {
  await db.transaction(async (tx) => {
    await backfillOrganisation(tx);
    await backfillRoles(tx);
    await backfillRolePermissions(tx);
    await backfillUsers(tx);
  });
}

main(db)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });