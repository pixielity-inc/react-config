/**
 * Scan Config Files Utility
 *
 * Scans and collects all .config.ts files based on the provided options.
 */

import { glob } from 'glob';
import type { ViteConfigPluginOptions } from '@/interfaces/vite-config-plugin-options.interface';

/**
 * Scan and collect all .config.ts files
 *
 * @param options - Plugin options containing scan configuration
 * @returns Array of absolute file paths to config files
 */
export async function scanConfigFiles(options: ViteConfigPluginOptions): Promise<string[]> {
  const {
    configFilePattern = 'src/**/*.config.ts',
    excludeDirs = ['node_modules', 'dist', 'build', '.git'],
    root = process.cwd(),
  } = options;

  const patterns = Array.isArray(configFilePattern) ? configFilePattern : [configFilePattern];
  const configFiles: string[] = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd: root,
      absolute: true,
      ignore: excludeDirs.map((dir) => `**/${dir}/**`),
    });
    configFiles.push(...files);
  }

  return configFiles;
}
