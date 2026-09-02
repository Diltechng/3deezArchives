import { db } from ".";
import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";
import { seedOrganisations } from "./seed/organisations";
import { seedRoles } from "./seed/roles";
import { seedPermissions } from "./seed/permissions";
import { DbClient } from "./types";

async function seed(db: DbClient) {
  await seedOrganisations(db);
  const roleMap = await seedRoles(db);
  await seedAdmin(db);
  await seedCategories(db);
  await seedPermissions(db);
  
  process.exit(0);
}

seed(db).catch(err => {
  console.error(err);
  process.exit(1);
});