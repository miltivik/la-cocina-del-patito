import type { auth } from "@la-cocina-del-patito/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Función de diagnóstico para debugging
export const debugAuth = () => {
	console.log("🔍 Auth Debug Info:");
	console.log("- NEXT_PUBLIC_SERVER_URL:", process.env.NEXT_PUBLIC_SERVER_URL);
	console.log("- Current cookies:", document.cookie);
	console.log("- Location:", window.location.href);

	// Verificar si hay cookies de better-auth
	const cookies = document.cookie.split(';').map(c => c.trim());
	const authCookies = cookies.filter(c => c.startsWith('better-auth'));
	console.log("- Better Auth cookies:", authCookies);

	return {
		serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
		cookies: document.cookie,
		authCookies,
		location: window.location.href
	};
};

// Hacer debug disponible globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	(window as any).debugAuth = debugAuth;
}

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		// Asegurar que las cookies se envíen con las requests
		credentials: "include",
		onRequest: (context) => {
			console.log("🔄 Auth request:", context.url);
		},
		onResponse: (context) => {
			console.log("📥 Auth response:", context.response.status, context.response.headers.get('set-cookie'));
		},
	},
});
