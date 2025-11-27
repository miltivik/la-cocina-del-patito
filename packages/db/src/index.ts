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

// SIEMPRE usar SSL para conexiones remotas (no locales)
// Esto es más seguro y simple que detectar el entorno
const shouldUseSSL = !isLocalDatabase;

// Log de configuración para debugging
console.log("🔍 DB Configuration:", {
	env: process.env.NODE_ENV,
	vercelEnv: process.env.VERCEL_ENV,
	vercel: process.env.VERCEL,
	isLocalDatabase,
	shouldUseSSL,
	hasDatabase: !!databaseUrl,
	databaseHost: databaseUrl?.split("@")[1]?.split("/")[0] || "unknown",
});

// Create a Pool with SSL configuration
// Para cualquier conexión remota (no localhost), usar SSL con rejectUnauthorized: false
// Esto es necesario porque servicios como Supabase usan certificados que pueden
// no estar en la cadena de confianza del runtime de Node.js en Vercel
const pool = new Pool({
	connectionString: databaseUrl,
	ssl: shouldUseSSL
		? {
				rejectUnauthorized: false,
			}
		: false,
});

export const db = drizzle(pool, { schema });

export * from "./schema/auth";
export * from "./schema/saved-recipes";
export { eq, and, or, not, desc, asc, sql } from "drizzle-orm";
