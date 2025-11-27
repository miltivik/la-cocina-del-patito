import dotenv from "dotenv";

dotenv.config({
	path: "../../apps/server/.env",
});

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./schema/auth";
import * as savedRecipesSchema from "./schema/saved-recipes";

export const schema = { ...authSchema, ...savedRecipesSchema };

// Create a Pool with SSL configuration for Supabase
// This configuration is required for Vercel serverless functions
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "",
	ssl: process.env.NODE_ENV === "production"
		? { rejectUnauthorized: false }
		: false,
});

export const db = drizzle(pool, { schema });

export * from "./schema/auth";
export * from "./schema/saved-recipes";
export { eq, and, or, not, desc, asc, sql } from "drizzle-orm";
