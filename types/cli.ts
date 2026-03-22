export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export interface CLIOptions {
  verbose?: boolean;
  dryRun?: boolean;
  output?: string;
  config?: string;
  noColor?: boolean;
}

export interface CreateOptions extends CLIOptions {
  template?: string;
  name?: string;
  style?: string;
  sections?: string[];
  ai?: boolean;
  apiKey?: string;
  git?: boolean;
  push?: boolean;
  install?: boolean;
  color?: string;
  font?: string;
  dark?: boolean;
  interactive?: boolean;
}

export interface BackendCLIOptions extends CLIOptions {
  name?: string;
  database?: string;
  auth?: string;
  git?: boolean;
  push?: boolean;
  install?: boolean;
}

export interface AppOptions extends CLIOptions {
  name?: string;
  git?: boolean;
  push?: boolean;
  install?: boolean;
  apiKey?: string;
}

export interface DeployOptions {
  provider: 'vercel' | 'railway' | 'render';
  projectPath?: string;
}

export interface StyleOptions {
  json?: boolean;
  docs?: boolean;
}

export interface ListOptions {
  json?: boolean;
}

export interface AIOptions {
  task: 'style' | 'copy' | 'suggest';
  prompt?: string[];
}
