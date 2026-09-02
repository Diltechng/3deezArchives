import { db } from ".";
import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";
import { seedOrganisations } from "./seed/organisations";
import { seedRoles } from "./seed/roles";
import { DbClient } from "./types";

async function seed(db: DbClient) {
  await seedOrganisations(db);
  await seedRoles(db);
  await seedAdmin(db);
  await seedCategories(db);
  
  process.exit(0);
}

seed(db).catch(err => {
  console.error(err);
  process.exit(1);
});