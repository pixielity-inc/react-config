/**
 * Configuration Module Options
 */
export interface ConfigModuleOptions {
  /**
   * Configuration driver to use
   * @default 'env'
   */
  driver?: 'env' | 'file' | 'firebase' | string;

  /**
   * Path to .env file (for env driver)
   * @default '.env'
   */
  envFilePath?: string | string[];

  /**
   * Path pattern to scan for config files (for file driver)
   * @example 'config/**\/*.config.ts'
   */
  filePattern?: string | string[];

  /**
   * Whether to ignore .env file
   * @default false
   */
  ignoreEnvFile?: boolean;

  /**
   * Whether to expand environment variables
   * @default false
   */
  expandVariables?: boolean;

  /**
   * Custom configuration object to merge
   */
  load?: Record<string, any> | (() => Record<string, any> | Promise<Record<string, any>>);

  /**
   * Whether configuration is global
   * @default false
   */
  isGlobal?: boolean;

  /**
   * Cache configuration values
   * @default true
   */
  cache?: boolean;

  /**
   * Validate configuration on load
   */
  validate?: (config: Record<string, any>) => void | Promise<void>;

  /**
   * Firebase configuration (for firebase driver)
   */
  firebase?: {
    projectId: string;
    configPath?: string;
  };

  /**
   * Environment variable prefix to strip
   * Set to 'auto' to auto-detect (VITE_ for Vite, NEXT_PUBLIC_ for Next.js)
   * Set to 'VITE_' or 'NEXT_PUBLIC_' for specific framework
   * Set to a custom string to strip that prefix
   * Set to false to disable prefix stripping
   * @default 'auto'
   * @example 'VITE_' - strips VITE_ prefix, so VITE_APP_NAME becomes APP_NAME
   * @example 'NEXT_PUBLIC_' - strips NEXT_PUBLIC_ prefix, so NEXT_PUBLIC_API_URL becomes API_URL
   * @example 'auto' - auto-detects framework and strips appropriate prefix
   */
  envPrefix?: 'auto' | 'VITE_' | 'NEXT_PUBLIC_' | string | false;

  /**
   * Global variable name to read config from in browser
   * @default '__APP_CONFIG__'
   * @example '__APP_CONFIG__' - reads from window.__APP_CONFIG__
   */
  globalName?: string;
}
