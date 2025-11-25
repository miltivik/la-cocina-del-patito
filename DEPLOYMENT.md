# Guía de Despliegue en Vercel - La Cocina del Patito

Esta guía te llevará paso a paso para desplegar tu aplicación "La Cocina del Patito" en Vercel. Al ser un monorepo con Frontend y Backend separados, realizaremos dos despliegues distintos.

## 📋 Prerrequisitos

1.  Cuenta en [Vercel](https://vercel.com).
2.  Tu proyecto subido a GitHub/GitLab/Bitbucket.
3.  Base de datos PostgreSQL lista (ej. Supabase) y su URL de conexión.
4.  Credenciales de Google OAuth (Client ID y Secret).
5.  API Key de Google Gemini.

---

## 🚀 Paso 1: Desplegar el Backend (`apps/server`)

Primero desplegaremos el servidor, ya que el frontend necesita su URL para funcionar.

1.  En el dashboard de Vercel, haz clic en **"Add New..."** -> **"Project"**.
2.  Importa tu repositorio de Git.
3.  **Configuración del Proyecto**:
    *   **Project Name**: `la-cocina-server` (o el nombre que prefieras).
    *   **Framework Preset**: `Other` (o déjalo en automático si detecta algo, pero `Other` es seguro para Hono/Node).
    *   **Root Directory**: Haz clic en "Edit" y selecciona `apps/server`.
    *   **Build Command**: `turbo build --filter=server` (o deja el por defecto si Vercel detecta Turbo).
    *   **Output Directory**: `dist` (Importante: Hono suele compilar aquí).
    *   **Install Command**: `bun install` (o `npm install` si no usas Bun en Vercel, pero idealmente usa el mismo gestor).

4.  **Variables de Entorno (Environment Variables)**:
    Agrega las siguientes variables:

    | Variable | Valor / Descripción |
    | :--- | :--- |
    | `DATABASE_URL` | Tu cadena de conexión a Postgres (Supabase). |
    | `DIRECT_URL` | Cadena de conexión directa (para migraciones). |
    | `BETTER_AUTH_SECRET` | Una cadena larga y aleatoria (puedes generar una con `openssl rand -base64 32`). |
    | `BETTER_AUTH_URL` | `https://la-cocina-server.vercel.app` (La URL que Vercel te dará. Pon una temporal si no la sabes aún, luego la actualizas). |
    | `CORS_ORIGIN` | `*` (Temporalmente para probar, luego pon la URL de tu frontend). |
    | `GOOGLE_GENERATIVE_AI_API_KEY` | Tu API Key de Gemini. |
    | `GOOGLE_CLIENT_ID` | Tu Google Client ID. |
    | `GOOGLE_CLIENT_SECRET` | Tu Google Client Secret. |

5.  Haz clic en **"Deploy"**.

---

## 🌐 Paso 2: Desplegar el Frontend (`apps/web`)

Una vez que el backend esté listo y tengas su URL (ej. `https://la-cocina-server.vercel.app`), procedemos con el frontend.

1.  Vuelve al dashboard y crea un **Nuevo Proyecto** con el **mismo repositorio**.
2.  **Configuración del Proyecto**:
    *   **Project Name**: `la-cocina-web`.
    *   **Framework Preset**: `Next.js`.
    *   **Root Directory**: `apps/web`.
    *   **Build Command**: `turbo build --filter=web` (o el default de Next.js).
    *   **Output Directory**: `.next` (Default de Next.js).

3.  **Variables de Entorno**:

    | Variable | Valor / Descripción |
    | :--- | :--- |
    | `NEXT_PUBLIC_SERVER_URL` | La URL de tu backend desplegado en el Paso 1 (ej. `https://la-cocina-server.vercel.app`). **Sin barra al final**. |

4.  Haz clic en **"Deploy"**.

---

## 🔗 Paso 3: Conectar y Finalizar

Ahora que ambos están desplegados, necesitamos "presentarlos" formalmente y asegurar la autenticación.

1.  **Actualizar Backend**:
    *   Ve a la configuración de tu proyecto `la-cocina-server` en Vercel -> Settings -> Environment Variables.
    *   Edita `CORS_ORIGIN` y pon la URL de tu frontend (ej. `https://la-cocina-web.vercel.app`).
    *   Asegúrate de que `BETTER_AUTH_URL` sea exactamente la URL de tu backend.
    *   Si cambiaste algo, ve a "Deployments" y haz "Redeploy" para que los cambios surtan efecto.

2.  **Configurar Google Cloud Console**:
    *   Ve a tu consola de Google Cloud -> APIs & Services -> Credentials.
    *   Edita tu cliente OAuth 2.0.
    *   En **"Authorized JavaScript origins"**, agrega:
        *   `https://la-cocina-web.vercel.app` (Frontend)
        *   `https://la-cocina-server.vercel.app` (Backend)
    *   En **"Authorized redirect URIs"**, agrega:
        *   `https://la-cocina-server.vercel.app/api/auth/callback/google`
        *   (Opcional) `https://la-cocina-web.vercel.app/api/auth/callback/google` (dependiendo de cómo Better Auth maneje el flujo, pero usualmente es el backend).

## ✅ Verificación

1.  Abre tu frontend (`https://la-cocina-web.vercel.app`).
2.  Intenta iniciar sesión con Google.
3.  Debería redirigirte correctamente y mostrarte como logueado.
4.  Prueba el chat con el chef para verificar que la conexión con el backend y la IA funciona.

¡Listo! Tu aplicación está en producción. 🚀
