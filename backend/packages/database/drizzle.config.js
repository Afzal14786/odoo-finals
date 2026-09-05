import dotenv from "dotenv";
dotenv.config();
import {env} from "./config/env.js";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: './schemas/index.js',
    out: './migrations',
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL
    },
    schemaFilter: ["public"]
});