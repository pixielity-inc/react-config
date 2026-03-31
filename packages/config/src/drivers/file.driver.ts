import type { ConfigDriver } from '@/interfaces/config-driver.interface';
import { getNestedValue, hasNestedValue } from '@/utils/get-nested-value.util';

/**
 * File-based Configuration Driver
 * 
 * Loads configuration from TypeScript/JavaScript files.
 * This is a server-side only driver. For client-side, use the Vite plugin.
 * 
 * @see packages/pixielity/config/src/plugins/vite-config.plugin.ts
 */
export class FileDriver implements ConfigDriver {
  private config: Record<string, any> = {};
  private loaded = false;

  constructor(
    options: {
      config?: Record<string, any>;
    } = {}
  ) {
    // Pre-loaded config from Vite plugin or server
    if (options.config) {
      this.config = options.config;
      this.loaded = true;
    }
  }

  /**
   * Load configuration
   * Config should be pre-loaded via Vite plugin or passed in constructor
   */
  async load(): Promise<Record<string, any>> {
    if (this.loaded) {
      return this.config;
    }

    // If running on server (Node.js), throw error
    const isServer = typeof globalThis !== 'undefined' && 
                     typeof (globalThis as typeof globalThis & { window?: any }).window === 'undefined';
    
    if (isServer) {
      throw new Error(
        'FileDriver requires pre-loaded configuration. ' +
        'Use Vite plugin for client-side or pass config in constructor for server-side.'
      );
    }

    this.loaded = true;
    return this.config;
  }

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first or use async initialization.');
    }
    return getNestedValue(this.config, key, defaultValue);
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first or use async initialization.');
    }
    return hasNestedValue(this.config, key);
  }

  /**
   * Get all configuration
   */
  all(): Record<string, any> {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first or use async initialization.');
    }
    return { ...this.config };
  }
}
