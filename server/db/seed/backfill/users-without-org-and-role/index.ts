import { db } from "../../..";
import { DbClient } from "../../../types";
import { backfillCategories } from "./categories";
import { backfillEvents } from "./events";
import { backfillMedia } from "./media";
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
    await backfillCategories(tx);
    await backfillEvents(tx);
    await backfillMedia(tx);
  });
}

main(db)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });