import type { AIProvider, AIResponse, AIConfig } from './provider.js';

export class GroqProvider implements AIProvider {
  name = 'groq';
  private apiKey: string;
  private model: string;

  constructor(config: AIConfig = {}) {
    this.apiKey = config.groqApiKey || process.env.GROQ_API_KEY || '';
    this.model = config.model || 'llama-3.1-8b-instant';
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(prompt: string): Promise<AIResponse> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Groq API error');
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
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
