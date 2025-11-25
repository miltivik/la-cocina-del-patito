import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/utils/s3.ts"],
	sourcemap: true,
	dts: true,
	external: ["@aws-sdk/client-s3", "@aws-sdk/lib-storage", "sharp"],
});
