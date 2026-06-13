import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../auth-schema";

const pool = new Pool({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "123456",
  database: "better_auth_showcase",
  ssl: false,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;