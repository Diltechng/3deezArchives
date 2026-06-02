import { db } from ".";
import { categories, media, posts, users } from "./schema";
import bcrypt from "bcrypt";
import { UserRole } from "@/shared/constants/enums";
import { toSlug } from "@/shared/utils";
import { faker } from "@faker-js/faker";
import { isNull } from "drizzle-orm";

async function seedUsers() {
  await db.insert(users).values([{
    email: "ghalimusa53@gmail.com",
    passwordHash: await bcrypt.hash("3Deez@Jeerex.4", 10),
    name: "Ghali Musa",
    onboardingCompleted: true,
    role: UserRole.ADMIN,
    status: "active",
  }, {
    email: "cyber.guru.075@gmail.com",
    passwordHash: await bcrypt.hash("3Deez@Jeerex.5", 10),
    name: "John Smith",
    onboardingCompleted: true,
    role: UserRole.STAFF,
    status: "active",
  }]).onConflictDoNothing();
  
  console.log("User seeded successfully.");
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

  console.log("Categories seeded successfully.");
}

async function seedPosts() {
  const categorIds = (await db.select().from(categories)).map(category => category.id);
  const coverMediaIds = (await db.select().from(media).where(isNull(media.deletedAt))).map(mediaItem => mediaItem.id);
  
  const data = Array.from({ length: 100 }).map(() => ({
    title: faker.lorem.sentence(),
    dateOfMoment: faker.date.past(),
    visibility: faker.helpers.arrayElement(["public", "admin_only", "private"]),
    categoryId: faker.helpers.arrayElement(categorIds),
    uploadedBy: "4512d1a4-7fc9-4bd3-8052-ea3022d7ed62",
    coverMediaId: faker.helpers.arrayElement(coverMediaIds),
    description: faker.lorem.paragraph(),
    tags: faker.helpers.arrayElements(["music", "live", "event", "test", "archive", "milestone", "studio", "games", "casuals"], {
      min: 2, max: 5
    }),
  }));

  await db.insert(posts)
    .values(data);

  console.log("Posts seeded successfully.");
}

async function seed() {
  await seedUsers();
  await seedCategories();
  await seedPosts();

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});