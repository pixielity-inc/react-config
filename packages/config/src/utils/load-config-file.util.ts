/**
 * Load Config File Utility
 *
 * Dynamically loads and parses a config file.
 */

/**
 * Load and parse config file
 *
 * @param filePath - Absolute path to the config file
 * @returns Parsed config object
 */
export async function loadConfigFile(
  filePath: string
): Promise<Record<string, any>> {
  try {
    // Dynamic import of the config file
    // @ts-ignore - Dynamic import path
    const module = await import(/* @vite-ignore */ filePath);

    // Extract config object (could be default export or named export)
    const config = module.default || module;

    // If it's a function, call it
    if (typeof config === 'function') {
      return await config();
    }

    return config;
  } catch (error) {
    console.warn(
      `[vite-plugin-config] Failed to load config file: ${filePath}`,
      error
    );
    return {};
  }
}
