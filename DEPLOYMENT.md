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
    | `DATABASE_URL` | Tu cadena de conexión a Postgres (Supabase). **IMPORTANTE**: Debe incluir `?sslmode=require` al final si usas Supabase. Ejemplo: `postgresql://user:pass@host:6543/postgres?pgbouncer=true&sslmode=require` |
    | `DIRECT_URL` | Cadena de conexión directa (para migraciones). |
    | `BETTER_AUTH_SECRET` | **CRÍTICO**: Una cadena larga y aleatoria (puedes generar una con `openssl rand -base64 32`). Esta variable es **obligatoria** para firmar las cookies de sesión y estado OAuth. Sin ella, obtendrás errores `state_mismatch`. |
    | `BETTER_AUTH_URL` | `https://la-cocina-server.vercel.app` (La URL que Vercel te dará. Pon una temporal si no la sabes aún, luego la actualizas). **Debe coincidir exactamente con la URL del backend**. |
    | `CORS_ORIGIN` | La URL de tu frontend (ej. `https://la-cocina-web.vercel.app`). **Sin barra al final**. |
    | `GOOGLE_GENERATIVE_AI_API_KEY` | Tu API Key de Gemini. |
    | `GOOGLE_CLIENT_ID` | Tu Google Client ID. |
    | `GOOGLE_CLIENT_SECRET` | Tu Google Client Secret. |
    | `AWS_ACCESS_KEY_ID` | Tu Access Key ID de AWS (IAM User con permisos S3). |
    | `AWS_SECRET_ACCESS_KEY` | Tu Secret Access Key de AWS. |
    | `AWS_REGION` | La región de tu bucket (ej. `us-east-1`). |
    | `AWS_S3_BUCKET_NAME` | El nombre de tu bucket S3. |

    > ⚠️ **Nota sobre SSL**: El código ya está configurado para manejar certificados SSL de Supabase automáticamente en producción. Si ves errores de "self-signed certificate", asegúrate de que las variables `VERCEL` o `VERCEL_ENV` estén presentes (Vercel las inyecta automáticamente).

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


---

## 🔧 Troubleshooting

### Error: "self-signed certificate in certificate chain"

Este error ocurre cuando la conexión a PostgreSQL (Supabase) no puede verificar el certificado SSL. **Soluciones**:

1. **Verificar que el código esté actualizado**: El archivo `packages/db/src/index.ts` debe detectar correctamente el entorno de producción usando las variables `VERCEL`, `VERCEL_ENV` o `NODE_ENV`.

2. **Verificar variables de entorno en Vercel**:
   - Asegúrate de que `DATABASE_URL` esté correctamente configurada
   - Vercel inyecta automáticamente `VERCEL=1` y `VERCEL_ENV` - no necesitas configurarlas manualmente

3. **Forzar SSL en la URL de conexión** (alternativa):
   ```
   DATABASE_URL=postgresql://user:pass@host:6543/postgres?pgbouncer=true&sslmode=require
   ```

### Error: "CORS blocked" o problemas de cookies

1. Verifica que `CORS_ORIGIN` en el backend coincida exactamente con la URL del frontend (sin barra final)
2. Asegúrate de que `BETTER_AUTH_URL` sea la URL del backend

### Error: "OAuth callback failed"

1. Verifica en Google Cloud Console que las URIs de redirección incluyan:
   - `https://tu-backend.vercel.app/api/auth/callback/google`
2. Asegúrate de que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctamente configurados

### Error: "state_mismatch" en OAuth

Este error ocurre cuando la cookie de estado OAuth no se puede leer durante el callback. **Causas comunes**:

1. **Falta `BETTER_AUTH_SECRET`**: Esta variable es **obligatoria** para firmar las cookies. Sin ella, las cookies no se pueden validar.
   - Genera una con: `openssl rand -base64 32` (o en Windows: `powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"`)
   - Agrégala en Vercel: Settings -> Environment Variables

