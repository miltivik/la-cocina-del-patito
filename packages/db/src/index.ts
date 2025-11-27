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

// Detectar si estamos en producción de múltiples formas
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
const isProductionEnv = process.env.NODE_ENV === "production";

// Detectar si la DATABASE_URL apunta a un servicio de producción (Supabase, Neon, etc.)
const databaseUrl = process.env.DATABASE_URL || "";
const isProductionDatabase =
	databaseUrl.includes("supabase.com") ||
	databaseUrl.includes("pooler.supabase.com") ||
	databaseUrl.includes("neon.tech") ||
	databaseUrl.includes("railway.app") ||
	databaseUrl.includes("render.com");

// Usar SSL si estamos en Vercel, en producción, o conectando a una DB de producción
const shouldUseSSL = isVercel || isProductionEnv || isProductionDatabase;

// Log de configuración para debugging
console.log("🔍 DB Configuration:", {
	env: process.env.NODE_ENV,
	vercelEnv: process.env.VERCEL_ENV,
	vercel: process.env.VERCEL,
	isVercel,
	isProductionEnv,
	isProductionDatabase,
	shouldUseSSL,
	hasDatabase: !!databaseUrl,
	databaseHost: databaseUrl?.split("@")[1]?.split("/")[0] || "unknown",
});

// Create a Pool with SSL configuration
// Para servicios como Supabase, Neon, Railway, etc., siempre necesitamos SSL
// con rejectUnauthorized: false porque sus certificados pueden no estar
// en la cadena de confianza del runtime de Node.js
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
