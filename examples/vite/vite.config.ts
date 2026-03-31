import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteConfigPlugin } from "@abdokouta/config/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from environments folder based on `mode`
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const envDir = path.resolve(__dirname, "environments");
  const env = loadEnv(mode, envDir, "");

  return {
    // Specify the directory where env files are located
    envDir,

    plugins: [
      react(),
      tailwindcss(),
      viteConfigPlugin({
        env, // Pass loaded env to the plugin
        includeAll: true, // Include all environment variables
        scanConfigFiles: true, // Enable config file scanning
        configFilePattern: "src/config/app.config.ts", // Only scan app.config.ts (not module configs)
      }),
    ],

    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ["reflect-metadata"],
      // Exclude all server-only and Node.js packages
      exclude: [
        // Node.js built-ins
        "fs",
        "path",
        "url",
        "stream",
        "events",
        "string_decoder",
        "node:fs",
        "node:path",
        "node:url",
        "node:stream",
        "node:events",
        "node:string_decoder",
        "node:fs/promises",
        // Server-only packages
        "glob",
        "path-scurry",
        "minipass",
        "brace-expansion",
        "minimatch",
        "pacote",
        "@npmcli/arborist",
        "cacache",
        "ts-node",
        "axios",
      ],
    },

    // Use oxc transformer (newer, faster than esbuild)
    // Set target for JavaScript output
    build: {
      target: "es2022",

      // Increase chunk size warning limit to 1000 kB
      chunkSizeWarningLimit: 1000,

      // Enable code splitting for better chunking
      rollupOptions: {
        external: [
          // Exclude Node.js built-in modules from browser bundle
          "fs",
          "node:fs",
          "node:fs/promises",
          "node:path",
          "node:url",
          "node:stream",
          "node:events",
          "node:string_decoder",
          // Exclude server-only packages
          "glob",
          "path-scurry",
          "minipass",
          "brace-expansion",
          "minimatch",
        ],
        output: {
          manualChunks: (id) => {
            // Split vendor code into separate chunks
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("@refinedev")) {
                return "refine-vendor";
              }
              if (id.includes("@heroui") || id.includes("framer-motion")) {
                return "heroui-vendor";
              }
              // All other node_modules go into vendor chunk
              return "vendor";
            }
          },
        },
      },
    },
  };
});
