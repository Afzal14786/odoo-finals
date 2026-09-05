import "@irctc/config";
import { Pool } from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import { env } from "./config/env";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DB_POOL_MAX ? parseInt(env.DB_POOL_MAX) : 50,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

export const database = drizzle(pool);