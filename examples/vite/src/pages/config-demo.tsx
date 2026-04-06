import { useState, useMemo } from "react";
import { useInject } from "@abdokouta/react-di";
import { Card, Chip, Button, Separator, Input, Label } from "@heroui/react";
import { CONFIG_SERVICE } from "@abdokouta/config";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import type { ConfigService } from "@/types";

export default function ConfigDemoPage() {
  const configService = useInject<ConfigService>(CONFIG_SERVICE);

  const [testKey, setTestKey] = useState("APP_NAME");
  const [testResult, setTestResult] = useState<string | undefined>();
  const [testType, setTestType] = useState<string>("string");

  // Memoize config to avoid effect issues
  const allConfig = useMemo(() => {
    const config = configService.all();

    return Object.entries(config)
      .filter(
        ([key]) =>
          key.startsWith("APP_") ||
          key.startsWith("VITE_") ||
          key.startsWith("DB_") ||
          key.startsWith("FEATURE_") ||
          key === "NODE_ENV",
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }, [configService]);

  const handleTestGet = () => {
    let result: unknown;

    switch (testType) {
      case "string":
        result = configService.getString(testKey, "N/A");
        break;
      case "number":
        result = configService.getNumber(testKey, 0);
        break;
      case "boolean":
        result = configService.getBool(testKey, false);
        break;
      case "array":
        result = configService.getArray(testKey, []);
        break;
      case "json":
        result = configService.getJson(testKey, {});
        break;
      default:
        result = configService.get(testKey);
    }

    setTestResult(JSON.stringify(result, null, 2));
  };

  const handleCheckExists = () => {
    const exists = configService.has(testKey);

    setTestResult(`Key "${testKey}" exists: ${exists}`);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Config Service Demo</span>
          <p className="text-default-500 mt-4">
            Explore configuration management with @abdokouta/config
          </p>
        </div>

        <div className="w-full max-w-4xl space-y-8">
          {/* Interactive Config Tester */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Interactive Config Tester
            </h2>
            <p className="text-default-500 mb-4">
              Test different ConfigService methods with any configuration key
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="config-key">Configuration Key</Label>
                <Input
                  id="config-key"
                  placeholder="e.g., APP_NAME, DB_HOST"
                  value={testKey}
                  onChange={(e) => setTestKey(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="value-type">Value Type</Label>
                <select
                  className="h-10 px-3 rounded-lg border border-default-200 bg-default-100"
                  id="value-type"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="array">Array</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button onPress={handleTestGet}>Get Value</Button>
              <Button variant="secondary" onPress={handleCheckExists}>
                Check Exists
              </Button>
            </div>

            {testResult && (
              <div className="p-4 bg-default-100 rounded-lg">
                <p className="text-sm font-semibold mb-2">Result:</p>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {testResult}
                </pre>
              </div>
            )}
          </Card>

          <Separator />

          {/* Type-Safe Getters Demo */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Type-Safe Getters</h2>
            <p className="text-default-500 mb-4">
              ConfigService provides type-safe methods for different value types
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">getString()</h4>
                <code className="text-xs bg-default-200 p-2 rounded block">
                  {"config.getString('APP_NAME', 'default')"}
                </code>
                <p className="text-sm text-default-500 mt-2">
                  Result:{" "}
                  <Chip size="sm" variant="soft">
                    {configService.getString("APP_NAME", "N/A")}
                  </Chip>
                </p>
              </div>

              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">getNumber()</h4>
                <code className="text-xs bg-default-200 p-2 rounded block">
                  {"config.getNumber('APP_PORT', 3000)"}
                </code>
                <p className="text-sm text-default-500 mt-2">
                  Result:{" "}
                  <Chip size="sm" variant="soft">
                    {configService.getNumber("APP_PORT", 3000)}
                  </Chip>
                </p>
              </div>

              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">getBool()</h4>
                <code className="text-xs bg-default-200 p-2 rounded block">
                  {"config.getBool('APP_DEBUG', false)"}
                </code>
                <p className="text-sm text-default-500 mt-2">
                  Result:{" "}
                  <Chip
                    color={
                      configService.getBool("APP_DEBUG", false)
                        ? "success"
                        : "default"
                    }
                    size="sm"
                    variant="soft"
                  >
                    {String(configService.getBool("APP_DEBUG", false))}
                  </Chip>
                </p>
              </div>

              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">has()</h4>
                <code className="text-xs bg-default-200 p-2 rounded block">
                  {"config.has('APP_NAME')"}
                </code>
                <p className="text-sm text-default-500 mt-2">
                  Result:{" "}
                  <Chip
                    color={configService.has("APP_NAME") ? "success" : "danger"}
                    size="sm"
                    variant="soft"
                  >
                    {String(configService.has("APP_NAME"))}
                  </Chip>
                </p>
              </div>
            </div>
          </Card>

          <Separator />

          {/* All Configuration */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Configuration</h2>
            <p className="text-default-500 mb-4">
              Current configuration values loaded from environment
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-default-200">
                    <th className="text-left p-2 font-semibold">Key</th>
                    <th className="text-left p-2 font-semibold">Value</th>
                    <th className="text-left p-2 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(allConfig).map(([key, value]) => (
                    <tr key={key} className="border-b border-default-100">
                      <td className="p-2 font-mono text-xs">{key}</td>
                      <td className="p-2">
                        <Chip size="sm" variant="soft">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </Chip>
                      </td>
                      <td className="p-2 text-default-500">{typeof value}</td>
                    </tr>
                  ))}
                  {Object.keys(allConfig).length === 0 && (
                    <tr>
                      <td
                        className="p-4 text-center text-default-400"
                        colSpan={3}
                      >
                        No configuration found. Add VITE_* variables to .env
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Separator />

          {/* Code Examples */}
          <Card className="p-6 bg-primary-50 dark:bg-primary-900/20">
            <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Module Setup</h4>
                <pre className="text-xs bg-default-100 p-3 rounded-lg overflow-x-auto">
                  {`import { ConfigModule } from '@abdokouta/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      driver: 'env',
      isGlobal: true,
      envPrefix: 'auto', // Strips VITE_ prefix
    }),
  ],
})
export class AppModule {}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Inject in Service</h4>
                <pre className="text-xs bg-default-100 p-3 rounded-lg overflow-x-auto">
                  {`import { Injectable, Inject } from '@abdokouta/react-di';
import { CONFIG_SERVICE, ConfigService } from '@abdokouta/config';

@Injectable()
class DatabaseService {
  constructor(
    @Inject(CONFIG_SERVICE) private config: ConfigService
  ) {}

  connect() {
    const host = this.config.getString('DB_HOST', 'localhost');
    const port = this.config.getNumber('DB_PORT', 5432);
  }
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  3. Use in React Component
                </h4>
                <pre className="text-xs bg-default-100 p-3 rounded-lg overflow-x-auto">
                  {`import { useInject } from '@abdokouta/react-di';
import { CONFIG_SERVICE, ConfigService } from '@abdokouta/config';

function MyComponent() {
  const config = useInject<ConfigService>(CONFIG_SERVICE);
  
  const appName = config.getString('APP_NAME');
  const isDebug = config.getBool('APP_DEBUG', false);
  
  return <div>{appName}</div>;
}`}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
