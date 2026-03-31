/**
 * Dependency Injection Tokens
 * 
 * Used for injecting configuration dependencies.
 */

/**
 * Configuration driver token
 * 
 * @example
 * ```typescript
 * @Inject(CONFIG_DRIVER)
 * private driver: ConfigDriver
 * ```
 */
export const CONFIG_DRIVER = Symbol('CONFIG_DRIVER');

/**
 * Configuration options token
 * 
 * @example
 * ```typescript
 * @Inject(CONFIG_OPTIONS)
 * private options: ConfigModuleOptions
 * ```
 */
export const CONFIG_OPTIONS = Symbol('CONFIG_OPTIONS');

/**
 * Configuration service token
 * 
 * @example
 * ```typescript
 * @Inject(CONFIG_SERVICE)
 * private config: ConfigService
 * ```
 */
export const CONFIG_SERVICE = Symbol('CONFIG_SERVICE');
