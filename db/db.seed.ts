import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";
import { seedOrganisations } from "./seed/organisations";

async function seed() {
  await seedAdmin();
  await seedCategories();
  await seedOrganisations();
  
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});