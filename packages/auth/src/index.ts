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
const baseURL =
	process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: process.env.BETTER_AUTH_URL
			? process.env.BETTER_AUTH_URL
			: process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3001";

// URL del frontend para redirecciones
const frontendURL = process.env.CORS_ORIGIN?.replace(/\/$/, "") || "http://localhost:3000";

console.log("🔐 Auth Configuration:", {
	isProduction,
	baseURL,
	frontendURL,
	corsOrigin: process.env.CORS_ORIGIN,
	hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
	hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
});

export const auth = betterAuth<BetterAuthOptions>({
	baseURL: baseURL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [
		frontendURL,
		// También agregar la URL del frontend en producción
		"https://la-cocina-del-patito-web.vercel.app",
		// Permitir la URL de Vercel actual (para previews)
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
		// Permitir el baseURL del servidor
		baseURL,
	].filter(Boolean),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			// Configurar explícitamente el redirectURI para evitar state_mismatch
			redirectURI: `${baseURL}/api/auth/callback/google`,
		},
	},
	advanced: {
		// Usar crossSubDomainCookies para manejar cookies entre dominios
		crossSubDomainCookies: {
			enabled: isProduction,
			domain: isProduction ? ".vercel.app" : undefined,
		},
		defaultCookieAttributes: {
			// En producción con cross-origin, usar "none" con secure
			// En desarrollo, usar "lax" para evitar problemas
			sameSite: isProduction ? "none" : "lax",
			secure: isProduction,
			httpOnly: true,
			// Establecer path explícito
			path: "/",
		},
	},
});
