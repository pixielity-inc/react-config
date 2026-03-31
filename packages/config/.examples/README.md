# Config Examples

This folder contains examples demonstrating how to use `@abdokouta/config` in
various scenarios.

## Examples Overview

### 1. Basic Usage (`01-basic-usage.ts`)

Learn the fundamental configuration operations:

- ✅ Environment variable access
- ✅ Type-safe getters (getString, getNumber, getBool)
- ✅ Default values
- ✅ Nested configuration
- ✅ JSON configuration
- ✅ Array values

**Run:**

```bash
ts-node examples/01-basic-usage.ts
```

### 2. Multiple Drivers (`02-multiple-drivers.ts`)

Work with different configuration drivers:

- ✅ Environment driver (dotenv)
- ✅ File driver (TypeScript/JSON)
- ✅ Switching between drivers
- ✅ Driver-specific features
- ✅ Configuration merging

**Run:**

```bash
ts-node examples/02-multiple-drivers.ts
```

### 3. Env Helper (`03-env-helper.ts`)

Use the standalone Env utility:

- ✅ Direct environment access
- ✅ Type conversions
- ✅ No service injection needed
- ✅ Static helper methods
- ✅ Quick access patterns

**Run:**

```bash
ts-node examples/03-env-helper.ts
```

## Quick Start

### Installation

```bash
npm install @abdokouta/config @abdokouta/container
```

### Basic Setup

```typescript
import { ConfigModule, ConfigService } from '@abdokouta/config';
import { Inversiland } from '@abdokouta/container';

// Initialize config
const app = await Inversiland.run({
  module: class AppModule {},
  imports: [
    ConfigModule.forRoot({
      driver: 'env',
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
});

// Get config service
const config = app.get(ConfigService);

// Use config
const dbHost = config.getString('DB_HOST', 'localhost');
const dbPort = config.getNumber('DB_PORT', 5432);
```

## Common Patterns

### 1. Database Configuration

```typescript
const dbConfig = {
  host: config.getString('DB_HOST', 'localhost'),
  port: config.getNumber('DB_PORT', 5432),
  database: config.getString('DB_NAME', 'myapp'),
  username: config.getStringOrThrow('DB_USER'),
  password: config.getStringOrThrow('DB_PASSWORD'),
  ssl: config.getBool('DB_SSL', false),
};
```

### 2. API Configuration

```typescript
const apiConfig = {
  url: config.getString('API_URL', 'http://localhost:3000'),
  timeout: config.getNumber('API_TIMEOUT', 5000),
  retries: config.getNumber('API_RETRIES', 3),
  apiKey: config.getStringOrThrow('API_KEY'),
};
```

### 3. Feature Flags

```typescript
const features = {
  enableCache: config.getBool('FEATURE_CACHE', true),
  enableLogging: config.getBool('FEATURE_LOGGING', true),
  enableMetrics: config.getBool('FEATURE_METRICS', false),
};
```

### 4. Array Configuration

```typescript
const allowedOrigins = config.getArray('CORS_ORIGINS', [
  'http://localhost:3000',
]);
const trustedProxies = config.getArray('TRUSTED_PROXIES', []);
```

### 5. JSON Configuration

```typescript
const complexConfig = config.getJson('APP_CONFIG', {
  theme: 'light',
  locale: 'en',
  features: [],
});
```

## Best Practices

### 1. Use Type-Safe Getters

```typescript
// Good: Type-safe with defaults
const port = config.getNumber('PORT', 3000);
const debug = config.getBool('DEBUG', false);

// Bad: Generic get without type safety
const port = config.get('PORT') || 3000;
```

### 2. Require Critical Values

```typescript
// Use OrThrow for required configuration
const apiKey = config.getStringOrThrow('API_KEY');
const dbPassword = config.getStringOrThrow('DB_PASSWORD');
```

### 3. Group Related Configuration

```typescript
class DatabaseConfig {
  constructor(private config: ConfigService) {}

  get host() {
    return this.config.getString('DB_HOST', 'localhost');
  }

  get port() {
    return this.config.getNumber('DB_PORT', 5432);
  }

  get credentials() {
    return {
      username: this.config.getStringOrThrow('DB_USER'),
      password: this.config.getStringOrThrow('DB_PASSWORD'),
    };
  }
}
```

### 4. Use Environment-Specific Defaults

```typescript
const env = config.getString('NODE_ENV', 'development');

const logLevel = config.getString(
  'LOG_LEVEL',
  env === 'production' ? 'error' : 'debug'
);
```

### 5. Validate Configuration on Startup

```typescript
function validateConfig(config: ConfigService) {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'API_KEY'];

  for (const key of required) {
    if (!config.has(key)) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }
}
```

## Configuration Examples

### Environment Driver

```typescript
ConfigModule.forRoot({
  driver: 'env',
  envFilePath: '.env',
  ignoreEnvFile: false,
  expandVariables: true,
  isGlobal: true,
});
```

### File Driver

```typescript
ConfigModule.forRoot({
  driver: 'file',
  load: {
    database: {
      host: 'localhost',
      port: 5432,
    },
    api: {
      url: 'http://localhost:3000',
    },
  },
  isGlobal: true,
});
```

### Custom Configuration

```typescript
ConfigModule.forRoot({
  driver: 'env',
  load: {
    // Merge custom config with env vars
    app: {
      name: 'My App',
      version: '1.0.0',
    },
  },
  isGlobal: true,
});
```

## Troubleshooting

### Configuration Not Loading

1. Check if ConfigModule is imported
2. Verify .env file exists and is readable
3. Check environment variable names
4. Verify driver configuration

### Type Conversion Issues

1. Use appropriate getter methods
2. Check default values
3. Validate input format
4. Use getOrThrow for debugging

### Missing Values

1. Use has() to check existence
2. Provide sensible defaults
3. Use getOrThrow for required values
4. Check environment variable names

## Additional Resources

- [Main README](../README.md) - Package documentation
- [NestJS Config Documentation](https://docs.nestjs.com/techniques/configuration) -
  Inspiration
- [dotenv Documentation](https://github.com/motdotla/dotenv) - Environment
  variables

## Contributing

Found an issue or have a suggestion? Please open an issue or submit a pull
request!
