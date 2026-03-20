import type { AIProvider } from '../ai/provider.js';
import { OllamaProvider } from '../ai/ollama.js';
import { GroqProvider } from '../ai/groq.js';
import { logger } from '../utils/logger.js';

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: string[];
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

class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

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

registry.register({
  id: 'premium-landing',
  name: 'Premium Landing',
  description: 'A complete landing page with premium animations and sections',
  sections: ['navbar', 'hero', 'features', 'testimonials', 'pricing', 'footer'],
  files: [],
});
