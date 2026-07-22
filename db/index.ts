// import "server-only";
import "dotenv/config";
import dotenv from "dotenv";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DbSchema, schema } from "./schema";

dotenv.config({ path: ".env.local" });

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db: NodePgDatabase<DbSchema> = drizzle(pool, { schema });
