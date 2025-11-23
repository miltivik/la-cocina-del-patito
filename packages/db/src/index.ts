import dotenv from "dotenv";

dotenv.config({
	path: "../../apps/server/.env",
});

import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";
import * as savedRecipesSchema from "./schema/saved-recipes";

export const schema = { ...authSchema, ...savedRecipesSchema };
export const db = drizzle(process.env.DATABASE_URL || "", { schema });

export * from "./schema/auth";
export * from "./schema/saved-recipes";
export { eq, and, or, not, desc, asc, sql } from "drizzle-orm";
