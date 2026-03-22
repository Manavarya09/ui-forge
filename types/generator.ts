export interface GenerationOptions {
  projectName: string;
  template: string;
  outputDir: string;
  sections?: string[];
  useAI?: boolean;
  darkMode?: boolean;
  primaryColor?: string;
  font?: string;
  style?: string;
  apiKey?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface BackendOptions {
  projectName: string;
  template: string;
  outputDir: string;
  database?: string | null;
  auth?: string | null;
  design?: string | null;
  apiKey?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface GeneratedCopy {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  featuresTitle: string;
  pricingTitle: string;
}

export interface TemplateSection {
  name: string;
  component: string;
  animation?: string;
}

export interface FileChange {
  action: 'create' | 'update' | 'skip';
  path: string;
  size?: number;
  reason?: string;
}

export interface GenerationResult {
  success: boolean;
  projectPath?: string;
  changes: FileChange[];
  errors: string[];
  warnings: string[];
  duration: number;
}

export interface DryRunResult {
  wouldCreate: string[];
  wouldUpdate: string[];
  wouldSkip: string[];
  totalFiles: number;
  estimatedSize: string;
}
