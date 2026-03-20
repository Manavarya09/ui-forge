import type { AIProvider } from '../ai/provider.js';
import { OllamaProvider } from '../ai/ollama.js';
import { GroqProvider } from '../ai/groq.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TemplateConfig {
  name: string;
  description: string;
  sections: string[];
  tags: string[];
  color?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: string[];
  tags: string[];
  color?: string;
  files: TemplateFile[];
}

export interface TemplateFile {
  path: string;
  content: string;
  isTemplate?: boolean;
}

export interface TemplateSection {
  name: string;
  component: string;
  animation?: string;
}

interface TemplateConfigEntry {
  id: string;
  name: string;
  description: string;
  sections: string[];
  tags: string[];
  color?: string;
}

const AVAILABLE_TEMPLATES: TemplateConfigEntry[] = [
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Conversion-focused landing with pricing, testimonials, and hero sections optimized for software products',
    sections: ['navbar', 'hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'],
    tags: ['landing', 'saas', 'startup'],
    color: '#6366f1',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Creative showcase for designers and developers with case studies and project galleries',
    sections: ['navbar', 'hero', 'portfolio', 'about', 'contact', 'footer'],
    tags: ['portfolio', 'creative', 'personal'],
    color: '#ec4899',
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics dashboard with charts, tables, metrics cards, and data visualization components',
    sections: ['sidebar', 'header', 'metrics', 'charts', 'table', 'activity'],
    tags: ['dashboard', 'analytics', 'admin'],
    color: '#22c55e',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Multi-vendor e-commerce with product grids, filters, and shopping cart functionality',
    sections: ['navbar', 'hero', 'categories', 'products', 'featured', 'newsletter', 'footer'],
    tags: ['ecommerce', 'marketplace', 'shop'],
    color: '#f59e0b',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Professional services website with portfolio, testimonials, and contact forms',
    sections: ['navbar', 'hero', 'services', 'portfolio', 'testimonials', 'contact', 'footer'],
    tags: ['agency', 'business', 'services'],
    color: '#8b5cf6',
  },
  {
    id: 'ai-product',
    name: 'AI Product',
    description: 'AI-powered product landing with demo sections, feature highlights, and pricing tiers',
    sections: ['navbar', 'hero', 'demo', 'features', 'pricing', 'faq', 'cta', 'footer'],
    tags: ['ai', 'product', 'modern'],
    color: '#06b6d4',
  },
  {
    id: 'saas-modern',
    name: 'SaaS Modern',
    description: 'Modern SaaS landing with dashboard preview, bento grid, social proof, and pricing sections',
    sections: ['hero', 'dashboard-preview', 'social-proof', 'bento', 'testimonials', 'pricing', 'faq', 'cta', 'footer'],
    tags: ['saas', 'landing', 'modern', 'dashboard'],
    color: '#6366f1',
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Stunning real estate portfolio with 3D house visualization for property showcase',
    sections: ['hero', '3d-house', 'portfolio'],
    tags: ['real-estate', 'portfolio', '3d', 'property'],
    color: '#22c55e',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Full-featured e-commerce dashboard with cart management and product listings',
    sections: ['dashboard', 'cart', 'products', 'orders'],
    tags: ['ecommerce', 'dashboard', 'shop', 'cart'],
    color: '#f59e0b',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Bold fitness and gym landing page with programs, schedule, and membership options',
    sections: ['hero', 'marquee', 'programs', 'features', 'schedule', 'cta', 'footer'],
    tags: ['fitness', 'gym', 'landing', 'health'],
    color: '#ef4444',
  },
  {
    id: 'tactical-dashboard',
    name: 'Tactical Dashboard',
    description: 'Military-inspired tactical operations dashboard with command center and system monitoring',
    sections: ['sidebar', 'command-center', 'agent-network', 'operations', 'intelligence', 'systems'],
    tags: ['dashboard', 'tactical', 'operations', 'military'],
    color: '#f97316',
  },
];

class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    const cliDir = path.dirname(__dirname);
    const projectRoot = path.dirname(cliDir);
    const templatesDir = path.join(projectRoot, 'templates');

    for (const config of AVAILABLE_TEMPLATES) {
      const templatePath = path.join(templatesDir, config.id);
      
      if (existsSync(templatePath)) {
        const configPath = path.join(templatePath, 'config.json');
        let templateConfig = config;

        if (existsSync(configPath)) {
          try {
            const configData = JSON.parse(readFileSync(configPath, 'utf-8'));
            templateConfig = { ...config, ...configData };
          } catch {
            logger.warning(`Failed to parse config for ${config.id}, using defaults`);
          }
        }

        this.register({
          id: config.id,
          name: templateConfig.name,
          description: templateConfig.description,
          sections: templateConfig.sections,
          tags: templateConfig.tags,
          color: templateConfig.color,
          files: [],
        });
      }
    }

    this.register({
      id: 'premium-landing',
      name: 'Premium Landing',
      description: 'A complete landing page with premium animations and all sections included',
      sections: ['navbar', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
      tags: ['landing', 'premium', 'complete', 'animation'],
      color: '#a855f7',
      files: [],
    });
  }

  register(template: Template): void {
    this.templates.set(template.id, template);
    logger.info(`Registered template: ${template.name}`);
  }

  get(id: string): Template | undefined {
    return this.templates.get(id);
  }

  list(): Template[] {
    return Array.from(this.templates.values());
  }

  exists(id: string): boolean {
    return this.templates.has(id);
  }

  getByTag(tag: string): Template[] {
    return this.list().filter((t) => t.tags.includes(tag));
  }
}

class AIManager {
  private providers: AIProvider[] = [];
  private activeProvider: AIProvider | null = null;

  constructor() {
    this.providers = [
      new OllamaProvider(),
      new GroqProvider(),
    ];
  }

  async initialize(): Promise<AIProvider | null> {
    for (const provider of this.providers) {
      const available = await provider.isAvailable();
      if (available) {
        this.activeProvider = provider;
        logger.success(`AI Provider: ${provider.name} (active)`);
        return provider;
      }
    }

    if (this.activeProvider) {
      logger.warning(`AI Provider: ${this.activeProvider.name} (limited - no external services available)`);
      return this.activeProvider;
    }

    logger.info('AI features: disabled (no provider available)');
    return null;
  }

  getProvider(): AIProvider | null {
    return this.activeProvider;
  }

  isEnabled(): boolean {
    return this.activeProvider !== null;
  }
}

export const registry = new TemplateRegistry();
export const aiManager = new AIManager();
