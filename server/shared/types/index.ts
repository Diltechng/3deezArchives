import { UserRole } from "@/shared/constants/enums";
import { SQL } from "drizzle-orm";

export interface SoftDeleteInput {
  actorId: string;
  where?: SQL;
}

export interface Principal {
  userId: string;
  role: UserRole;
}