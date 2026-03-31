/**
 * Define Config Utility
 *
 * Helper function to define config module options with type safety.
 *
 * @module @abdokouta/config
 */

import type { ConfigModuleOptions } from '../interfaces/config-module-options.interface';

/**
 * Helper function to define config module options with type safety
 *
 * Provides IDE autocomplete and type checking for configuration objects.
 * This pattern is consistent with modern tooling (Vite, Vitest, etc.).
 *
 * @param config - The config module options object
 * @returns The same configuration object with proper typing
 *
 * @example
 * ```typescript
 * // config.config.ts
 * import { defineConfig } from '@abdokouta/config';
 *
 * export default defineConfig({
 *   driver: 'env',
 *   ignoreEnvFile: true,
 *   isGlobal: true,
 *   envPrefix: 'auto',
 * });
 * ```
 */
export function defineConfig(config: ConfigModuleOptions): ConfigModuleOptions {
  return config;
}
