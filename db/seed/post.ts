import { db } from "..";
import { categories, media, posts } from "../schema";
import { faker } from "@faker-js/faker";
import { isNull } from "drizzle-orm";

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