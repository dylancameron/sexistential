import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("three")) return "three";
						if (id.includes("@react-three")) return "r3f";
						if (id.includes("motion")) return "motion";
						if (id.includes("wouter")) return "routing";
						if (id.includes("react") || id.includes("react-dom"))
							return "react";
						return "vendor"
					}
				}
			}
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
