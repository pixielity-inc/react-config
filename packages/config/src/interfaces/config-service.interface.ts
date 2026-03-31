/**
 * Configuration Service Interface
 *
 * Defines the contract for configuration service implementations.
 */
export interface ConfigServiceInterface {
  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined;

  /**
   * Get configuration value or throw if not found
   */
  getOrThrow<T = any>(key: string): T;

  /**
   * Get string value
   */
  getString(key: string, defaultValue?: string): string | undefined;

  /**
   * Get string value or throw
   */
  getStringOrThrow(key: string): string;

  /**
   * Get number value
   */
  getNumber(key: string, defaultValue?: number): number | undefined;

  /**
   * Get number value or throw
   */
  getNumberOrThrow(key: string): number;

  /**
   * Get boolean value
   */
  getBool(key: string, defaultValue?: boolean): boolean | undefined;

  /**
   * Get boolean value or throw
   */
  getBoolOrThrow(key: string): boolean;

  /**
   * Get array value
   */
  getArray(key: string, defaultValue?: string[]): string[] | undefined;

  /**
   * Get JSON value
   */
  getJson<T = any>(key: string, defaultValue?: T): T | undefined;

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean;

  /**
   * Get all configuration values
   */
  all(): Record<string, any>;

  /**
   * Clear cache
   */
  clearCache(): void;
}
