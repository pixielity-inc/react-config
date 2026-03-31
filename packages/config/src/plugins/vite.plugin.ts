/**
 * Vite Plugin for Config Package
 *
 * Simple plugin that receives env from Vite's loadEnv and injects it into the browser.
 * Does NOT apply any business logic - that's handled by ConfigService.
 *
 * Responsibilities:
 * 1. Receive environment variables from Vite's loadEnv (passed via options)
 * 2. Inject them into window.__APP_CONFIG__ (or custom global name)
 * 3. Optionally scan and collect .config.ts files
 *
 * ConfigService will then query from window.__APP_CONFIG__ and apply:
 * - Prefix stripping
 * - Type conversion
 * - Validation
 * - Defaults
 *
 * Usage:
 * ```ts
 * import { defineConfig, loadEnv } from 'vite'
 * import { viteConfigPlugin } from '@abdokouta/config/vite-plugin'
 *
 * export default defineConfig(({ mode }) => {
 *   const env = loadEnv(mode, 'environments', '')
 *
 *   return {
 *     plugins: [
 *       viteConfigPlugin({ env })
 *     ]
 *   }
 * })
 * ```
 */

import path from 'path';
import type { Plugin } from 'vite';
import type { ViteConfigPluginOptions } from '@/interfaces/vite-config-plugin-options.interface';
import { scanConfigFiles } from '@/utils/scan-config-files.util';
import { loadConfigFile } from '@/utils/load-config-file.util';

/**
 * Vite plugin that injects environment variables into the browser
 *
 * This plugin is DUMB - it just receives env and injects it.
 * ConfigService is SMART - it queries and applies business logic.
 */
export function viteConfigPlugin(options: ViteConfigPluginOptions = {}): Plugin {
  const {
    env = {},
    includeAll = true,
    include = [],
    scanConfigFiles: shouldScanConfigFiles = false,
    globalName = '__APP_CONFIG__',
  } = options;

  let collectedConfig: Record<string, any> = {};

  return {
    name: 'vite-plugin-config',

    async configResolved(config) {
      // Scan and collect config files (optional, disabled by default)
      if (shouldScanConfigFiles) {
        const configFiles = await scanConfigFiles({
          ...options,
          root: config.root,
        });

        console.log('[vite-plugin-config] Found config files:', configFiles.length);

        // Load all config files and merge them
        for (const file of configFiles) {
          const fileConfig = await loadConfigFile(file);
          collectedConfig = { ...collectedConfig, ...fileConfig };
          console.log('[vite-plugin-config] Loaded config from:', path.relative(config.root, file));
        }
      }
    },

    transformIndexHtml(html) {
      // Build the config object from provided env
      const processEnv: Record<string, any> = {};

      for (const [key, value] of Object.entries(env)) {
        // Filter by include list if not including all
        if (!includeAll && !include.includes(key)) {
          continue;
        }

        // Just copy the value as-is (NO prefix stripping here)
        processEnv[key] = value;
      }

      // Merge with collected config from .config.ts files
      const finalConfig = { ...processEnv, ...collectedConfig };

      console.log('[vite-plugin-config] Injecting environment variables into HTML');
      console.log('[vite-plugin-config] Total variables:', Object.keys(finalConfig).length);
      console.log(
        '[vite-plugin-config] Sample keys:',
        Object.keys(finalConfig).filter((k) => k.includes('APP') || k.includes('VITE'))
      );
      console.log('[vite-plugin-config] Global name:', globalName);

      // Inject script into HTML head
      const script = `
        <script>
          window.${globalName} = ${JSON.stringify(finalConfig)};
          // Also set process.env for backward compatibility
          window.process = window.process || {};
          window.process.env = window.${globalName};
        </script>
      `;

      return html.replace('<head>', `<head>${script}`);
    },
  };
}
