import { seedAdmin } from "./seed/users";
import { seedCategories } from "./seed/categories";

async function seed() {
  await seedAdmin();
  await seedCategories();
  
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});