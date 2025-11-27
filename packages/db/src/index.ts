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

// Detectar si estamos en producción usando VERCEL_ENV, VERCEL o NODE_ENV
// Vercel establece VERCEL=1 y VERCEL_ENV en todos los deployments
const isProduction =
	process.env.VERCEL === "1" ||
	process.env.VERCEL_ENV === "production" ||
	process.env.VERCEL_ENV === "preview" ||
	process.env.NODE_ENV === "production";

// Log de configuración para debugging en producción
console.log("🔍 DB Configuration:", {
	env: process.env.NODE_ENV,
	vercelEnv: process.env.VERCEL_ENV,
	vercel: process.env.VERCEL,
	isProduction,
	hasDatabase: !!process.env.DATABASE_URL,
	databaseHost: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0],
});

// Create a Pool with SSL configuration for Supabase
// Supabase requiere SSL en producción. Usamos rejectUnauthorized: false
// para aceptar el certificado de Supabase que puede ser auto-firmado en algunos casos
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "",
	// En producción (Vercel), siempre usar SSL con rejectUnauthorized: false
	// Esto es seguro porque Supabase usa TLS válido, pero el certificado
	// puede no estar en la cadena de confianza del runtime de Node.js en Vercel
	ssl: isProduction
		? {
				rejectUnauthorized: false,
			}
		: false,
});

export const db = drizzle(pool, { schema });

export * from "./schema/auth";
export * from "./schema/saved-recipes";
export { eq, and, or, not, desc, asc, sql } from "drizzle-orm";
