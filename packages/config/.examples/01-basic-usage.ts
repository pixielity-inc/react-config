/**
 * Basic Config Usage Example
 * 
 * This example demonstrates the fundamental configuration operations:
 * - Environment variable access
 * - Type-safe getters
 * - Default values
 * - Nested configuration
 * 
 * @example
 * Run this example:
 * ```bash
 * ts-node examples/01-basic-usage.ts
 * ```
 */

import { ConfigModule, ConfigService } from '@abdokouta/config';
import { Inversiland } from '@abdokouta/react-di';

/**
 * Initialize the config module
 */
async function setupConfig() {
  // Set some example environment variables
  process.env.APP_NAME = 'My Application';
  process.env.APP_PORT = '3000';
  process.env.APP_DEBUG = 'true';
  process.env.APP_URL = 'http://localhost:3000';
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,example.com';
  process.env.DATABASE_CONFIG = JSON.stringify({
    host: 'localhost',
    port: 5432,
    database: 'myapp',
  });

  // Create the application module with config
  const app = await Inversiland.run({
    module: class AppModule {},
    imports: [
      ConfigModule.forRoot({
        driver: 'env',
        ignoreEnvFile: true, // Use process.env directly for this example
        isGlobal: true,
      }),
    ],
  });

  return app.get(ConfigService);
}

/**
 * Example 1: Basic string values
 */
function stringValues(config: ConfigService) {
  console.log('\n=== Example 1: String Values ===\n');

  // Get string value
  const appName = config.getString('APP_NAME');
  console.log(`✓ APP_NAME: "${appName}"`);

  // Get string with default
  const appEnv = config.getString('APP_ENV', 'development');
  console.log(`✓ APP_ENV: "${appEnv}" (using default)`);

  // Get URL
  const appUrl = config.getString('APP_URL');
  console.log(`✓ APP_URL: "${appUrl}"`);
}

/**
 * Example 2: Number values
 */
function numberValues(config: ConfigService) {
  console.log('\n=== Example 2: Number Values ===\n');

  // Get number value
  const port = config.getNumber('APP_PORT');
  console.log(`✓ APP_PORT: ${port} (type: ${typeof port})`);

  // Get number with default
  const timeout = config.getNumber('APP_TIMEOUT', 5000);
  console.log(`✓ APP_TIMEOUT: ${timeout} (using default)`);

  // Get number that doesn't exist
  const maxConnections = config.getNumber('MAX_CONNECTIONS', 100);
  console.log(`✓ MAX_CONNECTIONS: ${maxConnections} (using default)`);
}

/**
 * Example 3: Boolean values
 */
function booleanValues(config: ConfigService) {
  console.log('\n=== Example 3: Boolean Values ===\n');

  // Get boolean value (true)
  const debug = config.getBool('APP_DEBUG');
  console.log(`✓ APP_DEBUG: ${debug} (type: ${typeof debug})`);

  // Get boolean with default
  const enableCache = config.getBool('ENABLE_CACHE', true);
  console.log(`✓ ENABLE_CACHE: ${enableCache} (using default)`);

  // Test various boolean formats
  process.env.TEST_TRUE_1 = 'true';
  process.env.TEST_TRUE_2 = '1';
  process.env.TEST_TRUE_3 = 'yes';
  process.env.TEST_TRUE_4 = 'on';
  process.env.TEST_FALSE = 'false';

  console.log(`✓ "true" → ${config.getBool('TEST_TRUE_1')}`);
  console.log(`✓ "1" → ${config.getBool('TEST_TRUE_2')}`);
  console.log(`✓ "yes" → ${config.getBool('TEST_TRUE_3')}`);
  console.log(`✓ "on" → ${config.getBool('TEST_TRUE_4')}`);
  console.log(`✓ "false" → ${config.getBool('TEST_FALSE')}`);
}

/**
 * Example 4: Array values
 */
function arrayValues(config: ConfigService) {
  console.log('\n=== Example 4: Array Values ===\n');

  // Get array from comma-separated string
  const allowedHosts = config.getArray('ALLOWED_HOSTS');
  console.log(`✓ ALLOWED_HOSTS:`, allowedHosts);

  // Get array with default
  const corsOrigins = config.getArray('CORS_ORIGINS', ['http://localhost:3000']);
  console.log(`✓ CORS_ORIGINS:`, corsOrigins, '(using default)');

  // Empty array
  const emptyArray = config.getArray('EMPTY_ARRAY', []);
  console.log(`✓ EMPTY_ARRAY:`, emptyArray, '(using default)');
}

/**
 * Example 5: JSON values
 */
