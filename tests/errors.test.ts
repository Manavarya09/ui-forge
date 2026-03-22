import { describe, it, expect } from 'vitest';
import {
  UIForgeError,
  TemplateNotFoundError,
  StyleNotFoundError,
  InvalidProjectNameError,
  DirectoryExistsError,
  ValidationError,
  AIProviderError,
  ConfigError,
  ErrorCode,
  isUIForgeError,
  formatError,
} from '../types/errors.js';

describe('UIForgeError', () => {
  it('should create an error with code and hint', () => {
    const error = new UIForgeError(
      'Something went wrong',
      ErrorCode.UNKNOWN_ERROR,
      'Try again later'
    );

    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(error.hint).toBe('Try again later');
    expect(error.name).toBe('UIForgeError');
  });

  it('should format error as string', () => {
    const error = new UIForgeError(
      'Test error',
      ErrorCode.UNKNOWN_ERROR,
      'This is a hint'
    );

    const str = error.toString();
    expect(str).toContain('[UNKNOWN_ERROR]');
    expect(str).toContain('Test error');
    expect(str).toContain('This is a hint');
  });

  it('should serialize to JSON', () => {
    const error = new UIForgeError(
      'Test error',
      ErrorCode.UNKNOWN_ERROR,
      'Hint',
      { key: 'value' }
    );

    const json = error.toJSON();
    expect(json.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(json.message).toBe('Test error');
    expect(json.hint).toBe('Hint');
    expect(json.details).toEqual({ key: 'value' });
  });
});

describe('TemplateNotFoundError', () => {
  it('should create template not found error', () => {
    const error = new TemplateNotFoundError('my-template');

    expect(error.message).toContain('my-template');
    expect(error.code).toBe(ErrorCode.TEMPLATE_NOT_FOUND);
    expect(error.hint).toContain('uiforge list');
  });
});

describe('StyleNotFoundError', () => {
  it('should create style not found error', () => {
    const error = new StyleNotFoundError('glass');

    expect(error.message).toContain('glass');
    expect(error.code).toBe(ErrorCode.STYLE_NOT_FOUND);
    expect(error.hint).toContain('uiforge styles');
  });
});

describe('InvalidProjectNameError', () => {
  it('should create invalid project name error', () => {
    const error = new InvalidProjectNameError('MyApp');

    expect(error.message).toContain('MyApp');
    expect(error.code).toBe(ErrorCode.INVALID_PROJECT_NAME);
    expect(error.hint).toContain('lowercase');
  });
});

describe('DirectoryExistsError', () => {
  it('should create directory exists error', () => {
    const error = new DirectoryExistsError('my-project');

    expect(error.message).toContain('my-project');
    expect(error.code).toBe(ErrorCode.DIRECTORY_EXISTS);
  });
});

describe('ValidationError', () => {
  it('should create validation error', () => {
    const error = new ValidationError('email', 'Invalid email format');

    expect(error.message).toContain('email');
    expect(error.message).toContain('Invalid email format');
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });
});

describe('AIProviderError', () => {
  it('should create AI provider error', () => {
    const error = new AIProviderError('openai', 'API key invalid');

    expect(error.message).toContain('openai');
    expect(error.message).toContain('API key invalid');
    expect(error.code).toBe(ErrorCode.AI_PROVIDER_ERROR);
  });
});

describe('ConfigError', () => {
  it('should create config error', () => {
    const error = new ConfigError('Invalid JSON', '.uiforgerc');

    expect(error.message).toContain('Invalid JSON');
    expect(error.message).toContain('.uiforgerc');
    expect(error.code).toBe(ErrorCode.CONFIG_ERROR);
  });
});

describe('isUIForgeError', () => {
  it('should return true for UIForgeError', () => {
    const error = new UIForgeError('Test', ErrorCode.UNKNOWN_ERROR);
    expect(isUIForgeError(error)).toBe(true);
  });

  it('should return false for regular Error', () => {
    const error = new Error('Test');
    expect(isUIForgeError(error)).toBe(false);
  });

  it('should return false for non-Error values', () => {
    expect(isUIForgeError('string')).toBe(false);
    expect(isUIForgeError(null)).toBe(false);
    expect(isUIForgeError(undefined)).toBe(false);
    expect(isUIForgeError({})).toBe(false);
  });
});

describe('formatError', () => {
  it('should format UIForgeError', () => {
    const error = new UIForgeError(
      'Test error',
      ErrorCode.UNKNOWN_ERROR,
      'Hint'
    );
    const formatted = formatError(error);
    expect(formatted).toContain('Test error');
  });

  it('should format regular Error', () => {
    const error = new Error('Regular error');
    const formatted = formatError(error);
    expect(formatted).toBe('Error: Regular error');
  });

  it('should format unknown errors', () => {
    const formatted = formatError('string error');
    expect(formatted).toBe('An unknown error occurred');
  });
});
