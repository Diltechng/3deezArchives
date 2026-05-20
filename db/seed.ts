import { db } from ".";
import { categories, users } from "./schema";
import bcrypt from "bcrypt";
import { UserRole } from "@/shared/constants/enums";
import { toSlug } from "@/shared/utils";

async function seedUsers() {
  await db.insert(users).values({
    email: "ghalimusa53@gmail.com",
    passwordHash: await bcrypt.hash("3Deez@Jeerex.4", 10),
    name: "Ghali Musa",
    onboardingCompleted: true,
    role: UserRole.ADMIN,
    status: "active",
  }).onConflictDoNothing();
  
  console.log("User created successfully.");
}

async function seedCategories() {
  await db.insert(categories).values([{
    name: "Company Milestones",
    slug: toSlug("Company Milestones"),
    description: "Major achievements and landmark moments in the company's journey.",
  }, {
    name: "Anniversaries",
    slug: toSlug("Anniversaries"),
    description: "Company anniversaries and celebratory milestones.",
  }, {
    name: "Behind the Scenes",
    slug: toSlug("Behind the Scenes"),
    description: "Everyday office moments, candid memories, and work-life snapshots.",
  }, {
    name: "Tours & Excursions",
    slug: toSlug("Tours & Excursions"),
    description: "Company trips, excursions, sightseeing tours, and travel experiences.",
  }, {
    name: "Corporate Events",
    slug: toSlug("Corporate Events"),
    description: "Internal and external company-organized events.",
  }, {
    name: "Campaigns",
    slug: toSlug("Campaigns"),
    description: "Marketing campaigns, promotional initiatives, and brand activations.",
  }]).onConflictDoNothing({
    target: categories.name
  });

  console.log("Categories created successfully.");
}

async function seed() {
  await seedUsers();
  await seedCategories();

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});