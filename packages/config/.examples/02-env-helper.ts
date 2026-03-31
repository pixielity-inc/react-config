/**
 * Env Helper Example
 * 
 * This example demonstrates the standalone Env utility for quick
 * environment variable access without dependency injection.
 * 
 * @example
 * Run this example:
 * ```bash
 * ts-node examples/02-env-helper.ts
 * ```
 */

import { Env } from '@abdokouta/config';

/**
 * Setup example environment variables
 */
function setupEnv() {
  process.env.APP_NAME = 'My Application';
  process.env.APP_PORT = '3000';
  process.env.APP_DEBUG = 'true';
  process.env.NODE_ENV = 'development';
  process.env.API_TIMEOUT = '5000';
  process.env.ENABLE_CACHE = '1';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:4000';
  process.env.FEATURE_FLAGS = JSON.stringify({
    newUI: true,
    betaFeatures: false,
  });
}

/**
 * Example 1: Basic Env usage
 */
function basicUsage() {
  console.log('\n=== Example 1: Basic Env Usage ===\n');

  // Get string values
  const appName = Env.get('APP_NAME');
  console.log(`✓ APP_NAME: "${appName}"`);

  // Get with default
  const appEnv = Env.get('APP_ENV', 'production');
  console.log(`✓ APP_ENV: "${appEnv}" (using default)`);

  // Get non-existent key
  const apiKey = Env.get('API_KEY');
  console.log(`✓ API_KEY: ${apiKey} (undefined)`);
}

/**
 * Example 2: Type-safe getters
 */
function typeSafeGetters() {
  console.log('\n=== Example 2: Type-Safe Getters ===\n');

  // Get string
  const appName = Env.getString('APP_NAME', 'Default App');
  console.log(`✓ getString('APP_NAME'): "${appName}"`);

  // Get number
  const port = Env.getNumber('APP_PORT', 3000);
  console.log(`✓ getNumber('APP_PORT'): ${port} (type: ${typeof port})`);

  // Get boolean
  const debug = Env.getBool('APP_DEBUG', false);
  console.log(`✓ getBool('APP_DEBUG'): ${debug} (type: ${typeof debug})`);

  // Get array
  const origins = Env.getArray('ALLOWED_ORIGINS', []);
  console.log(`✓ getArray('ALLOWED_ORIGINS'):`, origins);

  // Get JSON
  const features = Env.getJson('FEATURE_FLAGS', {});
  console.log(`✓ getJson('FEATURE_FLAGS'):`, features);
}

/**
 * Example 3: Required values
 */
function requiredValues() {
  console.log('\n=== Example 3: Required Values ===\n');

  try {
    // Get required value that exists
    const appName = Env.getOrThrow('APP_NAME');
    console.log(`✓ getOrThrow('APP_NAME'): "${appName}"`);

    // Try to get required value that doesn't exist
    const apiKey = Env.getOrThrow('API_KEY');
    console.log(`✓ getOrThrow('API_KEY'): "${apiKey}"`);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }
}

/**
 * Example 4: Check existence
 */
function checkExistence() {
  console.log('\n=== Example 4: Check Existence ===\n');

  const hasAppName = Env.has('APP_NAME');
  console.log(`✓ has('APP_NAME'): ${hasAppName}`);

  const hasApiKey = Env.has('API_KEY');
  console.log(`✓ has('API_KEY'): ${hasApiKey}`);
}

/**
 * Example 5: Get all environment variables
 */
function getAllEnv() {
  console.log('\n=== Example 5: Get All Environment Variables ===\n');

  const allEnv = Env.all();
  const appVars = Object.keys(allEnv).filter(k => k.startsWith('APP_'));
  
  console.log('✓ All APP_* environment variables:');
  appVars.forEach(key => {
    console.log(`  - ${key}: ${allEnv[key]}`);
  });
}

/**
 * Example 6: Practical use case - Configuration class
 */
class AppConfig {
  static get name(): string {
    return Env.getString('APP_NAME', 'My App');
  }

  static get port(): number {
    return Env.getNumber('APP_PORT', 3000);
  }

