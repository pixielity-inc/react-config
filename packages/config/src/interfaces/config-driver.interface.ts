/**
 * Configuration Driver Interface
 * 
 * Defines the contract for configuration drivers (env, file, firebase, etc.)
 */
export interface ConfigDriver {
  /**
   * Load configuration from the driver source
   * @returns Configuration object
   */
  load(): Promise<Record<string, any>> | Record<string, any>;

  /**
   * Get a configuration value by key
   * @param key - Configuration key (supports dot notation)
   * @param defaultValue - Default value if key not found
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined;

  /**
   * Check if a configuration key exists
   * @param key - Configuration key
   */
  has(key: string): boolean;

  /**
   * Get all configuration values
   */
  all(): Record<string, any>;
}
