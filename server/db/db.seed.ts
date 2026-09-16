import { db } from ".";
import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";
import { seedOrganisations } from "./seed/organisations";
import { seedRoles } from "./seed/roles";
import { seedPermissions } from "./seed/permissions";
import { DbClient } from "./types";
import { seedRolePermissions } from "./seed/rolePermissions";

async function seed(db: DbClient) {
  await seedOrganisations(db);
  const roleMap = await seedRoles(db);
  const permissionMap = await seedPermissions(db);
  await seedRolePermissions(db, roleMap, permissionMap);
  await seedAdmin(db);
  await seedCategories(db);
  
  process.exit(0);
}

seed(db).catch(err => {
  console.error(err);
  process.exit(1);
});