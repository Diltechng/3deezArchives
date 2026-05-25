import { SQL } from "drizzle-orm";

export interface SoftDeleteInput {
  actorId: string;
  where?: SQL;
}