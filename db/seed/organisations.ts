import { organisations } from "../schema";
import { DbClient } from "../types";

export const PLATFORM_ORGANISATION_ID = "00000000-0000-0000-0000-000000000001";

export async function seedOrganisations(db: DbClient) {
  await db.insert(organisations).values({
    id: PLATFORM_ORGANISATION_ID,
    name: "Platform Organisation",
    description: "Platform organisation for development and maintenance",
  }).onConflictDoNothing();

  console.log("Organisations seeded successfully.");
}