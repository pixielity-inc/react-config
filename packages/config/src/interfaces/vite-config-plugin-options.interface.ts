/**
 * Vite Config Plugin Options Interface
 *
 * Configuration options for the Vite config plugin that injects
 * environment variables into the browser.
 */

export interface ViteConfigPluginOptions {
  /**
   * Environment variables loaded by Vite's loadEnv
   * Pass the result of loadEnv(mode, envDir, '') here
   */
  env?: Record<string, string>;

  /**
   * Scan and collect .config.ts files
   * @default false (disabled by default to avoid Node.js module issues)
   */
  scanConfigFiles?: boolean;

  /**
   * Pattern to match config files
   * @default 'src/**\/*.config.ts'
   */
  configFilePattern?: string | string[];

  /**
   * Directories to exclude from config file scanning
   * @default ['node_modules', 'dist', 'build', '.git']
   */
  excludeDirs?: string[];

  /**
   * Root directory for scanning config files
   * @default process.cwd()
   */
  root?: string;

  /**
   * Include all environment variables
   * @default true
   */
  includeAll?: boolean;

  /**
   * Specific environment variables to include
   * Only used if includeAll is false
   */
  include?: string[];

  /**
   * Global variable name to inject config into
   * @default '__APP_CONFIG__'
   */
  globalName?: string;
}
