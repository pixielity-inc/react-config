import { Module, DynamicModule } from '@abdokouta/react-di';

import { EnvDriver } from './drivers/env.driver';
import { FileDriver } from './drivers/file.driver';
import { ConfigService } from './services/config.service';
import type { ConfigDriver } from './interfaces/config-driver.interface';
import type { ConfigModuleOptions } from './interfaces/config-module-options.interface';
import { CONFIG_DRIVER, CONFIG_OPTIONS, CONFIG_SERVICE } from './constants/tokens.constant';

/**
 * Configuration Module
 * 
 * Provides configuration management with multiple drivers.
 * Similar to NestJS ConfigModule.
 * 
 * @example
 * ```typescript
 * // Using environment variables (default)
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       envFilePath: '.env',
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 * 
 * @example
 * ```typescript
 * // Using file-based configuration
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       driver: 'file',
 *       filePattern: 'config/**\/*.config.ts',
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class ConfigModule {
  /**
   * Register configuration module with options
   * 
   * @param options - Configuration options
   * @returns Dynamic module
   */
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const driver = this.createDriver(options);
    
    const isGlobal = options.isGlobal ?? false;
    
    const providers = [
      {
        provide: CONFIG_OPTIONS,
        useValue: options,
        isGlobal,
      },
      {
        provide: CONFIG_DRIVER,
        useValue: driver,
        isGlobal,
      },
      ConfigService,
      {
        provide: CONFIG_SERVICE,
        useExisting: ConfigService,
        isGlobal,
      },
    ];

    return {
      module: ConfigModule,
      providers: providers as any,
      exports: [ConfigService],
    };
  }

  /**
   * Register configuration module asynchronously
   * 
   * @param options - Async configuration options
   * @returns Dynamic module
   */
  static async forRootAsync(
    options: ConfigModuleOptions & {
      useFactory?: () => Promise<ConfigModuleOptions> | ConfigModuleOptions;
    }
  ): Promise<DynamicModule> {
    const resolvedOptions = options.useFactory
      ? await options.useFactory()
      : options;

    return this.forRoot(resolvedOptions);
  }

  /**
   * Create configuration driver based on options
   */
  private static createDriver(options: ConfigModuleOptions): ConfigDriver {
    const driverType = options.driver || 'env';

    switch (driverType) {
      case 'env':
        const envDriver = new EnvDriver({
          envFilePath: options.envFilePath,
          ignoreEnvFile: options.ignoreEnvFile,
          expandVariables: options.expandVariables,
          envPrefix: options.envPrefix,
          globalName: options.globalName,
        });
        envDriver.load();
        
        // Merge custom load function if provided
        if (options.load) {
          this.mergeCustomConfig(envDriver, options.load);
        }
        
        return envDriver;

      case 'file':
        const fileDriver = new FileDriver({
          config: typeof options.load === 'object' ? options.load : undefined,
        });
        return fileDriver;

      default:
        throw new Error(`Unknown configuration driver: ${driverType}`);
    }
  }

  /**
   * Merge custom configuration into driver
   */
  private static mergeCustomConfig(
    driver: ConfigDriver,
    load: Record<string, any> | (() => Record<string, any> | Promise<Record<string, any>>)
  ): void {
    const customConfig = typeof load === 'function' ? load() : load;
    
    if (customConfig instanceof Promise) {
      customConfig.then(config => {
        Object.assign(driver.all(), config);
      });
    } else {
      Object.assign(driver.all(), customConfig);
    }
  }
}
