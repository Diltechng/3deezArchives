import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";
import { seedOrganisations } from "./seed/organisations";
import { seedRoles } from "./seed/roles";

async function seed() {
  await seedOrganisations();
  await seedRoles();
  await seedAdmin();
  await seedCategories();
  
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});