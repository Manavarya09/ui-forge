import { writeFile, ensureDir, readFile } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Plugin {
  name: string;
  version: string;
  description: string;
  hooks: PluginHooks;
  config?: Record<string, unknown>;
}

export interface PluginHooks {
  beforeGenerate?: (context: GenerationContext) => Promise<void> | void;
  afterGenerate?: (context: GenerationContext) => Promise<void> | void;
  onError?: (error: Error, context: GenerationContext) => Promise<void> | void;
}

export interface GenerationContext {
  projectName: string;
  template: string;
  outputDir: string;
  style?: string;
  options: Record<string, unknown>;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginDir: string;

  constructor() {
    const cliDir = path.dirname(__dirname);
    const projectRoot = path.dirname(cliDir);
    this.pluginDir = path.join(projectRoot, 'plugins');
  }

  async loadPlugin(pluginPath: string): Promise<Plugin> {
    try {
      const { default: plugin } = await import(pluginPath);
      if (!plugin.name || !plugin.hooks) {
        throw new Error('Invalid plugin: missing name or hooks');
      }
      this.plugins.set(plugin.name, plugin);
      logger.success(`Loaded plugin: ${plugin.name}`);
      return plugin;
    } catch (error) {
      logger.error(`Failed to load plugin from ${pluginPath}`);
      throw error;
    }
  }

  async loadPluginsFromDir(): Promise<void> {
    try {
      const fsPromises = await import('fs/promises');
      const entries = await fsPromises.readdir(this.pluginDir);
      
      for (const entry of entries) {
        const entryPath = path.join(this.pluginDir, entry);
        const stats = await fsPromises.stat(entryPath);
        
        if (stats.isDirectory() && entry.startsWith('uiforge-')) {
          const pluginPath = path.join(entryPath, 'index.js');
          try {
            await this.loadPlugin(pluginPath);
          } catch {
            logger.warning(`Skipped plugin: ${entry}`);
          }
        }
      }
    } catch {
      logger.debug('No plugins directory found');
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  async executeHook(
    hookName: keyof PluginHooks,
    context: GenerationContext,
    error?: Error
  ): Promise<void> {
    for (const plugin of this.plugins.values()) {
      const hook = plugin.hooks[hookName];
      if (hook) {
        try {
          if (hookName === 'onError' && error) {
            await (hook as (error: Error, context: GenerationContext) => Promise<void>)(error, context);
          } else if (hookName !== 'onError') {
            await (hook as (context: GenerationContext) => Promise<void>)(context);
          }
        } catch (err) {
          if (hookName !== 'onError') {
            logger.error(`Plugin ${plugin.name} hook ${hookName} failed: ${(err as Error).message}`);
          }
        }
      }
    }
  }

  createPlugin(name: string, version: string, description: string): Plugin {
    return {
      name,
      version,
      description,
      hooks: {},
    };
  }

  async installPlugin(pluginName: string): Promise<void> {
    logger.info(`Installing plugin: ${pluginName}`);
    logger.debug(`Plugin installation would run: npm install ${pluginName}`);
  }

  async uninstallPlugin(pluginName: string): Promise<void> {
    if (!this.plugins.has(pluginName)) {
      logger.warning(`Plugin ${pluginName} is not installed`);
      return;
    }
    this.plugins.delete(pluginName);
    logger.success(`Uninstalled plugin: ${pluginName}`);
  }
}

export const pluginManager = new PluginManager();

export const createPlugin = (
  name: string,
  version: string,
  description: string,
  hooks: PluginHooks = {}
): Plugin => ({
  name,
  version,
  description,
  hooks,
});

export const officialPlugins = {
  deploy: {
    name: '@uiforge/deploy',
    description: 'One-click deployment to Vercel, Netlify, and more',
    version: '1.0.0',
  },
  analytics: {
    name: '@uiforge/analytics',
    description: 'Add analytics to your generated projects',
    version: '1.0.0',
  },
  cms: {
    name: '@uiforge/cms',
    description: 'Integrate with popular CMS platforms',
    version: '1.0.0',
  },
  email: {
    name: '@uiforge/email',
    description: 'Email templates and sending integration',
    version: '1.0.0',
  },
};
