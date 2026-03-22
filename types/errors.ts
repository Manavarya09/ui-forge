export enum ErrorCode {
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  STYLE_NOT_FOUND = 'STYLE_NOT_FOUND',
  INVALID_PROJECT_NAME = 'INVALID_PROJECT_NAME',
  INVALID_TEMPLATE = 'INVALID_TEMPLATE',
  INVALID_STYLE = 'INVALID_STYLE',
  DIRECTORY_EXISTS = 'DIRECTORY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AI_PROVIDER_ERROR = 'AI_PROVIDER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class UIForgeError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public hint?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'UIForgeError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      hint: this.hint,
      details: this.details,
    };
  }

  toString(): string {
    let result = `[${this.code}] ${this.message}`;
    if (this.hint) {
      result += `\n💡 Hint: ${this.hint}`;
    }
    return result;
  }
}

export class TemplateNotFoundError extends UIForgeError {
  constructor(templateId: string) {
    super(
      `Template "${templateId}" not found`,
      ErrorCode.TEMPLATE_NOT_FOUND,
      'Run "uiforge list" to see available templates',
      { templateId }
    );
  }
}

export class StyleNotFoundError extends UIForgeError {
  constructor(styleName: string) {
    super(
      `Design style "${styleName}" not found`,
      ErrorCode.STYLE_NOT_FOUND,
      'Run "uiforge styles" to see available styles',
      { styleName }
    );
  }
}

export class InvalidProjectNameError extends UIForgeError {
  constructor(name: string) {
    super(
      `Invalid project name "${name}"`,
      ErrorCode.INVALID_PROJECT_NAME,
      'Use lowercase letters, numbers, and hyphens only',
      { name }
    );
  }
}

export class DirectoryExistsError extends UIForgeError {
  constructor(directory: string) {
    super(
      `Directory "${directory}" already exists`,
      ErrorCode.DIRECTORY_EXISTS,
      'Choose a different name or remove the existing directory',
      { directory }
    );
  }
}

export class ValidationError extends UIForgeError {
  constructor(field: string, message: string) {
    super(
      `Validation failed for "${field}": ${message}`,
      ErrorCode.VALIDATION_ERROR,
      undefined,
      { field }
    );
  }
}

export class AIProviderError extends UIForgeError {
  constructor(provider: string, message: string) {
    super(
      `AI provider error (${provider}): ${message}`,
      ErrorCode.AI_PROVIDER_ERROR,
      'Check your API key or try again later',
      { provider }
    );
  }
}

export class ConfigError extends UIForgeError {
  constructor(message: string, file?: string) {
    super(
      `Configuration error${file ? ` in ${file}` : ''}: ${message}`,
      ErrorCode.CONFIG_ERROR,
      'Check your configuration file and try again',
      { file }
    );
  }
}

export function isUIForgeError(error: unknown): error is UIForgeError {
  return error instanceof UIForgeError;
}

export function formatError(error: unknown): string {
  if (isUIForgeError(error)) {
    return error.toString();
  }
  
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  
  return 'An unknown error occurred';
}