2. **Mismatch de dominios**: El `BETTER_AUTH_URL` debe coincidir exactamente con la URL del backend.
   - Verifica que no haya barras finales (`/`) de más
   - Verifica que el protocolo sea `https://`

3. **Cookies bloqueadas por el navegador**: Safari y algunos navegadores bloquean cookies de terceros.
   - La configuración actual usa `crossSubDomainCookies` para manejar esto en `.vercel.app`
   - En desarrollo local, usa `sameSite: "lax"` para evitar problemas

4. **Google Cloud Console mal configurado**:
   - En "Authorized redirect URIs" debe estar exactamente: `https://tu-backend.vercel.app/api/auth/callback/google`
   - En "Authorized JavaScript origins" deben estar tanto el frontend como el backend

5. **Verificar cookies en DevTools**:
   - Abre DevTools → Application → Cookies
   - Busca cookies con nombres como `better-auth.state`, `better-auth.session`, etc.
   - Si no aparecen cookies, verifica:
     - Que `BETTER_AUTH_SECRET` esté configurado
     - Que el navegador no esté bloqueando cookies de terceros
     - Que estés en HTTPS en producción

6. **Configuración de CORS incorrecta**:
   - Verifica que `CORS_ORIGIN` en el backend coincida con la URL del frontend
   - Verifica que `trustedOrigins` incluya la URL del frontend

## Diagnóstico paso a paso:

1. **Verifica las variables de entorno en Vercel**:
   - `BETTER_AUTH_SECRET`: Debe existir y tener ~44 caracteres
   - `BETTER_AUTH_URL`: Debe ser la URL exacta del backend
   - `CORS_ORIGIN`: Debe ser la URL del frontend sin barra final

2. **Revisa los logs del servidor**:
   - Busca: `🔐 Auth Configuration:`
   - Verifica que `hasBetterAuthSecret: true`
   - Verifica que `baseURL` sea correcto

3. **Prueba en desarrollo local**:
   - Asegúrate de que `NEXT_PUBLIC_SERVER_URL` apunte al servidor local
   - Verifica que no haya problemas de CORS

4. **Limpia cookies y cache**:
   - Borra todas las cookies relacionadas con tu dominio
   - Hard refresh (Ctrl+F5) en el navegador

## Herramientas de diagnóstico incluidas:

### 1. Función `debugAuth()` en el navegador:
En desarrollo, abre la consola del navegador y ejecuta:
```javascript
debugAuth()
```
Esto mostrará información detallada sobre la configuración y cookies actuales.

### 2. Componente DebugAuth (temporal):
Para debugging visual, agrega temporalmente el componente `DebugAuth` a tu layout:

```tsx
// En apps/web/src/app/layout.tsx
import DebugAuth from "@/components/debug-auth";

// Dentro del componente Layout:
<DebugAuth />
```

Esto mostrará un panel flotante en la esquina inferior derecha con un botón para loggear información de debug.

### 2. Logs del servidor:
Revisa los logs de Vercel para ver la configuración de autenticación:
```
🔐 Auth Configuration: {
  hasBetterAuthSecret: true,
  baseURL: "https://tu-backend.vercel.app",
  // ... más info
}
```

### 3. Verificar cookies en DevTools:
- Application → Cookies → Tu dominio
- Busca cookies que empiecen con `better-auth.`
- Deberías ver al menos: `better-auth.session`, `better-auth.state` (durante OAuth)

### 4. Probar OAuth flow:
1. Limpia todas las cookies
2. Intenta iniciar sesión con Google
3. Verifica que se cree la cookie `better-auth.state` antes del redirect
4. Verifica que la cookie persista después del callback

### Logs de debugging

El servidor imprime logs de configuración al iniciar. Revisa los logs en Vercel para ver:
- `🔍 DB Configuration:` - Muestra la configuración de la base de datos
- `🔐 Auth Configuration:` - Muestra la configuración de autenticación

Si `isProduction` es `false` cuando debería ser `true`, hay un problema con la detección del entorno.
