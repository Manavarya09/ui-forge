export interface AIResponse {
  content: string;
  provider: string;
  success: boolean;
  error?: string;
}

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generate(prompt: string): Promise<AIResponse>;
  generateCopy(context: string): Promise<AIResponse>;
  generateSectionSuggestions(pageType: string): Promise<AIResponse>;
}

export interface AIConfig {
  provider?: 'ollama' | 'groq';
  groqApiKey?: string;
  ollamaUrl?: string;
  model?: string;
}
