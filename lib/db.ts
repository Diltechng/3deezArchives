import { config } from "dotenv";
import { Pool } from "pg";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .query("SELECT NOW()")
  .then(res => console.log("PostgreSQL connected:", res.rows[0]))
  .catch(err => console.error("PostgreSQL connection error:", err));
