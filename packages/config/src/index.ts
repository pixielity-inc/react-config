/**
 * @abdokouta/config
 *
 * NestJS-inspired configuration management with multiple drivers for loading
 * configuration from various sources (environment variables, files, etc.).
 * Provides type-safe access to configuration values with support for nested
 * properties and default values.
 *
 * @example
 * Basic usage with environment variables:
 * ```typescript
 * import { ConfigModule, ConfigService, EnvDriver } from '@abdokouta/config';
 * import { Module, Injectable, Inject } from '@abdokouta/react-di';
 *
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       driver: new EnvDriver(),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 *
 * @Injectable()
 * class DatabaseService {
 *   constructor(@Inject(ConfigService) private config: ConfigService) {}
 *
 *   connect() {
 *     const host = this.config.get('DATABASE_HOST', 'localhost');
 *     const port = this.config.get('DATABASE_PORT', 5432);
 *     // Connect to database...
 *   }
 * }
 * ```
 *
 * @example
 * Using file-based configuration:
 * ```typescript
 * import { ConfigModule, FileDriver } from '@abdokouta/config';
 *
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       driver: new FileDriver({
 *         path: './config/app.json',
 *       }),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * Accessing nested configuration:
 * ```typescript
 * // config.json: { "database": { "host": "localhost", "port": 5432 } }
 * const host = config.get('database.host');
 * const port = config.get('database.port', 3306);
 * ```
 *
 * @module @abdokouta/config
 */

// ============================================================================
// Module (DI Configuration)
// ============================================================================
export { ConfigModule } from './config.module';

// ============================================================================
// Core Service
// ============================================================================
export { ConfigService } from './services/config.service';

// ============================================================================
// Drivers
// ============================================================================
export { EnvDriver } from './drivers/env.driver';
export { FileDriver } from './drivers/file.driver';

// ============================================================================
// Interfaces
// ============================================================================
export type { ConfigDriver } from './interfaces/config-driver.interface';
export type { ConfigModuleOptions } from './interfaces/config-module-options.interface';
export type { ConfigServiceInterface } from './interfaces/config-service.interface';
export type { ViteConfigPluginOptions } from './interfaces/vite-config-plugin-options.interface';

// ============================================================================
// Utilities
// ============================================================================
export { getNestedValue, hasNestedValue } from './utils/get-nested-value.util';
export { loadConfigFile } from './utils/load-config-file.util';
