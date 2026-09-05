import "@urban-furniture/config";
import {z} from "zod";

const database_connection_environment = z.object({
    DATABASE_URL: z.string().min(1, "database url required"),
    DB_POOL_MAX: z.coerce.number().int().default(50)
});

export const env = database_connection_environment.parse(process.env);