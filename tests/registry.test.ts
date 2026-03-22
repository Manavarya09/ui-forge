import { describe, it, expect, beforeAll } from 'vitest';
import { Generator } from '../engine/generator.js';
import { registry } from '../engine/registry.js';
import { designLanguageRegistry } from '../design-languages/registry.js';

describe('Template Registry', () => {
  it('should load all templates', () => {
    const templates = registry.list();
    expect(templates.length).toBeGreaterThan(0);
  });

  it('should get a template by id', () => {
    const template = registry.get('saas-modern');
    expect(template).toBeDefined();
    expect(template?.name).toBe('SaaS Modern');
  });

  it('should check if template exists', () => {
    expect(registry.exists('saas-modern')).toBe(true);
    expect(registry.exists('nonexistent')).toBe(false);
  });

  it('should list templates by type', () => {
    const frontend = registry.listByType('frontend');
    expect(frontend.length).toBeGreaterThan(0);
  });
});

describe('Design Language Registry', () => {
  it('should list all styles', async () => {
    const styles = await designLanguageRegistry.listStyles();
    expect(styles.length).toBeGreaterThan(0);
  });

  it('should get a style by name', async () => {
    const style = await designLanguageRegistry.getStyle('minimal');
    expect(style).toBeDefined();
    expect(style?.name).toBe('minimal');
  });

  it('should check if style exists', async () => {
    expect(await designLanguageRegistry.styleExists('minimal')).toBe(true);
    expect(await designLanguageRegistry.styleExists('nonexistent')).toBe(false);
  });

  it('should get default style', async () => {
    const defaultStyle = await designLanguageRegistry.getDefaultStyle();
    expect(defaultStyle).toBeDefined();
  });

  it('should generate CSS variables', async () => {
    const style = await designLanguageRegistry.getStyle('minimal');
    expect(style).toBeDefined();
    const css = designLanguageRegistry.generateStyleCSSVariables(style!);
    expect(css).toContain(':root');
    expect(css).toContain('--background');
  });

  it('should generate Tailwind config', async () => {
    const style = await designLanguageRegistry.getStyle('minimal');
    expect(style).toBeDefined();
    const config = designLanguageRegistry.generateStyleTailwindConfig(style!);
    expect(config).toContain('colors');
    expect(config).toContain('fontFamily');
  });
});

describe('Generator', () => {
  const generator = new Generator();

  it('should validate project name', () => {
    const isValid = (name: string) => /^[a-z0-9-]+$/.test(name);
    
    expect(isValid('my-app')).toBe(true);
    expect(isValid('app123')).toBe(true);
    expect(isValid('MyApp')).toBe(false);
    expect(isValid('my app')).toBe(false);
    expect(isValid('')).toBe(false);
  });
});
