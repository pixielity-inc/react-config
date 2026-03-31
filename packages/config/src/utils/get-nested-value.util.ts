/**
 * Get nested value from object using dot notation
 *
 * @param obj - Source object
 * @param path - Dot-notated path (e.g., 'database.host')
 * @param defaultValue - Default value if path not found
 * @returns Value at path or default value
 *
 * @example
 * ```typescript
 * const config = { database: { host: 'localhost' } };
 * getNestedValue(config, 'database.host'); // 'localhost'
 * getNestedValue(config, 'database.port', 5432); // 5432
 * ```
 */
export function getNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Check if nested path exists in object
 *
 * @param obj - Source object
 * @param path - Dot-notated path
 * @returns True if path exists
 */
export function hasNestedValue(obj: Record<string, any>, path: string): boolean {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}
