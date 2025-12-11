import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@la-cocina-del-patito/db";

// Detectar si estamos en producción
const isProduction =
	process.env.VERCEL === "1" ||
	process.env.VERCEL_ENV === "production" ||
	process.env.VERCEL_ENV === "preview" ||
	process.env.NODE_ENV === "production";

// para evitar state_mismatch por inconsistencia de dominios de cookies
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3001";

// URL del frontend para redirecciones
const frontendURL = process.env.CORS_ORIGIN?.replace(/\/$/, "") || "http://localhost:3000";

console.log("🔐 Auth Configuration:", {
	isProduction,
	baseURL,
	frontendURL,
	corsOrigin: process.env.CORS_ORIGIN,
	hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
	hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
	secretLength: process.env.BETTER_AUTH_SECRET?.length,
	vercelEnv: process.env.VERCEL_ENV,
	vercelUrl: process.env.VERCEL_URL,
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
		// URL del frontend en producción
		"https://la-cocina-del-patito-web.vercel.app",
		// Wildcard para preview deployments de Vercel (frontend)
		"https://*.vercel.app",
		// URL del servidor (baseURL)
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
		useSecureCookies: isProduction,
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: isProduction,
			httpOnly: true,
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 días
		},
		// Deshabilitar CSRF check ya que OAuth usa el parámetro state para protección
		disableCSRFCheck: isProduction,
	},
	// Configuración de cuentas para producción
	account: {
		// Encriptar tokens OAuth para mayor seguridad
		encryptOAuthTokens: true,
		// WORKAROUND: Saltar verificación de cookie de state para dominios .vercel.app
		// Los subdominios de .vercel.app son tratados como "public suffix" por navegadores,
		// lo que impide que las cookies funcionen correctamente entre el frontend y backend.
		// Ref: https://www.better-auth.com/docs/errors/state_mismatch
		// NOTA: Para producción real, usar un dominio personalizado es la solución recomendada.
		// @ts-expect-error - Esta opción existe en la documentación pero puede faltar en las definiciones de tipos
		skipStateCookieCheck: isProduction,
		// Habilitar linking de cuentas entre proveedores
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "email-password"],
			allowDifferentEmails: false,
		},
	},
});