function jsonValues(config: ConfigService) {
  console.log('\n=== Example 5: JSON Values ===\n');

  // Get JSON object
  const dbConfig = config.getJson('DATABASE_CONFIG');
  console.log(`✓ DATABASE_CONFIG:`, dbConfig);

  // Get JSON with default
  const apiConfig = config.getJson('API_CONFIG', {
    url: 'http://localhost:3000',
    timeout: 5000,
  });
  console.log(`✓ API_CONFIG:`, apiConfig, '(using default)');
}

/**
 * Example 6: Check if keys exist
 */
function checkExistence(config: ConfigService) {
  console.log('\n=== Example 6: Check Existence ===\n');

  // Check existing key
  const hasAppName = config.has('APP_NAME');
  console.log(`✓ has('APP_NAME'): ${hasAppName}`);

  // Check non-existent key
  const hasApiKey = config.has('API_KEY');
  console.log(`✓ has('API_KEY'): ${hasApiKey}`);
}

/**
 * Example 7: Required values (OrThrow)
 */
function requiredValues(config: ConfigService) {
  console.log('\n=== Example 7: Required Values ===\n');

  try {
    // Get required value that exists
    const appName = config.getStringOrThrow('APP_NAME');
    console.log(`✓ getStringOrThrow('APP_NAME'): "${appName}"`);

    // Try to get required value that doesn't exist
    const apiKey = config.getStringOrThrow('API_KEY');
    console.log(`✓ getStringOrThrow('API_KEY'): "${apiKey}"`);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
    console.log(`  💡 Use OrThrow methods for required configuration`);
  }
}

/**
 * Example 8: Get all configuration
 */
function getAllConfig(config: ConfigService) {
  console.log('\n=== Example 8: Get All Configuration ===\n');

  const allConfig = config.all();
  const keys = Object.keys(allConfig).filter(k => k.startsWith('APP_') || k.startsWith('ALLOWED_'));
  
  console.log('✓ All APP_* and ALLOWED_* configuration:');
  keys.forEach(key => {
    console.log(`  - ${key}: ${allConfig[key]}`);
  });
}

/**
 * Example 9: Practical use case - Database configuration
 */
function databaseConfig(config: ConfigService) {
  console.log('\n=== Example 9: Database Configuration ===\n');

  // Set database environment variables
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'myapp';
  process.env.DB_USER = 'admin';
  process.env.DB_PASSWORD = 'secret123';
  process.env.DB_SSL = 'true';
  process.env.DB_POOL_MIN = '2';
  process.env.DB_POOL_MAX = '10';

  // Build database configuration object
  const dbConfig = {
    host: config.getString('DB_HOST', 'localhost'),
    port: config.getNumber('DB_PORT', 5432),
    database: config.getString('DB_NAME', 'myapp'),
    username: config.getString('DB_USER'),
    password: config.getString('DB_PASSWORD'),
    ssl: config.getBool('DB_SSL', false),
    pool: {
      min: config.getNumber('DB_POOL_MIN', 2),
      max: config.getNumber('DB_POOL_MAX', 10),
    },
  };

  console.log('✓ Database configuration:');
  console.log(JSON.stringify(dbConfig, null, 2));
}

/**
 * Example 10: Practical use case - Feature flags
 */
function featureFlags(config: ConfigService) {
  console.log('\n=== Example 10: Feature Flags ===\n');

  // Set feature flags
  process.env.FEATURE_CACHE = 'true';
  process.env.FEATURE_LOGGING = 'true';
  process.env.FEATURE_METRICS = 'false';
  process.env.FEATURE_ANALYTICS = '1';

  // Read feature flags
  const features = {
    cache: config.getBool('FEATURE_CACHE', false),
    logging: config.getBool('FEATURE_LOGGING', false),
    metrics: config.getBool('FEATURE_METRICS', false),
    analytics: config.getBool('FEATURE_ANALYTICS', false),
  };

  console.log('✓ Feature flags:');
  Object.entries(features).forEach(([name, enabled]) => {
    console.log(`  - ${name}: ${enabled ? '✅ enabled' : '❌ disabled'}`);
  });
}

/**
 * Run all examples
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Config Basic Usage Examples          ║');
  console.log('╚════════════════════════════════════════╝');

  const config = await setupConfig();

  stringValues(config);
  numberValues(config);
  booleanValues(config);
  arrayValues(config);
  jsonValues(config);
  checkExistence(config);
  requiredValues(config);
  getAllConfig(config);
  databaseConfig(config);
  featureFlags(config);

  console.log('\n✅ All examples completed successfully!\n');
}

// Run the examples
main().catch(console.error);
