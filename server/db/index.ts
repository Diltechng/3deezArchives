// import "server-only";
import "dotenv/config";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema";
import { DbClient } from "./types";
import { env } from "../lib/env";

dotenv.config({ path: ".env.local" });

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db: DbClient = drizzle(pool, { schema });
