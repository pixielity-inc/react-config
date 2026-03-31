import { Module } from "@abdokouta/react-di";
import { ConfigModule } from "@abdokouta/config";

/**
 * App Module - Config Demo
 *
 * Demonstrates @abdokouta/config package features:
 * - Environment variable loading
 * - Type-safe configuration access
 * - Auto prefix detection (VITE_)
 */
@Module({
  imports: [
    // ConfigModule from @abdokouta/config
    ConfigModule.forRoot({
      driver: "env",
      isGlobal: true,
      envPrefix: "auto", // Auto-detects VITE_ prefix
    }),
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
