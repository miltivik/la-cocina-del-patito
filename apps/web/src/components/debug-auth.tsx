"use client";

import { debugAuth } from "@/lib/auth-client";

export default function DebugAuth() {
	// Solo mostrar en desarrollo
	if (process.env.NODE_ENV !== 'development') {
		return null;
	}

	const handleDebug = () => {
		const info = debugAuth();
		console.table(info);
	};

	return (
		<div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
			<h3 className="font-bold mb-2">🔍 Auth Debug</h3>
			<button
				onClick={handleDebug}
				className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
			>
				Log Debug Info
			</button>
			<p className="mt-2 text-gray-300">
				Abre la consola para ver los detalles de autenticación
			</p>
		</div>
	);
}
