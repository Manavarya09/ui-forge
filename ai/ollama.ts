import type { AIProvider, AIResponse, AIConfig } from './provider.js';

export class OllamaProvider implements AIProvider {
  name = 'ollama';
  private url: string;
  private model: string;

  constructor(config: AIConfig = {}) {
    this.url = config.ollamaUrl || 'http://localhost:11434';
    this.model = config.model || 'llama3';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(prompt: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.response,
        provider: this.name,
        success: true,
      };
    } catch (error) {
      return {
        content: '',
        provider: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateCopy(context: string): Promise<AIResponse> {
    const prompt = `Generate compelling marketing copy for the following context. Keep it concise, professional, and conversion-focused:

${context}

Respond with ONLY the copy, no explanations.`;
    return this.generate(prompt);
  }

  async generateSectionSuggestions(pageType: string): Promise<AIResponse> {
    const prompt = `Suggest the best sections for a ${pageType} landing page. Consider conversion optimization and modern design patterns. 
Respond with a JSON array of section names only, like: ["hero", "features", "pricing"]`;
    return this.generate(prompt);
  }
}
