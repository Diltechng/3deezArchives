import { db } from "..";
import { toSlug } from "@/shared/utils/slug";
import { categories } from "../schema";

export async function seedCategories() {
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