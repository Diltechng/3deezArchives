import { NodePgDatabase, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { DbSchema } from "./schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

export type DbClient = NodePgDatabase<DbSchema>;
export type DbTransaction = PgTransaction<
  NodePgQueryResultHKT,
  DbSchema,
  ExtractTablesWithRelations<DbSchema>
>;