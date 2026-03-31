/**
 * ConfigService interface
 * Matches @abdokouta/config ConfigService API
 */
export interface ConfigService {
  get<T = unknown>(key: string, defaultValue?: T): T | undefined;
  getOrThrow<T = unknown>(key: string): T;
  getString(key: string, defaultValue?: string): string | undefined;
  getStringOrThrow(key: string): string;
  getNumber(key: string, defaultValue?: number): number | undefined;
  getNumberOrThrow(key: string): number;
  getBool(key: string, defaultValue?: boolean): boolean | undefined;
  getBoolOrThrow(key: string): boolean;
  getArray(key: string, defaultValue?: string[]): string[] | undefined;
  getJson<T = unknown>(key: string, defaultValue?: T): T | undefined;
  has(key: string): boolean;
  all(): Record<string, unknown>;
}
