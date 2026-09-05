import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 50,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

export const database = drizzle(pool);

export const connectDatabase = async () => {
    try {
        await database.execute(sql`SELECT 1`);

        console.info("PostgreSQL database connected");
    } catch (error) {
        console.error("PostgreSQL database connection failed");
        throw error;
    }
};