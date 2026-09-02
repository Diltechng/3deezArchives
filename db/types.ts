import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DbSchema } from "./schema";

export type DbClient = NodePgDatabase<DbSchema>;