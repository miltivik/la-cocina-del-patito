import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@la-cocina-del-patito/db";

// Detectar si estamos en producción
const isProduction =
	process.env.VERCEL === "1" ||
	process.env.VERCEL_ENV === "production" ||
	process.env.VERCEL_ENV === "preview" ||
	process.env.NODE_ENV === "production";

// URL base del servidor (para callbacks de OAuth)
const baseURL = process.env.BETTER_AUTH_URL || process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3001";

console.log("🔐 Auth Configuration:", {
	isProduction,
	baseURL,
	corsOrigin: process.env.CORS_ORIGIN,
	hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
});

export const auth = betterAuth<BetterAuthOptions>({
	baseURL: baseURL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [
		process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.replace(/\/$/, "") : "",
		// También agregar la URL del frontend en producción
		"https://la-cocina-del-patito-web.vercel.app",
	].filter(Boolean),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: isProduction ? "none" : "lax",
			secure: isProduction,
			httpOnly: true,
		},
	},
});
