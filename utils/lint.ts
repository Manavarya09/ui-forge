import { writeFile } from '../utils/fs.js';

export interface LintConfigOptions {
  projectType: 'frontend' | 'backend' | 'fullstack';
  framework?: 'nextjs' | 'express' | 'standalone';
  strict?: boolean;
  withPrettier?: boolean;
  withHusky?: boolean;
}

export async function generateESLintConfig(
  outputDir: string,
  options: LintConfigOptions
): Promise<void> {
  const { projectType, framework = 'nextjs', strict = true, withPrettier = true } = options;
  
  let eslintConfig: Record<string, unknown>;
  
  if (projectType === 'backend' || framework === 'express') {
    const extendsConfig: string[] = ['eslint:recommended', 'typescript-eslint'];
    if (withPrettier) {
      extendsConfig.push('prettier');
    }
    
    eslintConfig = {
      root: true,
      env: { node: true, es2022: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      extends: extendsConfig,
      rules: {
        'no-console': 'warn',
        'no-unused-vars': 'off',
        ...(strict ? {
          '@typescript-eslint/no-explicit-any': 'warn',
          '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        } : {}),
      },
    };
  } else {
    const extendsConfig: string[] = ['next', 'next/core-web-vitals'];
    if (withPrettier) {
      extendsConfig.push('prettier');
    }
    
    eslintConfig = {
      root: true,
      extends: extendsConfig,
      rules: {
        'react/no-unescaped-entities': 'off',
        '@next/next/no-page-custom-font': 'off',
        ...(strict ? {
          '@typescript-eslint/no-explicit-any': 'warn',
          '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        } : {}),
      },
    };
  }

  await writeFile(
    `${outputDir}/.eslintrc.json`,
    JSON.stringify(eslintConfig, null, 2)
  );
}

export async function generatePrettierConfig(outputDir: string): Promise<void> {
  const prettierConfig = {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
  };

  await writeFile(
    `${outputDir}/.prettierrc`,
    JSON.stringify(prettierConfig, null, 2)
  );

  await writeFile(
    `${outputDir}/.prettierignore`,
    `node_modules
dist
build
.next
coverage
.env
.env.local
`
  );
}

export async function generateHuskyConfig(outputDir: string): Promise<void> {
  const huskyDir = `${outputDir}/.husky`;
  
  await writeFile(
    `${huskyDir}/pre-commit`,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
`
  );

  await writeFile(
    `${outputDir}/.lintstagedrc`,
    JSON.stringify({
      '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
      '*.{js,json,css,md}': ['prettier --write'],
    }, null, 2)
  );
}

export async function generateCodeQualityConfigs(
  outputDir: string,
  options: LintConfigOptions
): Promise<void> {
  await generateESLintConfig(outputDir, options);
  
  if (options.withPrettier !== false) {
    await generatePrettierConfig(outputDir);
  }
  
  if (options.withHusky) {
    await generateHuskyConfig(outputDir);
  }
}