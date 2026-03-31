import type { ConfigDriver } from '../interfaces/config-driver.interface';
import { getNestedValue, hasNestedValue } from '../utils/get-nested-value.util';

/**
 * Environment Variable Configuration Driver
 *
 * Loads configuration from environment variables (process.env).
 * Supports .env files via dotenv.
 */
export class EnvDriver implements ConfigDriver {
  private config: Record<string, any> = {};
  private loaded = false;

  constructor(
    private options: {
      envFilePath?: string | string[];
      ignoreEnvFile?: boolean;
      expandVariables?: boolean;
      envPrefix?: string | false;
      globalName?: string; // Custom global variable name
    } = {}
  ) {}

  /**
   * Load environment variables
   */
  load(): Record<string, any> {
    if (this.loaded) {
      console.log('[EnvDriver] Already loaded, returning cached config');
      return this.config;
    }

    console.log('[EnvDriver] Loading environment variables...');
    console.log('[EnvDriver] Options:', { ...this.options });

    // Load .env file if not ignored
    if (!this.options.ignoreEnvFile) {
      this.loadDotEnv();
    }

    // Get global config name (default: __APP_CONFIG__)
    const globalName = this.options.globalName || '__APP_CONFIG__';

    // Try to load from custom global variable first (browser environment)
    if (typeof window !== 'undefined' && (window as any)[globalName]) {
      this.config = { ...(window as any)[globalName] };
      console.log(
        `[EnvDriver] Loaded config from window.${globalName}:`,
        Object.keys(this.config).length,
        'keys'
      );
    }
    // Fallback to process.env (Node.js environment or backward compatibility)
    else if (typeof process !== 'undefined' && process.env) {
      this.config = { ...process.env };
      console.log(
        '[EnvDriver] Loaded config from process.env:',
        Object.keys(this.config).length,
        'keys'
      );
    }
    // No config source available
    else {
      console.warn(
        '[EnvDriver] No config source available (neither window.' + globalName + ' nor process.env)'
      );
      this.config = {};
    }

    console.log('[EnvDriver] Initial config keys:', [
      ...Object.keys(this.config).filter((k) => k.includes('APP') || k.includes('VITE')),
    ]);

    // Strip prefix if configured
    if (this.options.envPrefix !== false) {
      console.log('[EnvDriver] Stripping prefix...');
      this.stripPrefix();
      console.log('[EnvDriver] After stripPrefix, config keys:', [
        ...Object.keys(this.config).filter((k) => k.includes('APP') || k.includes('VITE')),
      ]);
    }

    // Expand variables if enabled
    if (this.options.expandVariables) {
      this.expandEnvVariables();
    }

    this.loaded = true;
    console.log('[EnvDriver] Load complete. Sample values:', {
      APP_NAME: this.config.APP_NAME,
      VITE_APP_NAME: this.config.VITE_APP_NAME,
    });
    return this.config;
  }

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (!this.loaded) {
      this.load();
    }
    const value = getNestedValue(this.config, key, defaultValue);
    console.log(`[EnvDriver] get("${key}", "${defaultValue}") = "${value}"`);
    return value;
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    if (!this.loaded) {
      this.load();
    }
    return hasNestedValue(this.config, key);
  }

  /**
   * Get all configuration
   */
  all(): Record<string, any> {
    if (!this.loaded) {
      this.load();
    }
    return { ...this.config };
  }

  /**
   * Load .env file using dotenv
   */
  private loadDotEnv(): void {
    try {
      // Try to load dotenv
      const dotenv = require('dotenv');
      const paths = Array.isArray(this.options.envFilePath)
        ? this.options.envFilePath
        : [this.options.envFilePath || '.env'];

      for (const path of paths) {
        dotenv.config({ path });
      }
    } catch (error) {
      // dotenv not installed, skip
    }
  }

  /**
   * Expand environment variables (e.g., ${VAR_NAME})
   */
  private expandEnvVariables(): void {
    const regex = /\$\{([^}]+)\}/g;

    const expand = (value: string): string => {
      return value.replace(regex, (_, key) => {
        return this.config[key] || '';
      });
    };

    for (const [key, value] of Object.entries(this.config)) {
      if (typeof value === 'string' && value.includes('${')) {
        this.config[key] = expand(value);
      }
    }
  }

  /**
   * Strip environment variable prefix
   * Auto-detects framework (Vite, Next.js) or uses custom prefix
   */
  private stripPrefix(): void {
    let prefix = this.options.envPrefix;

    // Auto-detect framework prefix
    if (prefix === 'auto' || prefix === undefined) {
      // Check for Vite (import.meta.env exists or VITE_ variables present)
      const hasViteVars = Object.keys(this.config).some((key) => key.startsWith('VITE_'));
      if (hasViteVars || typeof import.meta !== 'undefined') {
        prefix = 'VITE_';
      }
      // Check for Next.js (NEXT_PUBLIC_ variables present)
      else if (Object.keys(this.config).some((key) => key.startsWith('NEXT_PUBLIC_'))) {
        prefix = 'NEXT_PUBLIC_';
      }
      // No framework detected, don't strip
      else {
        return;
      }
    }

    // Strip the prefix from all matching keys
    if (typeof prefix === 'string' && prefix.length > 0) {
      const newConfig: Record<string, any> = {};

      for (const [key, value] of Object.entries(this.config)) {
        if (key.startsWith(prefix)) {
          // Add both prefixed and unprefixed versions
          const unprefixedKey = key.substring(prefix.length);
          newConfig[unprefixedKey] = value;
          newConfig[key] = value; // Keep original too
        } else {
          newConfig[key] = value;
        }
      }

      this.config = newConfig;
    }
  }
}
