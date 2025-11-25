import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/utils/s3.ts"],
	sourcemap: true,
	dts: true,
});
