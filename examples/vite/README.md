# @abdokouta/config Demo

This example demonstrates the `@abdokouta/config` package - a NestJS-inspired configuration management module for React applications.

## Features Demonstrated

### Configuration Management

- **Environment Variables**: Load configuration from `.env` files
- **Type-Safe Access**: `getString()`, `getNumber()`, `getBool()`, `getArray()`, `getJson()`
- **Auto Prefix Detection**: Automatically strips `VITE_` or `NEXT_PUBLIC_` prefixes
- **Default Values**: Provide fallback values for missing configuration
- **Existence Checks**: Check if configuration keys exist with `has()`

## Project Structure

```
src/
├── modules/
│   └── app.module.ts       # Root module with ConfigModule.forRoot()
│
├── pages/
│   ├── index.tsx           # Landing page
│   └── config-demo.tsx     # Interactive config demo
│
└── .env                    # Environment variables
```

## Key Concepts

### Module Setup

```typescript
import { ConfigModule } from "@abdokouta/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      driver: "env",
      isGlobal: true,
      envPrefix: "auto",
    }),
  ],
})
export class AppModule {}
```

### Using ConfigService

```typescript
import { ConfigService } from "@abdokouta/config";

// In a service
@Injectable()
class MyService {
  constructor(@Inject(ConfigService) private config: ConfigService) {}

  getDbConfig() {
    return {
      host: this.config.getString("DB_HOST", "localhost"),
      port: this.config.getNumber("DB_PORT", 5432),
      ssl: this.config.getBool("DB_SSL", false),
    };
  }
}

// In a React component
function MyComponent() {
  const config = useInject<ConfigService>(ConfigService);
  const appName = config.getString("APP_NAME");
}
```

## Running the Demo

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```env
VITE_APP_NAME=My App
VITE_APP_PORT=3000
VITE_APP_DEBUG=true
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
```

## Learn More

- [Main Documentation](../../README.md)
- [@abdokouta/config Package](../../packages/config/README.md)
