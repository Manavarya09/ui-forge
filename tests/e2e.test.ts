import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

const TEST_DIR = path.join(process.cwd(), 'test-output');

describe('E2E Tests', () => {
  beforeAll(async () => {
    await fs.ensureDir(TEST_DIR);
  });

  afterAll(async () => {
    await fs.remove(TEST_DIR);
  });

  describe('CLI Commands', () => {
    it('should show help when running with no args', async () => {
      const { stdout } = await execAsync('npx tsx cli/index.ts --help');
      expect(stdout).toContain('uiforge');
      expect(stdout).toContain('Commands');
    });

    it('should list templates', async () => {
      const { stdout } = await execAsync('npx tsx cli/index.ts list');
      expect(stdout).toContain('Available Templates');
    });

    it('should list design styles', async () => {
      const { stdout } = await execAsync('npx tsx cli/index.ts styles');
      expect(stdout).toContain('Design Styles');
    });

    it('should create a project in dry-run mode', async () => {
      const projectName = 'dry-run-test';
      await execAsync(
        `npx tsx cli/index.ts create saas-modern ${projectName} --dry-run --output ${TEST_DIR}`,
        { cwd: process.cwd() }
      );
      
      const projectPath = path.join(TEST_DIR, projectName);
      const exists = await fs.pathExists(projectPath);
      expect(exists).toBe(false);
    }, 30000);
  });

  describe('Template Generation', () => {
    it('should generate project files', async () => {
      const projectName = 'gen-test';
      const projectPath = path.join(TEST_DIR, projectName);
      
      await fs.ensureDir(projectPath);
      await fs.writeFile(
        path.join(projectPath, 'package.json'),
        JSON.stringify({ name: projectName, scripts: {} })
      );
      
      const { stdout } = await execAsync(
        `npx tsx cli/index.ts init --output ${projectPath}`,
        { cwd: process.cwd() }
      );
      
      expect(stdout).toContain('initialized successfully');
      
      const configExists = await fs.pathExists(path.join(projectPath, '.uiforgerc.json'));
      expect(configExists).toBe(true);
    }, 30000);
  });

  describe('Configuration System', () => {
    it('should load project config', async () => {
      const projectName = 'config-test';
      const projectPath = path.join(TEST_DIR, projectName);
      
      await fs.ensureDir(projectPath);
      await fs.writeFile(
        path.join(projectPath, '.uiforgerc.json'),
        JSON.stringify({ version: '1.0.0', defaults: { template: 'saas-modern' } })
      );
      
      const { loadProjectConfig } = await import('../utils/config.js');
      const config = await loadProjectConfig(projectPath);
      
      expect(config).toBeDefined();
      expect(config?.defaults?.template).toBe('saas-modern');
    });
  });
});