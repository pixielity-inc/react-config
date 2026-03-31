import { Inject, Injectable } from "@abdokouta/react-di";

import { CONFIG_DRIVER } from "@/constants/tokens.constant";
import type { ConfigDriver } from "@/interfaces/config-driver.interface";
import type { ConfigServiceInterface } from "@/interfaces/config-service.interface";

/**
 * Configuration Service
 *
 * Provides type-safe access to configuration values with various getter methods.
 * Similar to NestJS ConfigService.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(private config: ConfigService) {}
 *
 *   getDbConfig() {
 *     return {
 *       host: this.config.getString('DB_HOST', 'localhost'),
 *       port: this.config.getNumber('DB_PORT', 5432),
 *       ssl: this.config.getBool('DB_SSL', false),
 *     };
 *   }
 * }
 * ```
 */
@Injectable()
export class ConfigService implements ConfigServiceInterface {
  constructor(
    @Inject(CONFIG_DRIVER)
    private driver: ConfigDriver,
  ) {}

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    return this.driver.get<T>(key, defaultValue);
  }

  /**
   * Get configuration value or throw if not found
   */
  getOrThrow<T = any>(key: string): T {
    const value = this.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is required but not set`);
    }
    return value;
  }

  /**
   * Get string value
   */
  getString(key: string, defaultValue?: string): string | undefined {
    const value = this.get(key, defaultValue);
    return value !== undefined ? String(value) : undefined;
  }

  /**
   * Get string value or throw
   */
  getStringOrThrow(key: string): string {
    return String(this.getOrThrow(key));
  }

  /**
   * Get number value
   */
  getNumber(key: string, defaultValue?: number): number | undefined {
    const value = this.get(key, defaultValue);
    if (value === undefined) {
      return undefined;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get number value or throw
   */
  getNumberOrThrow(key: string): number {
    const value = this.getNumber(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is required but not set`);
    }
    return value;
  }

  /**
   * Get boolean value
   * Treats 'true', '1', 'yes', 'on' as true
   */
  getBool(key: string, defaultValue?: boolean): boolean | undefined {
    const value = this.get(key, defaultValue);
    if (value === undefined) {
      return undefined;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
  }

  /**
   * Get boolean value or throw
   */
  getBoolOrThrow(key: string): boolean {
    const value = this.getBool(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is required but not set`);
    }
    return value;
  }

  /**
   * Get array value (comma-separated string or actual array)
   */
  getArray(key: string, defaultValue?: string[]): string[] | undefined {
    const value = this.get(key, defaultValue);
    if (value === undefined) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value.map(String);
    }
    return String(value)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  /**
   * Get JSON value
   */
  getJson<T = any>(key: string, defaultValue?: T): T | undefined {
    const value = this.get(key, defaultValue);
    if (value === undefined) {
      return undefined;
    }
    if (typeof value === "object") {
      return value as T;
    }
    try {
      return JSON.parse(String(value)) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean {
    return this.driver.has(key);
  }

  /**
   * Get all configuration values
   */
  all(): Record<string, any> {
    return this.driver.all();
  }

  /**
   * Clear cache (no-op since we don't cache in ConfigService)
   */
  clearCache(): void {
    // No-op - caching should be done at a higher level if needed
  }
}
