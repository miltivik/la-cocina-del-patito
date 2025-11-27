import { defineConfig } from "drizzle-kit";

// Usando URL de Supabase directamente para deployment
export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgresql://postgres.dkaelouxnvphkedqmyct:bfJ3HVBsoQTREYye@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
	},
});
