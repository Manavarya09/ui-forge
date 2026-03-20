import { writeFile, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export interface TestConfig {
  framework: 'playwright' | 'cypress' | 'vitest';
  componentTests?: boolean;
  e2eTests?: boolean;
}

export class TestingScaffold {
  static async setup(projectPath: string, framework: string = 'playwright'): Promise<void> {
    const testsDir = path.join(projectPath, 'tests');
    await ensureDir(testsDir);

    if (framework === 'playwright') {
      await this.setupPlaywright(projectPath);
    } else if (framework === 'cypress') {
      await this.setupCypress(projectPath);
    } else {
      await this.setupVitest(projectPath);
    }

    await this.setupBaseFiles(projectPath, framework);

    logger.success(`Testing scaffold (${framework}) setup complete`);
  }

  static async generateComponentTests(projectPath: string): Promise<void> {
    const testsDir = path.join(projectPath, 'tests', 'components');
    await ensureDir(testsDir);

    const components = ['Button', 'Card', 'Input', 'Badge', 'Modal'];
    
    for (const component of components) {
      await writeFile(
        path.join(testsDir, `${component}.test.tsx`),
        this.generateComponentTest(component)
      );
    }

    logger.success(`Generated ${components.length} component tests`);
  }

  static async generateE2ETests(projectPath: string): Promise<void> {
    const testsDir = path.join(projectPath, 'tests', 'e2e');
    await ensureDir(testsDir);

    await writeFile(
      path.join(testsDir, 'home.spec.ts'),
      this.generateHomePageTest()
    );

    await writeFile(
      path.join(testsDir, 'navigation.spec.ts'),
      this.generateNavigationTest()
    );

    logger.success('Generated E2E tests');
  }

  private static async setupPlaywright(projectPath: string): Promise<void> {
    const playwrightDir = path.join(projectPath, 'tests', 'playwright');
    await ensureDir(playwrightDir);

    await writeFile(
      path.join(playwrightDir, 'playwright.config.ts'),
      `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
`
    );

    await writeFile(
      path.join(playwrightDir, 'example.spec.ts'),
      `import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/UIForge/);
  });

  test('hero section loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('nav a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
`
    );

    await this.updatePackageJson(projectPath, 'playwright');
  }

  private static async setupCypress(projectPath: string): Promise<void> {
    const cypressDir = path.join(projectPath, 'cypress');
    await ensureDir(path.join(cypressDir, 'e2e'));
    await ensureDir(path.join(cypressDir, 'fixtures'));
    await ensureDir(path.join(cypressDir, 'support'));

    await writeFile(
      path.join(cypressDir, 'cypress.config.ts'),
      `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
`
    );

    await writeFile(
      path.join(cypressDir, 'support', 'commands.ts'),
      `/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    dataCy(value: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });
});

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(\`[data-cy="\${value}"]\`);
});
`
    );

    await writeFile(
      path.join(cypressDir, 'support', 'e2e.ts'),
      `import './commands';
`
    );

    await writeFile(
      path.join(cypressDir, 'e2e', 'home.cy.ts'),
      `describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the hero section', () => {
    cy.get('h1').should('be.visible');
  });

  it('navigation works', () => {
    cy.get('nav').should('exist');
  });

  it('has working links', () => {
    cy.get('a').first().should('have.attr', 'href');
  });
});
`
    );

    await this.updatePackageJson(projectPath, 'cypress');
  }

  private static async setupVitest(projectPath: string): Promise<void> {
    const testsDir = path.join(projectPath, 'tests');
    await ensureDir(testsDir);

    await writeFile(
      path.join(projectPath, 'vitest.config.ts'),
      `import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
`
    );

    await writeFile(
      path.join(testsDir, 'setup.ts'),
      `import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
`
    );

    await writeFile(
      path.join(testsDir, 'example.test.tsx'),
      `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Example Tests', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });
});
`
    );

    await this.updatePackageJson(projectPath, 'vitest');
  }

  private static async setupBaseFiles(projectPath: string, framework: string): Promise<void> {
    await writeFile(
      path.join(projectPath, 'tests', '.gitkeep'),
      ''
    );

    await writeFile(
      path.join(projectPath, 'tests', 'README.md'),
      `# Tests

This directory contains all tests for the project.

## Running Tests

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
\`\`\`

## Test Structure

- \`/components\` - Component unit tests
- \`/e2e\` - End-to-end tests
- \`/fixtures\` - Test data and mocks
- \`/support\` - Test utilities and helpers
`
    );
  }

  private static generateComponentTest(componentName: string): string {
    return `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${componentName} } from '@/components/ui/${componentName.toLowerCase()}';

describe('${componentName} Component', () => {
  it('renders without crashing', () => {
    render(<${componentName}>Test</${componentName}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    const { container } = render(<${componentName}>Content</${componentName}>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
`;
  }

  private static generateHomePageTest(): string {
    return `import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section displays correctly', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await expect(errors).toHaveLength(0);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('navigation is accessible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });
});
`;
  }

  private static generateNavigationTest(): string {
    return `import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('main navigation links are present', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    
    // Tab through navigation
    let tabCount = 0;
    while (tabCount < 10) {
      await page.keyboard.press('Tab');
      tabCount++;
    }
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.locator('button[aria-label="Open menu"]').or(page.locator('button:has-text("Menu")'));
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Menu should be open
      await page.waitForTimeout(300);
      
      // Close menu
      const closeButton = page.locator('button:has-text("Close")');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });
});
`;
  }

  private static async updatePackageJson(projectPath: string, framework: string): Promise<void> {
    const { readFile, writeFile } = await import('../utils/fs.js');
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    try {
      const content = await readFile(packageJsonPath);
      const pkg = JSON.parse(content);
      
      if (!pkg.scripts) pkg.scripts = {};
      
      switch (framework) {
        case 'playwright':
          pkg.scripts.test = 'playwright test';
          pkg.scripts['test:ui'] = 'playwright test --ui';
          pkg.scripts['test:e2e'] = 'playwright test e2e';
          pkg.scripts['test:coverage'] = 'playwright test --coverage';
          pkg.devDependencies = {
            ...pkg.devDependencies,
            '@playwright/test': '^1.40.0'
          };
          break;
        case 'cypress':
          pkg.scripts.test = 'cypress run';
          pkg.scripts['test:open'] = 'cypress open';
          pkg.scripts['test:e2e'] = 'cypress run --spec "cypress/e2e/**/*.cy.ts"';
          pkg.devDependencies = {
            ...pkg.devDependencies,
            'cypress': '^13.0.0'
          };
          break;
        case 'vitest':
          pkg.scripts.test = 'vitest';
          pkg.scripts['test:watch'] = 'vitest --watch';
          pkg.scripts['test:ui'] = 'vitest --ui';
          pkg.scripts['test:coverage'] = 'vitest --coverage';
          pkg.devDependencies = {
            ...pkg.devDependencies,
            'vitest': '^1.0.0',
            '@testing-library/react': '^14.0.0',
            '@testing-library/jest-dom': '^6.0.0',
            'jsdom': '^23.0.0'
          };
          break;
      }
      
      await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
    } catch (error) {
      console.warn('Could not update package.json:', error);
    }
  }
}

export const testingScaffold = TestingScaffold;
