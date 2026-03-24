import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface UIForgeConfig {
  version: string;
  defaults: {
    template?: string;
    style?: string;
    database?: string;
    auth?: string;
  };
  git?: {
    autoInit: boolean;
    autoPush: boolean;
  };
  install?: {
    autoInstall: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm';
  };
  output?: {
    directory: string;
  };
}

export interface ResolvedConfig extends UIForgeConfig {
  sources: {
    global: Partial<UIForgeConfig>;
    project: Partial<UIForgeConfig>;
    cli: Partial<UIForgeConfig>;
  };
}

const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.uiforcrc');
const PROJECT_CONFIG_PATH = '.uiforgerc.json';

export async function loadGlobalConfig(): Promise<Partial<UIForgeConfig> | null> {
  try {
    if (await fs.pathExists(GLOBAL_CONFIG_PATH)) {
      const content = await fs.readFile(GLOBAL_CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Failed to load global config:', error);
  }
  return null;
}

export async function loadProjectConfig(projectPath?: string): Promise<Partial<UIForgeConfig> | null> {
  try {
    const configPath = path.resolve(projectPath || '.', PROJECT_CONFIG_PATH);
    if (await fs.pathExists(configPath)) {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Failed to load project config:', error);
  }
  return null;
}

export async function loadEnvConfig(): Promise<Partial<UIForgeConfig>> {
  const config: Partial<UIForgeConfig> = {
    defaults: {},
    git: { autoInit: false, autoPush: false },
    install: { autoInstall: true, packageManager: 'npm' },
  };

  if (process.env.UIFORGE_TEMPLATE) {
    config.defaults!.template = process.env.UIFORGE_TEMPLATE;
  }
  if (process.env.UIFORGE_STYLE) {
    config.defaults!.style = process.env.UIFORGE_STYLE;
  }
  if (process.env.UIFORGE_DATABASE) {
    config.defaults!.database = process.env.UIFORGE_DATABASE;
  }
  if (process.env.UIFORGE_AUTH) {
    config.defaults!.auth = process.env.UIFORGE_AUTH;
  }
  if (process.env.UIFORGE_AUTO_GIT !== undefined) {
    config.git!.autoInit = process.env.UIFORGE_AUTO_GIT === 'true';
  }
  if (process.env.UIFORGE_AUTO_PUSH !== undefined) {
    config.git!.autoPush = process.env.UIFORGE_AUTO_PUSH === 'true';
  }
  if (process.env.UIFORGE_AUTO_INSTALL !== undefined) {
    config.install!.autoInstall = process.env.UIFORGE_AUTO_INSTALL === 'true';
  }
  if (process.env.UIFORGE_PKG_MGR) {
    const pm = process.env.UIFORGE_PKG_MGR.toLowerCase();
    if (pm === 'yarn' || pm === 'pnpm') {
      config.install!.packageManager = pm;
    }
  }

  return config;
}

export async function resolveConfig(options: {
  template?: string;
  style?: string;
  database?: string;
  auth?: string;
  git?: boolean;
  push?: boolean;
  install?: boolean;
  projectPath?: string;
}): Promise<ResolvedConfig> {
  const [globalConfig, projectConfig, envConfig] = await Promise.all([
    loadGlobalConfig(),
    loadProjectConfig(options.projectPath),
    loadEnvConfig(),
  ]);

  const defaultConfig: UIForgeConfig = {
    version: '1.0.0',
    defaults: {},
    git: { autoInit: false, autoPush: false },
    install: { autoInstall: true, packageManager: 'npm' },
  };

  const merged: ResolvedConfig = {
    ...defaultConfig,
    ...globalConfig,
    ...projectConfig,
    ...envConfig,
    defaults: {
      ...defaultConfig.defaults,
      ...globalConfig?.defaults,
      ...projectConfig?.defaults,
      ...envConfig?.defaults,
    },
    git: {
      ...defaultConfig.git,
      ...globalConfig?.git,
      ...projectConfig?.git,
      ...envConfig?.git,
    } as typeof defaultConfig.git,
    install: {
      ...defaultConfig.install,
      ...globalConfig?.install,
      ...projectConfig?.install,
      ...envConfig?.install,
    } as typeof defaultConfig.install,
    sources: {
      global: globalConfig || {},
      project: projectConfig || {},
      cli: {},
    },
  };

  if (options.template) merged.defaults.template = options.template;
  if (options.style) merged.defaults.style = options.style;
  if (options.database) merged.defaults.database = options.database;
  if (options.auth) merged.defaults.auth = options.auth;
  if (options.git !== undefined) merged.git!.autoInit = options.git;
  if (options.push !== undefined) merged.git!.autoPush = options.push;
  if (options.install !== undefined) merged.install!.autoInstall = options.install;

  merged.sources.cli = {
    defaults: {
      template: options.template,
      style: options.style,
      database: options.database,
      auth: options.auth,
    },
    git: { autoInit: options.git ?? false, autoPush: options.push ?? false },
    install: { autoInstall: options.install ?? true, packageManager: 'npm' },
  };

  return merged;
}

export async function saveProjectConfig(config: Partial<UIForgeConfig>, projectPath?: string): Promise<void> {
  const configPath = path.resolve(projectPath || '.', PROJECT_CONFIG_PATH);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export async function saveGlobalConfig(config: Partial<UIForgeConfig>): Promise<void> {
  await fs.writeFile(GLOBAL_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}