  static get debug(): boolean {
    return Env.getBool('APP_DEBUG', false);
  }

  static get environment(): string {
    return Env.getString('NODE_ENV', 'development');
  }

  static get isProduction(): boolean {
    return this.environment === 'production';
  }

  static get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  static get apiTimeout(): number {
    return Env.getNumber('API_TIMEOUT', 5000);
  }

  static get allowedOrigins(): string[] {
    return Env.getArray('ALLOWED_ORIGINS', ['http://localhost:3000']);
  }

  static toJSON() {
    return {
      name: this.name,
      port: this.port,
      debug: this.debug,
      environment: this.environment,
      isProduction: this.isProduction,
      isDevelopment: this.isDevelopment,
      apiTimeout: this.apiTimeout,
      allowedOrigins: this.allowedOrigins,
    };
  }
}

function configurationClass() {
  console.log('\n=== Example 6: Configuration Class ===\n');

  console.log('✓ Application configuration:');
  console.log(JSON.stringify(AppConfig.toJSON(), null, 2));
}

/**
 * Example 7: Practical use case - Database configuration
 */
function databaseConfig() {
  console.log('\n=== Example 7: Database Configuration ===\n');

  // Set database environment variables
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'myapp';
  process.env.DB_USER = 'admin';
  process.env.DB_PASSWORD = 'secret123';
  process.env.DB_SSL = 'true';

  // Build database configuration using Env helper
  const dbConfig = {
    host: Env.getString('DB_HOST', 'localhost'),
    port: Env.getNumber('DB_PORT', 5432),
    database: Env.getString('DB_NAME', 'myapp'),
    username: Env.getStringOrThrow('DB_USER'),
    password: Env.getStringOrThrow('DB_PASSWORD'),
    ssl: Env.getBool('DB_SSL', false),
  };

  console.log('✓ Database configuration:');
  console.log(JSON.stringify(dbConfig, null, 2));
}

/**
 * Example 8: Practical use case - Feature flags
 */
function featureFlags() {
  console.log('\n=== Example 8: Feature Flags ===\n');

  // Set feature flags
  process.env.FEATURE_CACHE = 'true';
  process.env.FEATURE_LOGGING = '1';
  process.env.FEATURE_METRICS = 'false';

  // Read feature flags using Env helper
  const features = {
    cache: Env.getBool('FEATURE_CACHE', false),
    logging: Env.getBool('FEATURE_LOGGING', false),
    metrics: Env.getBool('FEATURE_METRICS', false),
  };

  console.log('✓ Feature flags:');
  Object.entries(features).forEach(([name, enabled]) => {
    console.log(`  - ${name}: ${enabled ? '✅ enabled' : '❌ disabled'}`);
  });
}

/**
 * Example 9: Comparison with ConfigService
 */
function comparisonWithConfigService() {
  console.log('\n=== Example 9: Env vs ConfigService ===\n');

  console.log('Env Helper:');
  console.log('  ✅ No dependency injection needed');
  console.log('  ✅ Static methods, easy to use anywhere');
  console.log('  ✅ Perfect for simple scripts and utilities');
  console.log('  ✅ Direct access to process.env');
  console.log('  ❌ No driver support (env only)');
  console.log('  ❌ No caching or advanced features');

  console.log('\nConfigService:');
  console.log('  ✅ Multiple driver support (env, file, etc.)');
  console.log('  ✅ Dependency injection integration');
  console.log('  ✅ Advanced features (caching, validation)');
  console.log('  ✅ Better for large applications');
  console.log('  ❌ Requires module setup');
  console.log('  ❌ Needs dependency injection');
}

/**
 * Run all examples
 */
function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Env Helper Examples                  ║');
  console.log('╚════════════════════════════════════════╝');

  setupEnv();

  basicUsage();
  typeSafeGetters();
  requiredValues();
  checkExistence();
  getAllEnv();
  configurationClass();
  databaseConfig();
  featureFlags();
  comparisonWithConfigService();

  console.log('\n✅ All examples completed successfully!\n');
}

// Run the examples
main();
