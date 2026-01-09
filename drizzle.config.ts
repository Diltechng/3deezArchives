import { defineConfig } from "drizzle-kit";
import { resolve } from "path";
import dotenv from "dotenv";

const path = resolve(__dirname, ".env");
const config = dotenv.config({ path });
const url = process.env.DATABASE_URL || config.parsed?.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema.ts",
  out: "./app/db/migrations",
  dbCredentials: { url },
  migrations: {
    table: "__migrations",
    schema: "public",
  },
});
