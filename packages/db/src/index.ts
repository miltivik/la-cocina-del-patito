import dotenv from "dotenv";

// Solo cargar dotenv en desarrollo local (no en Vercel)
// En Vercel, las variables de entorno se inyectan automáticamente
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
	dotenv.config({
		path: "../../apps/server/.env",
	});
}

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./schema/auth";
import * as savedRecipesSchema from "./schema/saved-recipes";

export const schema = { ...authSchema, ...savedRecipesSchema };

// Obtener la URL de la base de datos
const databaseUrl = process.env.DATABASE_URL || "";

// Detectar si es una conexión local (localhost, 127.0.0.1, o sin host)
const isLocalDatabase =
	databaseUrl.includes("localhost") ||
	databaseUrl.includes("127.0.0.1") ||
	databaseUrl === "";

// Remover cualquier parámetro sslmode de la URL para evitar conflictos
// Según la documentación de node-postgres, los parámetros SSL en la URL
// sobrescriben el objeto ssl que pasamos al Pool
const cleanDatabaseUrl = databaseUrl.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");

// Log de configuración para debugging
console.log("🔍 DB Configuration:", {
	env: process.env.NODE_ENV,
	vercelEnv: process.env.VERCEL_ENV,
	vercel: process.env.VERCEL,
	isLocalDatabase,
	hasDatabase: !!databaseUrl,
	databaseHost: databaseUrl?.split("@")[1]?.split("/")[0] || "unknown",
	sslEnabled: !isLocalDatabase,
});

// Create a Pool with SSL configuration
// Según la documentación de node-postgres:
// - Para conexiones con certificados auto-firmados, usar ssl: { rejectUnauthorized: false }
// - NO incluir sslmode en la URL porque sobrescribe el objeto ssl
const pool = new Pool({
	connectionString: cleanDatabaseUrl,
	// SSL configuration for cloud providers (Supabase, etc.)
	// rejectUnauthorized: false es necesario para certificados auto-firmados
	ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export * from "./schema/auth";
export * from "./schema/saved-recipes";
export { eq, and, or, not, desc, asc, sql } from "drizzle-orm";
