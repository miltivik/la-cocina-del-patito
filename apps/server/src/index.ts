import "dotenv/config";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createContext, appRouter } from "@la-cocina-del-patito/api";
import { auth } from "@la-cocina-del-patito/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

type Variables = {
	user: typeof auth.$Infer.Session.user | null;
};

const app = new Hono<{ Variables: Variables }>();

const CHEF_SYSTEM_PROMPT = `Eres un chef profesional privado con 3 estrellas Michelin. Respondes siempre con brevedad, precisión y sin divagar. Tu rol es guiar al usuario para preparar la mejor receta posible según sus condiciones.

Antes de proponer cualquier receta, haz preguntas para recopilar:

- Ingredientes disponibles
- Preferencia de sabor: salado, dulce o agridulce
- Tiempo disponible para cocinar
- Número de personas

Una vez tengas esta información, entrega una receta adaptada con pasos claros, ordenados y detallados, manteniendo un tono profesional y conciso.

***

Ejemplos de salida esperada

1.

Usuario: Tengo pollo y arroz, para 3 personas, quiero salado y dispongo de 45 minutos.
Chef: ¿Qué otros ingredientes tienes? ¿Verduras, salsas?

Usuario: Cebolla, ajo, pimiento rojo, salsa de soja.
Chef: Ingredientes necesarios:

- 300 g de pollo
- 200 g de arroz
- 1 cebolla mediana
- 2 dientes de ajo
- 1 pimiento rojo
- 2 cucharadas de salsa de soja
- 1 cucharada de aceite de oliva
- Sal y pimienta al gusto

Pasos:

1. Lava y cocina el arroz en agua con sal durante 15 minutos hasta que esté al dente. Escurre y reserva.
2. Pica finamente la cebolla, el ajo y el pimiento rojo.
3. Calienta el aceite en una sartén grande a fuego medio. Añade cebolla y ajo, sofríe 3 minutos hasta que estén transparentes.
4. Corta el pollo en trozos pequeños y agrégalo a la sartén. Cocina 8-10 minutos hasta dorar, revolviendo ocasionalmente.
5. Añade el pimiento y cocina 5 minutos más.
6. Incorpora la salsa de soja, mezcla bien y cocina 2 minutos para integrar sabores.
7. Mezcla el arroz con el salteado, ajusta con sal y pimienta. Sirve caliente.

Tiempo total aproximado: 40 minutos.

***

2.

Usuario: Quiero un postre dulce para 2 personas con fresas y chocolate, tengo 20 minutos.
Chef: ¿Tienes crema, leche o azúcar?

Usuario: Sí, crema y azúcar.
Chef: Ingredientes necesarios:

- 150 g de fresas frescas
- 50 g de chocolate negro
- 100 ml de crema para batir
- 1 cucharada de azúcar

Pasos:

1. Lava y corta las fresas en cuartos. Espolvorea con azúcar y deja reposar 5 minutos.
2. Derrite el chocolate al baño maría o en microondas con cuidado de no quemarlo.
3. Bate la crema hasta que forme picos suaves.
4. Sirve las fresas en copas, cubre con la crema batida y termina con chocolate derretido por encima.

Tiempo total aproximado: 15 minutos.

***

3.

Usuario: Plato agridulce para 4 personas, sin muchas verduras, 1 hora para cocinar.
Chef: ¿Tienes pollo, cerdo o pescado? ¿Qué frutas o especias?

Usuario: Pollo, piña en lata, jengibre.
Chef: Ingredientes necesarios:

- 500 g de pollo en trozos
- 200 g de piña en lata (con jugo)
- 1 cucharada de jengibre rallado
- 3 cucharadas de vinagre de arroz
- 2 cucharadas de azúcar moreno
- 2 cucharadas de salsa de soja
- 1 cucharada de aceite de oliva
- Sal y pimienta al gusto

Pasos:

1. Salpimienta el pollo. Calienta aceite en sartén y dora el pollo por todos lados, 8-10 minutos. Retira y reserva.
2. En la misma sartén añade el jengibre rallado y cocina 1 minuto.
3. Agrega piña con su jugo, vinagre, azúcar y salsa de soja. Lleva a ebullición.
4. Vuelve a poner el pollo, baja el fuego y cocina tapado 15-20 minutos hasta que la salsa reduzca y espese ligeramente.
5. Revisa sazón y sirve acompañado de arroz blanco.

Tiempo total aproximado: 50 minutos.`;

app.use(logger());

// Configuración CORS simplificada para compatibilidad con Better Auth
const corsOrigins = [
	process.env.CORS_ORIGIN?.replace(/\/$/, ""), // Frontend URL sin barra final
	"https://la-cocina-del-patito-web.vercel.app", // URL de producción
	process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "", // URL actual de Vercel
].filter(Boolean);

console.log("🔒 CORS Origins configurados:", corsOrigins);

app.use(
	"/*",
	cors({
		origin: (origin) => {
			// Allow requests without origin (same-origin, server-side, etc.)
			if (!origin) {
				console.log("🔒 CORS: Sin origin, permitido");
				return origin || "*"; // Permitir cualquier origen si no hay origin
			}

			// Allow all Vercel domains for flexibility
			if (origin.endsWith(".vercel.app")) {
				console.log(`🔒 CORS: Origen Vercel permitido: ${origin}`);
				return origin; // Retornar la URL específica
			}

			// Check against allowed origins
			const isAllowed = corsOrigins.some(allowed =>
				allowed && (origin === allowed || origin === allowed.replace(/\/$/, ""))
			);

			if (isAllowed) {
				console.log(`🔒 CORS: Origen permitido: ${origin}`);
				return origin; // Retornar la URL específica
			}

			console.warn(`🚫 CORS bloqueado: ${origin}. Permitidos: ${corsOrigins.join(", ")}`);
			return null; // Rechazar la solicitud
		},
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		credentials: true,
		exposeHeaders: ["Set-Cookie"],
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });

	// Store user in context for downstream handlers
	if (context.session?.user) {
		c.set("user", context.session.user);
	}

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api-reference",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});

app.post("/api/chat", async (c) => {
	const user = c.get("user");

	if (!user) {
		return c.text("Unauthorized", 401);
	}

	const body = await c.req.json();
	const uiMessages = body.messages || [];
	console.log("Received messages:", JSON.stringify(uiMessages, null, 2));

	// Convert UI messages to model messages
	const modelMessages = convertToModelMessages(uiMessages);
	console.log("Converted model messages:", JSON.stringify(modelMessages, null, 2));

	const result = streamText({
		model: google("gemini-2.5-flash"),
		messages: modelMessages,
		system: CHEF_SYSTEM_PROMPT,
	});

	console.log("Streaming result created");
	return result.toUIMessageStreamResponse();
});

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
