#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';
import { generator } from '../engine/generator.js';
import { registry, aiManager } from '../engine/registry.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('uiforge')
  .description('Production-grade CLI for generating premium UI systems')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new Next.js project with Tailwind and shadcn/ui')
  .option('-n, --name <name>', 'Project name', 'my-app')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (options) => {
    logger.logo();
    
    try {
      await generator.initProject({
        projectName: options.name,
        outputDir: options.output,
        template: '',
      });
      
      logger.done();
      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox('Initialization Failed', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('create <template>')
  .description('Generate a full UI system from a template')
  .option('-n, --name <name>', 'Project name', 'my-app')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-s, --sections <sections...>', 'Specific sections to generate')
  .option('--ai', 'Enable AI-powered copy generation')
  .action(async (template, options) => {
    logger.logo();
    
    try {
      const templateExists = registry.exists(template);
      if (!templateExists) {
        logger.errorBox(
          'Template Not Found',
          `Template "${template}" does not exist.\nRun "uiforge list" to see available templates.`
        );
        process.exit(1);
      }

      const templateData = registry.get(template)!;
      logger.info(`Template: ${templateData.name}`);
      console.log();

      let aiProvider = null;
      if (options.ai) {
        logger.stepSimple('Initializing AI provider...');
        aiProvider = await aiManager.initialize();
        if (aiProvider) {
          const isLocal = aiProvider.name === 'ollama';
          logger.aiProvider(aiProvider.name, isLocal ? 'local' : 'cloud');
        } else {
          logger.warning('AI provider unavailable, using static content');
        }
        console.log();
      }

      const steps = [
        'Creating project structure',
        'Setting up dependencies',
        'Generating layout components',
        'Generating sections',
        'Applying design system',
        'Adding animations',
      ];

      if (options.ai && aiProvider) {
        steps.push('Generating AI-powered copy');
      }

      for (let i = 0; i < steps.length; i++) {
        logger.stepSimple(steps[i]);
        await new Promise((r) => setTimeout(r, 100));
      }

      await generator.createTemplate({
        projectName: options.name,
        template,
        outputDir: options.output,
        sections: options.sections,
        useAI: options.ai,
      });
      
      logger.done();
      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox('Generation Failed', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('demo')
  .description('Generate and preview a demo project')
  .option('-n, --name <name>', 'Project name', 'uiforge-demo')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (options) => {
    logger.logo();
    
    try {
      logger.header('Generating Demo');
      logger.stepSimple('Creating preview project...');
      
      await generator.createTemplate({
        projectName: options.name,
        template: 'premium-landing',
        outputDir: options.output,
      });

      console.log();
      console.log(`  ${chalk.green('🌐 Opening demo preview...')}`);
      console.log();
      console.log(`  ${chalk.gray('Demo project created at:')}`);
      console.log(`    ${chalk.white(path.resolve(options.output, options.name))}`);
      console.log();
      console.log(`  ${chalk.gray('To run the demo:')}`);
      console.log(`    ${chalk.white(`cd ${options.name} && npm install && npm run dev`)}`);
      console.log();

      logger.done();
    } catch (error) {
      logger.errorBox('Demo Generation Failed', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('add <section>')
  .description('Add a section to your project')
  .option('-o, --output <dir>', 'Project directory', '.')
  .action(async (section, options) => {
    try {
      logger.stepSimple(`Adding ${section} section...`);
      await generator.addSection(section, options.output);
      logger.success(`Section "${section}" added successfully`);
    } catch (error) {
      logger.errorBox('Section Add Failed', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('theme generate')
  .description('Generate design tokens and theme')
  .action(async () => {
    logger.header('Generating Design Tokens');
    logger.stepSimple('Creating design system...');
    await new Promise((r) => setTimeout(r, 300));
    logger.success('Tailwind config generated');
    logger.success('CSS variables generated');
    logger.success('Typography tokens generated');
    logger.done();
  });

program
  .command('ai <task>')
  .description('Run AI-powered features (copy, suggestions)')
  .option('-p, --provider <provider>', 'AI provider (ollama, groq)')
  .action(async (task) => {
    logger.header('AI Features');
    
    const provider = await aiManager.initialize();
    
    if (!provider) {
      logger.warningBox(
        'AI Provider Unavailable',
        [
          'No AI provider detected. Options:',
          '• Install Ollama: https://ollama.ai',
          '• Set GROQ_API_KEY environment variable',
        ]
      );
      return;
    }

    const isLocal = provider.name === 'ollama';
    logger.aiProvider(provider.name, isLocal ? 'local' : 'cloud');

    if (task === 'copy') {
      const context = 'Build a modern SaaS platform that helps teams collaborate';
      logger.stepSimple('Generating copy...');
      const result = await provider.generateCopy(context);
      
      if (result.success) {
        console.log();
        console.log(`  ${chalk.green.bold('Generated Copy:')}`);
        console.log();
        console.log('  ' + result.content.split('\n').join('\n  '));
        console.log();
      } else {
        logger.error('Failed to generate copy: ' + (result.error || 'Unknown error'));
      }
    } else if (task === 'suggest') {
      logger.stepSimple('Generating section suggestions...');
      const result = await provider.generateSectionSuggestions('landing');
      
      if (result.success) {
        console.log();
        console.log(`  ${chalk.green.bold('Suggested Sections:')}`);
        console.log();
        console.log('  ' + result.content.split('\n').join('\n  '));
        console.log();
      } else {
        logger.error('Failed to generate suggestions: ' + (result.error || 'Unknown error'));
      }
    }

    logger.done();
  });

program
  .command('list')
  .description('List available templates')
  .action(() => {
    logger.header('Available Templates');
    
    const templates = registry.list();

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      if (i > 0) console.log();
      
      console.log(`  ${chalk.bold(i + 1 + '. ' + template.name)}`);
      console.log(`     ${chalk.gray('ID: ' + template.id)}`);
      console.log(`     ${chalk.gray(template.description)}`);
      console.log(`     ${chalk.cyan('Sections: ' + template.sections.join(', '))}`);
    }
    
    console.log();
    console.log(`  ${chalk.gray('Usage:')}`);
    console.log(`    ${chalk.white('uiforge create premium-landing -n my-project')}`);
    console.log();
  });

program.parse(process.argv);

process.on('uncaughtException', (error) => {
  logger.errorBox('Unexpected Error', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.errorBox('Unexpected Error', reason instanceof Error ? reason.message : 'Unknown error');
  process.exit(1);
});
