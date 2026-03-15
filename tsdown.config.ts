import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	platform: "node",
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	publint: {
		level: "error",
	},
	attw: {
		level: "error",
	},
});
