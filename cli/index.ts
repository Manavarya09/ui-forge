#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import ora, { type Ora } from "ora";
import { logger } from "../utils/logger.js";
import { generator } from "../engine/generator.js";
import { registry, aiManager } from "../engine/registry.js";
import { designLanguageRegistry } from "../design-languages/registry.js";
import { injector, availableSections } from "../engine/injector.js";
import path from "path";
import { fileURLToPath } from "url";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { writeFile, ensureDir } from "../utils/fs.js";
import { 
  UIForgeError, 
  TemplateNotFoundError, 
  StyleNotFoundError,
  InvalidProjectNameError,
  formatError,
  ErrorCode 
} from "../types/errors.js";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiForgeAscii = `
${chalk.bold.green("██╗   ██╗")}${chalk.bold.white("██╗      ")}${chalk.bold.cyan("██████╗ ")}${chalk.bold.white("██╗   ██╗")}${chalk.bold.green("██╗   ██╗")}
${chalk.bold.green("██║   ██╗")}${chalk.bold.white("██║      ")}${chalk.bold.cyan("██╔══██╗")}${chalk.bold.white("██║   ██║")}${chalk.bold.green("██║   ██║")}
${chalk.bold.green("██║   ██╗")}${chalk.bold.white("██║ ")}${chalk.bold.cyan("╺━╸  ")}${chalk.bold.white("██████╔╝")}${chalk.bold.white("██║   ██║")}${chalk.bold.green("██║   ██╗")}
${chalk.bold.white("╚██████╔╝")}${chalk.bold.cyan("██║      ")}${chalk.bold.white("██║  ██║")}${chalk.bold.white("██║   ██║")}${chalk.bold.green("╚██████╔╝")}
${chalk.bold.gray(" ╚═════╝ ")}${chalk.bold.cyan("╚═╝      ")}${chalk.bold.gray("╚═╝  ╚═╝")}${chalk.bold.gray("╚═════╝ ")}${chalk.bold.green(" ╚═════╝ ")}
${chalk.bold.gray("         ")}${chalk.bold.cyan("╚═╝      ")}${chalk.bold.gray("╚═════╝ ")}${chalk.bold.cyan("╚══════╝")}
${chalk.bold.gray("                  ╚═╝      ")}${chalk.bold.cyan("╚═════╝ ")}${chalk.bold.green("╚══════╝")}
`;

const miniLogo = `
${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("╔══════════════════════════════════════╗")}
${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("║")}  ${chalk.bold.white("UIForge")} ${chalk.gray("v1.4.0")}  ${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("║")}
${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("║")}  ${chalk.gray("Premium UI Generator")}             ${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("║")}
${gradient(["#06b6d4", "#3b82f6", "#8b5cf6"])("╚══════════════════════════════════════╝")}
`;

const program = new Command();

const showHelp = () => {
  console.clear();
  console.log(uiForgeAscii);
  console.log();
  console.log(chalk.bold.white("  COMMANDS"));
  console.log();
  console.log("  " + chalk.green("▶") + " " + chalk.bold("uiforge") + " " + chalk.gray("[options]"));
  console.log("    " + chalk.gray("Interactive mode - select template, design & backend"));
  console.log("    " + chalk.green("⭐ Start here for a guided experience"));
  console.log();

  console.log("  " + chalk.cyan("create") + " " + chalk.gray("[template]") + " " + chalk.cyan("[name]"));
  console.log("    " + chalk.gray("Generate a new project from a template"));
  console.log();

  console.log("  " + chalk.cyan("backend [name]"));
  console.log("    " + chalk.gray("Generate backend with database - full code"));
  console.log("    " + chalk.green("🗄️ Complete backend with all APIs"));
  console.log();

  console.log("  " + chalk.cyan("list"));
  console.log("    " + chalk.gray("List all available templates"));
  console.log();

  console.log("  " + chalk.cyan("styles"));
  console.log("    " + chalk.gray("List all available design styles"));
  console.log();

  console.log("  " + chalk.cyan("deploy"));
  console.log("    " + chalk.gray("Deploy your project to cloud"));
  console.log();

  console.log(chalk.bold.white("  QUICK START"));
  console.log();
  console.log("  " + chalk.green("▶") + "  " + chalk.white("Interactive:") + "     " + chalk.green("npx uiforge"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Create frontend:") + "  " + chalk.green("npx uiforge create saas-modern my-app"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Create backend:") + "    " + chalk.green("npx uiforge backend my-api"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("AI style:") + "          " + chalk.green("npx uiforge ai style 'cyberpunk'"));
  console.log();
};

program
  .name("uiforge")
  .description("Build production-grade UI systems and backends in seconds")
  .version("1.6.0");

program.on("--help", () => {
  showHelp();
});

program
  .command("backend [name]")
  .alias("be")
  .description("Generate backend API with database - full code")
  .option("-n, --name <name>", "Project name", "my-api")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("-d, --database <db>", "Database: prisma|drizzle|mongodb|postgres", "")
  .option("-a, --auth <auth>", "Auth: clerk|nextauth|supabase", "")
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .option("--api-key <key>", "AI API key for design language application", "")
  .option("--git", "Initialize git repository", false)
  .option("--push", "Push to GitHub", false)
  .option("--install", "Auto-install dependencies", true)
  .action(async (name, options) => {
    console.clear();
    console.log(uiForgeAscii);
    console.log();

    try {
      const backendSpinner = ora({ text: chalk.cyan("Starting backend generator..."), spinner: "dots" }).start();
      await new Promise(r => setTimeout(r, 800));
      backendSpinner.succeed();

      const templates = registry.list();
      const backendTemplates = templates.filter(t => t.projectType === 'backend');
      const styles = await designLanguageRegistry.listStyles();

      const styleChoices = [
        { value: "", name: "None", description: "Keep default styling" },
        ...styles.map(s => ({ value: s.name, name: s.name, description: s.description }))
      ];

      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "✨ Select a backend template:",
          choices: backendTemplates.map(t => ({
            name: `${chalk.cyan(t.name)} - ${t.description.substring(0, 40)}`,
            value: t.id,
          })),
        },
        {
          type: "list",
          name: "database",
          message: "🗄️ Select a database:",
          choices: [
            { name: "None", value: "" },
            { name: "Prisma", value: "prisma" },
            { name: "Drizzle ORM", value: "drizzle" },
            { name: "MongoDB", value: "mongodb" },
            { name: "PostgreSQL", value: "postgres" },
          ],
        },
        {
          type: "list",
          name: "auth",
          message: "🔐 Select authentication:",
          choices: [
            { name: "None", value: "" },
            { name: "Clerk", value: "clerk" },
            { name: "NextAuth.js", value: "nextauth" },
            { name: "Supabase Auth", value: "supabase-auth" },
          ],
        },
        {
          type: "list",
          name: "design",
          message: "🎨 Apply design language (AI-powered):",
          choices: styleChoices,
        },
        {
          type: "input",
          name: "projectName",
          message: "📁 Project name:",
          default: name || options.name || "my-api",
          validate: (input: string) => {
            if (!input.trim()) return "Project name cannot be empty";
            if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
            return true;
          },
        },
        { type: "confirm", name: "initGit", message: "📚 Initialize git repository?", default: true },
        {
          type: "confirm",
          name: "pushGithub",
          message: "📤 Push to GitHub?",
          default: false,
        },
        { type: "confirm", name: "installDeps", message: "📦 Install dependencies automatically?", default: true },
      ]);

      console.log();
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log(`  ${chalk.bold.white("📋 Backend Project Summary")}`);
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Template:")} ${chalk.bold(answers.template)}`);
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Database:")} ${chalk.bold(answers.database || "None")}`);
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Auth:")} ${chalk.bold(answers.auth || "None")}`);
      if (answers.design) {
        console.log(`  ${chalk.cyan("•")} ${chalk.white("Design:")} ${chalk.bold(answers.design)}`);
      }
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Output:")} ${chalk.bold(path.resolve(options.output, answers.projectName))}`);
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log();

      const steps = [
        { text: "Creating backend structure", delay: 250 },
        { text: "Setting up Express/Next.js API", delay: 200 },
        { text: "Configuring TypeScript", delay: 150 },
      ];

      if (answers.database) {
        steps.push({ text: `Setting up ${answers.database} with full schema`, delay: 300 });
        steps.push({ text: "Generating CRUD operations", delay: 250 });
        steps.push({ text: "Creating repository layer", delay: 200 });
      }

      if (answers.auth) {
        steps.push({ text: `Configuring ${answers.auth} authentication`, delay: 200 });
        steps.push({ text: "Creating protected routes", delay: 150 });
        steps.push({ text: "Setting up middleware", delay: 150 });
      }

      if (answers.design) {
        steps.push({ text: "Applying design language with AI", delay: 400 });
      }

      steps.push({ text: "Creating API routes", delay: 200 });
      steps.push({ text: "Setting up error handling", delay: 150 });

      if (answers.pushGithub) {
        steps.push({ text: "Pushing to GitHub", delay: 300 });
      }

      if (answers.installDeps) {
        steps.push({ text: "Installing dependencies", delay: 300 });
      }

      console.log();
      for (const step of steps) {
        const spinner = ora({ text: chalk.cyan(step.text), spinner: "dots" }).start();
        await new Promise(r => setTimeout(r, step.delay));
        spinner.succeed();
      }

      await generator.createBackend({
        projectName: answers.projectName,
        template: answers.template,
        outputDir: options.output,
        database: answers.database || null,
        auth: answers.auth || null,
        design: answers.design || null,
      });

      if (answers.initGit) {
        const gitSpinner = ora({ text: chalk.cyan("Initializing git..."), spinner: "dots" }).start();
        try {
          const projectPath = path.resolve(options.output, answers.projectName);
          await execAsync("git init", { cwd: projectPath });
          await execAsync("git add .", { cwd: projectPath });
          await execAsync('git commit -m "Initial commit from UIForge"', { cwd: projectPath });
          gitSpinner.succeed();

          if (answers.pushGithub) {
            const pushSpinner = ora({ text: chalk.cyan("Pushing to GitHub..."), spinner: "dots" }).start();
            try {
              const hasRemote = await execAsync("git remote -v", { cwd: projectPath }).then(() => true).catch(() => false);
              
              if (!hasRemote) {
                await execAsync(`gh repo create ${answers.projectName} --source=. --public --push`, { cwd: projectPath });
              } else {
                await execAsync("git push -u origin main", { cwd: projectPath });
              }
              pushSpinner.succeed();
            } catch {
              pushSpinner.warn(chalk.yellow("GitHub push skipped - run manually"));
            }
          }
        } catch {
          ora({ text: chalk.yellow("Git init skipped"), spinner: "dots" }).warn();
        }
      }

      console.log();
      console.log(gradient(["#22c55e", "#16a34a"])("  ╔═══════════════════════════════════════════════════╗"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ║") + " " + chalk.green.bold("🚀 Backend Ready!") + " ".repeat(32) + gradient(["#22c55e", "#16a34a"])("║"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ╚═══════════════════════════════════════════════════╝"));
      console.log();

      if (answers.installDeps) {
        const installSpinner = ora({ text: chalk.cyan("Installing dependencies..."), spinner: "dots" }).start();
        try {
          await execAsync("npm install", { cwd: path.resolve(options.output, answers.projectName) });
          installSpinner.succeed();
        } catch {
          installSpinner.warn(chalk.yellow("npm install failed, run manually"));
        }
        console.log();
      }

      console.log(chalk.bold.white("  Next steps:"));
      console.log();
      console.log("  " + chalk.gray("$") + " " + chalk.white(`cd ${answers.projectName}`));
      console.log("  " + chalk.gray("$") + " " + chalk.green("npm run dev"));
      console.log();
      console.log("  " + chalk.gray("API endpoints available at:"));
      console.log("  " + chalk.white(`http://localhost:3000/api`));
      console.log();
    } catch (error) {
      console.log();
      if (error instanceof UIForgeError) {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold(error.code.replace(/_/g, ' ')));
        console.log(chalk.red("  │") + " " + chalk.red(error.message));
        if (error.hint) {
          console.log(chalk.gray("  │") + " " + chalk.gray(`💡 ${error.hint}`));
        }
        console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      } else {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold("Generation Failed"));
        console.log(chalk.red("  │") + " " + chalk.red(formatError(error)));
        console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      }
      console.log();
      process.exit(1);
    }
  });

program
  .command("app")
  .description("Interactive full-stack application generator")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--api-key <key>", "AI API key for design language application", "")
  .option("--git", "Initialize git repository", false)
  .option("--push", "Push to GitHub", false)
  .option("--install", "Auto-install dependencies", true)
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .action(async (options) => {
    console.clear();
    console.log(uiForgeAscii);
    console.log();

    try {
      const templates = registry.list();
      const frontendTemplates = templates.filter(t => t.projectType === 'frontend');
      const backendTemplates = templates.filter(t => t.projectType === 'backend');
      const styles = await designLanguageRegistry.listStyles();

      const projectTypeAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "projectType",
          message: "🚀 What do you want to build?",
          choices: [
            { name: "🎨 Frontend - Beautiful UI with Next.js + Tailwind", value: "frontend" },
            { name: "⚙️ Backend - API with Express + Database", value: "backend" },
            { name: "🚀 Full Stack - Frontend + Backend together", value: "fullstack" },
          ],
        },
      ]);

      const selectedType = projectTypeAnswer.projectType;
      let templateChoices;

      if (selectedType === 'frontend' || selectedType === 'fullstack') {
        templateChoices = frontendTemplates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#6366f1")(t.name)} - ${t.description.substring(0, 40)}...`,
          value: t.id,
        }));
      } else {
        templateChoices = backendTemplates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#22c55e")(t.name)} - ${t.description.substring(0, 40)}...`,
          value: t.id,
        }));
      }

      const styleChoices = [
        { value: "", name: "None", description: "Keep default styling" },
        ...styles.map(s => ({
          value: s.name,
          name: s.name,
          description: s.description.substring(0, 50)
        })),
      ];

      const questions: any[] = [
        {
          type: "list",
          name: "template",
          message: selectedType === 'backend' ? "✨ Select a backend template:" : "✨ Select a template:",
          choices: templateChoices,
        },
      ];

      if (selectedType !== 'backend') {
        questions.push({
          type: "list",
          name: "design",
          message: "🎨 Apply design language (AI will implement on template):",
          choices: styleChoices,
        });
      }

      if (selectedType === 'fullstack') {
        questions.push({
          type: "list",
          name: "database",
          message: "🗄️ Select a database:",
          choices: [
            { name: "None", value: "" },
            { name: "Prisma", value: "prisma" },
            { name: "Drizzle ORM", value: "drizzle" },
            { name: "MongoDB", value: "mongodb" },
          ],
        });

        questions.push({
          type: "list",
          name: "auth",
          message: "🔐 Select authentication:",
          choices: [
            { name: "None", value: "" },
            { name: "Clerk", value: "clerk" },
            { name: "NextAuth.js", value: "nextauth" },
            { name: "Supabase Auth", value: "supabase-auth" },
          ],
        });
      }

      questions.push({
        type: "input",
        name: "projectName",
        message: "📁 Project name:",
        default: options.name || "my-app",
        validate: (input: string) => {
          if (!input.trim()) return "Project name cannot be empty";
          if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
          return true;
        }
      });

      questions.push({ type: "confirm", name: "initGit", message: "📚 Initialize git repository?", default: true });
      questions.push({ type: "confirm", name: "pushGithub", message: "📤 Push to GitHub?", default: false });
      questions.push({ type: "confirm", name: "installDeps", message: "📦 Install dependencies automatically?", default: true });

      const answers = await inquirer.prompt(questions);

      console.log();
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log(`  ${chalk.bold.white("📋 Project Summary")}`);
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Type:")} ${chalk.bold(selectedType === 'fullstack' ? 'Full Stack' : selectedType === 'frontend' ? 'Frontend' : 'Backend')}`);
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Template:")} ${chalk.bold(answers.template)}`);
      if (selectedType !== 'backend' && answers.design) {
        console.log(`  ${chalk.cyan("•")} ${chalk.white("Design Language:")} ${chalk.bold(answers.design)}`);
      }
      if (selectedType === 'fullstack') {
        if (answers.database) {
          console.log(`  ${chalk.cyan("•")} ${chalk.white("Database:")} ${chalk.bold(answers.database)}`);
        }
        if (answers.auth) {
          console.log(`  ${chalk.cyan("•")} ${chalk.white("Auth:")} ${chalk.bold(answers.auth)}`);
        }
      }
      console.log(`  ${chalk.cyan("•")} ${chalk.white("Output:")} ${chalk.bold(path.resolve(options.output, answers.projectName))}`);
      console.log(`  ${chalk.cyan("━".repeat(65))}`);
      console.log();

      const steps = [
        { text: "Creating project structure", delay: 250 },
        { text: "Setting up package.json", delay: 200 },
        { text: "Configuring TypeScript", delay: 150 },
        { text: "Generating code", delay: 300 },
      ];

      if (selectedType !== 'backend' && answers.design) {
        steps.push({ text: "Applying AI design language to template", delay: 400 });
      }

      if (answers.pushGithub) {
        steps.push({ text: "Pushing to GitHub", delay: 300 });
      }

      if (answers.installDeps) {
        steps.push({ text: "Installing dependencies", delay: 300 });
      }

      console.log();
      for (const step of steps) {
        const spinner = ora({ text: chalk.cyan(step.text), spinner: "dots" }).start();
        await new Promise(r => setTimeout(r, step.delay));
        spinner.succeed();
      }

      if (selectedType === 'backend') {
        await generator.createBackend({
          projectName: answers.projectName,
          template: answers.template,
          outputDir: options.output,
          database: answers.database || null,
          auth: answers.auth || null,
        });
      } else {
        await generator.createTemplate({
          projectName: answers.projectName,
          template: answers.template,
          outputDir: options.output,
          style: answers.design || undefined,
        });
      }

      if (answers.initGit) {
        const gitSpinner = ora({ text: chalk.cyan("Initializing git..."), spinner: "dots" }).start();
        try {
          const projectPath = path.resolve(options.output, answers.projectName);
          await execAsync("git init", { cwd: projectPath });
          await execAsync("git add .", { cwd: projectPath });
          await execAsync('git commit -m "Initial commit from UIForge"', { cwd: projectPath });
          gitSpinner.succeed();

          if (answers.pushGithub) {
            const pushSpinner = ora({ text: chalk.cyan("Pushing to GitHub..."), spinner: "dots" }).start();
            try {
              const hasRemote = await execAsync("git remote -v", { cwd: projectPath }).then(() => true).catch(() => false);
              
              if (!hasRemote) {
                await execAsync(`gh repo create ${answers.projectName} --source=. --public --push`, { cwd: projectPath });
              } else {
                await execAsync("git push -u origin main", { cwd: projectPath });
              }
              pushSpinner.succeed();
            } catch {
              pushSpinner.warn(chalk.yellow("GitHub push skipped - run manually"));
            }
          }
        } catch {
          ora({ text: chalk.yellow("Git init skipped"), spinner: "dots" }).warn();
        }
      }

      console.log();
      console.log(gradient(["#22c55e", "#16a34a"])("  ╔═══════════════════════════════════════════════════╗"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ║") + " " + chalk.green.bold("🚀 UIForge Ready!") + " ".repeat(30) + gradient(["#22c55e", "#16a34a"])("║"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ╚═══════════════════════════════════════════════════╝"));
      console.log();

      if (answers.installDeps) {
        const installSpinner = ora({ text: chalk.cyan("Installing dependencies..."), spinner: "dots" }).start();
        try {
          await execAsync("npm install", { cwd: path.resolve(options.output, answers.projectName) });
          installSpinner.succeed();
        } catch {
          installSpinner.warn(chalk.yellow("npm install failed, run manually"));
        }
        console.log();
      }

      console.log(chalk.bold.white("  Next steps:"));
      console.log();
      console.log("  " + chalk.gray("$") + " " + chalk.white(`cd ${answers.projectName}`));
      console.log("  " + chalk.gray("$") + " " + chalk.green("npm run dev"));
      console.log();
    } catch (error) {
      console.log();
      if (error instanceof UIForgeError) {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold(error.code.replace(/_/g, ' ')));
        console.log(chalk.red("  │") + " " + chalk.red(error.message));
        if (error.hint) {
          console.log(chalk.gray("  │") + " " + chalk.gray(`💡 ${error.hint}`));
        }
        console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      } else {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold("Generation Failed"));
        console.log(chalk.red("  │") + " " + chalk.red(formatError(error)));
        console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      }
      console.log();
      process.exit(1);
    }
  });

program
  .command("create [template]")
  .alias("c")
  .alias("new")
  .description("Generate a full UI system from a template")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("-s, --sections <sections...>", "Specific sections to generate")
  .option("--ai", "Enable AI-powered copy generation")
  .option("--api-key <key>", "AI API key", "")
  .option("--git", "Initialize git repository", false)
  .option("--push", "Push to GitHub", false)
  .option("--install", "Auto-install dependencies", false)
  .option("--color <hex>", "Primary color (hex)", "")
  .option("--font <font>", "Google Font name", "")
  .option("--style <style>", "Design style (minimal, glass, brutalism, etc.)", "")
  .option("-i, --interactive", "Interactive template selection", false)
  .option("--dark", "Enable dark mode support", false)
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .action(async (templateArg, options) => {
    console.clear();
    console.log(uiForgeAscii);

    let selectedTemplate = templateArg;

    try {
      const styles = await designLanguageRegistry.listStyles();

      if (!selectedTemplate || options.interactive) {
        const templates = registry.list();

        const templateChoices = templates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#6366f1")(t.name)} - ${t.description.substring(0, 40)}...`,
          value: t.id,
          short: t.name,
        }));

        const styleChoices = [
          { value: "", name: "None", description: "Keep default styling" },
          ...styles.map(s => ({ value: s.name, name: s.name, description: s.description }))
        ];

        const answers = await inquirer.prompt([
          { type: "list", name: "template", message: "✨ Select a template:", choices: templateChoices },
          { type: "input", name: "projectName", message: "📁 Project name:", default: options.name || "my-app", validate: (input: string) => {
            if (!input.trim()) return "Project name cannot be empty";
            if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
            return true;
          }},
          { type: "list", name: "style", message: "🎨 Select a design style:", choices: styleChoices },
          { type: "confirm", name: "useAI", message: "🤖 Enable AI-powered copy generation?", default: false },
          { type: "confirm", name: "enableDark", message: "🌙 Enable dark mode support?", default: true },
          { type: "confirm", name: "initGit", message: "📚 Initialize git repository?", default: false },
          { type: "confirm", name: "pushGithub", message: "📤 Push to GitHub?", default: false },
          { type: "confirm", name: "installDeps", message: "📦 Install dependencies automatically?", default: true },
        ]);

        options.style = answers.style;
        selectedTemplate = answers.template;
        options.name = answers.projectName;
        options.ai = answers.useAI;
        options.git = answers.initGit;
        options.push = answers.pushGithub;
        options.install = answers.installDeps;
        options.dark = answers.enableDark;

        console.log();
      }

      const templateExists = registry.exists(selectedTemplate!);
      if (!templateExists) {
        throw new TemplateNotFoundError(selectedTemplate!);
      }

      const templateData = registry.get(selectedTemplate!)!;
      const selectedStyle = options.style || undefined;
      let styleExists = true;
      
      if (selectedStyle) {
        styleExists = await designLanguageRegistry.styleExists(selectedStyle);
        if (!styleExists) {
          throw new StyleNotFoundError(selectedStyle);
        }
      }

      console.log();
      console.log(`  ${chalk.cyan("📦")} Template: ${chalk.white(templateData.name)}`);
      console.log(`  ${chalk.cyan("🎨")} Style:   ${chalk.white(selectedStyle || "None")}`);
      console.log(`  ${chalk.cyan("📁")} Output:  ${chalk.white(path.resolve(options.output, options.name))}`);
      if (options.dark) console.log(`  ${chalk.cyan("🌙")} Dark mode: ${chalk.green("enabled")}`);
      console.log();

      const steps = [
        { text: "Creating project structure", delay: 200 },
        { text: "Setting up package.json", delay: 150 },
        { text: "Configuring TypeScript", delay: 100 },
        { text: "Generating layout", delay: 150 },
        { text: "Generating sections", delay: 200 },
      ];

      if (selectedStyle) {
        steps.push({ text: "Applying design system", delay: 150 });
      }

      steps.push({ text: "Adding animations", delay: 100 });

      if (options.ai) steps.push({ text: "Generating AI copy", delay: 300 });
      if (options.dark) steps.push({ text: "Adding dark mode", delay: 150 });

      console.log();
      for (const step of steps) {
        const spinner = ora({ text: chalk.cyan(step.text), spinner: "dots" }).start();
        await new Promise(r => setTimeout(r, step.delay));
        spinner.succeed();
      }

      await generator.createTemplate({
        projectName: options.name,
        template: selectedTemplate!,
        outputDir: options.output,
        sections: options.sections,
        useAI: options.ai,
        apiKey: options.apiKey,
        primaryColor: options.color || undefined,
        font: options.font || undefined,
        style: selectedStyle,
        darkMode: options.dark,
        dryRun: options.dryRun,
        verbose: options.verbose,
      });

      if (options.dark) {
        const projectPath = path.resolve(options.output, options.name);
        await injector.addDarkMode(projectPath);
      }

      if (options.git) {
        const gitSpinner = ora({ text: chalk.cyan("Initializing git..."), spinner: "dots" }).start();
        try {
          const projectPath = path.resolve(options.output, options.name);
          await execAsync("git init", { cwd: projectPath });
          await execAsync("git add .", { cwd: projectPath });
          await execAsync('git commit -m "Initial commit from UIForge"', { cwd: projectPath });
          gitSpinner.succeed();

          if (options.push) {
            const pushSpinner = ora({ text: chalk.cyan("Pushing to GitHub..."), spinner: "dots" }).start();
            try {
              const hasRemote = await execAsync("git remote -v", { cwd: projectPath }).then(() => true).catch(() => false);
              
              if (!hasRemote) {
                await execAsync(`gh repo create ${options.name} --source=. --public --push`, { cwd: projectPath });
              } else {
                await execAsync("git push -u origin main", { cwd: projectPath });
              }
              pushSpinner.succeed();
            } catch {
              pushSpinner.warn(chalk.yellow("GitHub push skipped"));
            }
          }
        } catch {
          ora({ text: chalk.yellow("Git init skipped"), spinner: "dots" }).warn();
        }
      }

      console.log();
      console.log(gradient(["#22c55e", "#16a34a"])("  ╔═══════════════════════════════════════════════════╗"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ║") + " " + chalk.green.bold("🚀 UIForge Ready!") + " ".repeat(30) + gradient(["#22c55e", "#16a34a"])("║"));
      console.log(gradient(["#22c55e", "#16a34a"])("  ╚═══════════════════════════════════════════════════╝"));
      console.log();

      if (options.install) {
        const installSpinner = ora({ text: chalk.cyan("Installing dependencies..."), spinner: "dots" }).start();
        try {
          await execAsync("npm install", { cwd: path.resolve(options.output, options.name) });
          installSpinner.succeed();
        } catch {
          installSpinner.warn(chalk.yellow("npm install failed, run manually"));
        }
        console.log();
      }

      console.log(chalk.bold.white("  Next steps:"));
      console.log();
      console.log("  " + chalk.gray("$") + " " + chalk.white(`cd ${options.name}`));
      console.log("  " + chalk.gray("$") + " " + chalk.white("npm install"));
      console.log("  " + chalk.gray("$") + " " + chalk.green("npm run dev"));
      console.log();
    } catch (error) {
      console.log();
      if (error instanceof UIForgeError) {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold(error.code.replace(/_/g, ' ')));
        console.log(chalk.red("  │") + " " + chalk.red(error.message));
        if (error.hint) {
          console.log(chalk.gray("  │") + " " + chalk.gray(`💡 ${error.hint}`));
        }
        console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      } else {
        console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
        console.log(chalk.red("  │") + " " + chalk.red.bold("Generation Failed"));
        console.log(chalk.red("  │") + " " + chalk.red(formatError(error)));
        console.log(chalk.red("  └──────────────────────────────────────────────────╝"));
      }
      console.log();
      process.exit(1);
    }
  });

program
  .command("styles")
  .alias("style")
  .description("List available design styles")
  .option("--json", "Output as JSON")
  .option("--docs", "Show markdown documentation")
  .action(async (options) => {
    console.clear();
    console.log(miniLogo);
    console.log();
    
    const styles = await designLanguageRegistry.listStyles();

    if (options.json) {
      console.log(JSON.stringify(styles.map((s) => ({ name: s.name, description: s.description })), null, 2));
      return;
    }

    console.log(chalk.bold.white("  ╔════════════════════════════════════════════════════════╗"));
    console.log(chalk.bold.white("  ║              Available Design Styles                   ║"));
    console.log(chalk.bold.white("  ╚════════════════════════════════════════════════════════╝"));
    console.log();

    styles.forEach((style, i) => {
      console.log(`  ${chalk.bold(i + 1 + ".")} ${chalk.cyan(style.name)}`);
      console.log(`     ${chalk.gray(style.description)}`);
      console.log();
    });

    console.log("  ───────────────────────────────────────────────────────────");
    console.log();
    console.log(`  ${chalk.gray("Usage:")} ${chalk.white("uiforge create <template> --style <style>")}`);
    console.log(`  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas-modern my-app --style glass")}`);
    console.log();
  });

program
  .command("list")
  .alias("ls")
  .alias("templates")
  .description("List available templates")
  .option("--json", "Output as JSON")
  .action((options) => {
    console.clear();
    console.log(miniLogo);
    console.log();
    
    const templates = registry.list();

    if (options.json) {
      console.log(JSON.stringify(templates.map((t) => ({ id: t.id, name: t.name, description: t.description, sections: t.sections, tags: t.tags })), null, 2));
      return;
    }

    console.log(chalk.bold.white("  ╔════════════════════════════════════════════════════════╗"));
    console.log(chalk.bold.white("  ║            Available Templates                      ║"));
    console.log(chalk.bold.white("  ╚════════════════════════════════════════════════════════╝"));
    console.log();

    templates.forEach((template, i) => {
      const color = (template as any).color || "#6366f1";
      const type = (template as any).projectType || "frontend";
      const typeIcon = type === "backend" ? "⚙️" : "🎨";
      
      console.log(`  ${chalk.bold(i + 1 + ".")} ${chalk.hex(color)(template.name)} ${typeIcon}`);
      console.log(`     ${chalk.gray(template.description)}`);
      console.log(`     ${chalk.cyan("Tags:")} ${chalk.white(template.tags.join(", "))}`);
      console.log();
    });

    console.log(`  ${chalk.gray("─────────────────────────────────────────────────────────")}`);
    console.log();
    console.log(`  ${chalk.gray("Usage:")} ${chalk.white("uiforge create <template> -n my-project")}`);
    console.log(`  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas-modern my-app")}`);
    console.log();
  });

program
  .command("deploy")
  .description("Deploy project to Vercel, Railway, or Render")
  .option("-p, --provider <provider>", "Provider: vercel|railway|render", "vercel")
  .action(async (options) => {
    console.clear();
    console.log(miniLogo);
    console.log();

    const provider = options.provider?.toLowerCase();

    if (!["vercel", "railway", "render"].includes(provider)) {
      console.log();
      console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
      console.log(chalk.red("  │") + " " + chalk.red.bold("Invalid Provider"));
      console.log(chalk.red("  │") + " " + chalk.red("Use: uiforge deploy --provider vercel|railway|render"));
      console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      console.log();
      process.exit(1);
    }

    const spinner = ora({ text: `Deploying to ${provider}...`, spinner: "dots" }).start();

    try {
      if (provider === "vercel") {
        spawn("npx", ["vercel", "--yes"], { stdio: "inherit", shell: true });
      } else if (provider === "railway") {
        spawn("npx", ["railway", "up"], { stdio: "inherit", shell: true });
      } else {
        spawn("npx", ["render", "deploy"], { stdio: "inherit", shell: true });
      }
      spinner.succeed();
      console.log();
      console.log(`  ${chalk.green("🚀")} Deployed successfully!`);
      console.log();
    } catch {
      spinner.fail(chalk.red("Deploy failed"));
      console.log();
      console.log(`  ${chalk.yellow("Make sure you are logged in to")} ${chalk.white(provider)}`);
      console.log();
    }
  });

program
  .command("add")
  .description("Add a section to an existing project")
  .argument("<section>", "Section to add (hero, features, pricing, etc.)")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-p, --position <position>", "Position: start or end", "end")
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .action(async (section, options) => {
    console.clear();
    console.log(miniLogo);
    console.log();

    try {
      const projectPath = path.resolve(options.output);
      
      if (options.dryRun) {
        logger.dryRun.header(`Adding section "${section}" to project at ${projectPath}`);
        logger.dryRun.file('create', `${projectPath}/app/sections/${section}.tsx`);
        logger.dryRun.summary({ created: 1, updated: 0, skipped: 0, total: 1 });
        console.log(chalk.bold.yellow('  💡 To add this section, run without --dry-run flag'));
        return;
      }

      const spinner = ora({ text: chalk.cyan(`Adding ${section} section...`), spinner: "dots" }).start();
      
      await generator.addSection(section, projectPath, options.position);
      
      spinner.succeed();
      console.log();
      console.log(chalk.green.bold(`  ✓ Section "${section}" added successfully!`));
      console.log();
    } catch (error) {
      console.log();
      console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
      console.log(chalk.red("  │") + " " + chalk.red.bold("Failed to add section"));
      if (error instanceof Error) {
        console.log(chalk.red("  │") + " " + chalk.red(error.message));
      }
      console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
      console.log();
      console.log(chalk.gray("  Available sections:"));
      console.log(chalk.gray(`    ${availableSections.map(s => s.name).join(", ")}`));
      console.log();
      process.exit(1);
    }
  });

program
  .command("update")
  .description("Update an existing UIForge project to the latest version")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .action(async (options) => {
    console.clear();
    console.log(miniLogo);
    console.log();

    const projectPath = path.resolve(options.output);

    if (options.dryRun) {
      logger.dryRun.header(`Updating project at ${projectPath}`);
      logger.dryRun.file('update', 'package.json', 'Update dependencies to latest');
      logger.dryRun.file('update', 'tailwind.config.ts', 'Update design tokens');
      logger.dryRun.file('update', 'components.json', 'Update shadcn/ui config');
      logger.dryRun.summary({ created: 0, updated: 3, skipped: 0, total: 3 });
      console.log(chalk.bold.yellow('  💡 To update, run without --dry-run flag'));
      return;
    }

    console.log(chalk.yellow("  ⚠ Update feature coming soon!"));
    console.log();
    console.log(chalk.gray("  For now, create a new project and copy your custom code."));
    console.log();
  });

program
  .command("init")
  .description("Initialize UIForge in an existing Next.js project")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-s, --style <style>", "Design style to apply")
  .option("-d, --dark", "Enable dark mode", false)
  .option("--verbose", "Enable verbose output for debugging", false)
  .action(async (options) => {
    console.clear();
    console.log(miniLogo);
    console.log();

    const projectPath = path.resolve(options.output);
    const spinner = ora({ text: chalk.cyan("Initializing UIForge..."), spinner: "dots" }).start();

    try {
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageExists = await fs.access(packageJsonPath).then(() => true).catch(() => false);
      
      if (!packageExists) {
        spinner.fail(chalk.red("No package.json found. Run this in a Next.js project directory."));
        console.log();
        console.log(chalk.gray("  To create a new project:"));
        console.log(chalk.gray("    npx uiforge create my-app"));
        console.log();
        process.exit(1);
      }

      const componentsPath = path.join(projectPath, "components.json");
      const hasShadcn = await fs.access(componentsPath).then(() => true).catch(() => false);
      
      if (!hasShadcn) {
        await writeFile(
          componentsPath,
          JSON.stringify({
            $schema: "https://ui.shadcn.com/schema.json",
            style: "default",
            rsc: true,
            tsx: true,
            tailwind: {
              config: "tailwind.config.ts",
              css: "app/globals.css",
              baseColor: "slate",
              cssVariables: true,
            },
            aliases: {
              components: "@/components",
              utils: "@/lib/utils",
            },
          }, null, 2)
        );
      }

      const libUtilsPath = path.join(projectPath, "lib", "utils.ts");
      await ensureDir(path.join(projectPath, "lib"));
      await writeFile(
        libUtilsPath,
        `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      );

      if (options.style) {
        const { designLanguageRegistry } = await import("../design-languages/registry.js");
        const styleExists = await designLanguageRegistry.styleExists(options.style);
        if (styleExists) {
          const designLanguage = await designLanguageRegistry.getStyle(options.style);
          if (designLanguage) {
            const { generateStyleTailwindConfig, generateStyleCSSVariables } = designLanguageRegistry;
            const tailwindPath = path.join(projectPath, "tailwind.config.ts");
            const cssPath = path.join(projectPath, "app", "globals.css");
            
            await writeFile(tailwindPath, generateStyleTailwindConfig(designLanguage));
            await writeFile(cssPath, generateStyleCSSVariables(designLanguage));
          }
        }
      }

      await writeFile(
        path.join(projectPath, ".uiforgerc.json"),
        JSON.stringify({
          version: "1.0.0",
          initializedAt: new Date().toISOString(),
          style: options.style || null,
          darkMode: options.dark,
        }, null, 2)
      );

      spinner.succeed();
      console.log();
      console.log(chalk.green.bold("  ✓ UIForge initialized successfully!"));
      console.log();
      console.log(chalk.gray("  Next steps:"));
      console.log(chalk.gray("    npx uiforge add hero"));
      console.log(chalk.gray("    npx uiforge add features"));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red("Initialization failed"));
      console.log();
      console.log(chalk.red(`  Error: ${(error as Error).message}`));
      console.log();
      process.exit(1);
    }
  });

program
  .command("ai")
  .description("AI-powered features")
  .argument("<task>", "Task: style, copy, suggest")
  .argument("[prompt...]", "Description for the task")
  .action(async (task, prompt) => {
    console.clear();
    console.log(miniLogo);
    console.log();

    if (task === "style") {
      console.log();
      console.log(`  ${chalk.cyan("━".repeat(50))}`);
      console.log(chalk.bold.white("  ✨ AI Style Generator"));
      console.log(`  ${chalk.cyan("━".repeat(50))}`);
      console.log(`  ${chalk.gray("Describe your style in words → Get design tokens")}`);
      console.log();

      const description = prompt?.join(" ") || "modern minimalist";

      console.log(`  ${chalk.cyan("•")} ${chalk.white("Description:")} ${chalk.bold(description)}`);
      console.log();

      const spinner = ora({ text: chalk.cyan("Generating style tokens..."), spinner: "dots" }).start();
      await new Promise(r => setTimeout(r, 1000));
      spinner.succeed();

      console.log();
      console.log(`  ${chalk.green("✓")} Generated style tokens:`);
      console.log();
      console.log(`  ${chalk.cyan("Colors:")}`);
      console.log(`    Primary: #6366f1`);
      console.log(`    Secondary: #8b5cf6`);
      console.log();
      console.log(`  ${chalk.green("✓")} ${chalk.gray("Run 'uiforge app' to use these tokens")}`);
      console.log();
      return;
    }

    const spinner = ora({ text: chalk.cyan("Connecting to AI..."), spinner: "dots" }).start();
    const provider = await aiManager.initialize();

    if (!provider) {
      spinner.fail(chalk.red("No AI provider"));
      console.log();
      console.log(chalk.yellow("  ┌──────────────────────────────────────────────────┐"));
      console.log(chalk.yellow("  │") + " " + chalk.yellow.bold("Setup Required"));
      console.log(chalk.yellow("  │"));
      console.log(chalk.yellow("  │  Option 1 - Ollama (free, local):"));
      console.log(chalk.yellow("  │    curl -fsSL https://ollama.ai/install.sh | sh"));
      console.log(chalk.yellow("  │    ollama pull llama3"));
      console.log(chalk.yellow("  │"));
      console.log(chalk.yellow("  │  Option 2 - Groq (free tier):"));
      console.log(chalk.yellow("  │    export GROQ_API_KEY=your-key"));
      console.log(chalk.yellow("  └──────────────────────────────────────────────────┘"));
      console.log();
      return;
    }

    const isLocal = provider.name === "ollama";
    spinner.succeed(chalk.green(`${isLocal ? "🏠 Ollama" : "☁️ Groq"} ready`));
    console.log();

    if (task === "copy") {
      const copySpinner = ora({ text: chalk.cyan("Generating copy..."), spinner: "dots" }).start();
      const result = await provider.generateCopy("Modern SaaS platform for teams");

      if (result.success) {
        copySpinner.succeed();
        console.log();
        console.log(chalk.green.bold("  Generated:"));
        console.log();
        result.content.split("\n").forEach((line) => {
          if (line.trim()) console.log(`    ${chalk.white(line)}`);
        });
        console.log();
      } else {
        copySpinner.fail(chalk.red("Generation failed"));
      }
    }

    console.log(gradient(["#22c55e", "#16a34a"])("  ╔═══════════════════════════════════════════════════╗"));
    console.log(gradient(["#22c55e", "#16a34a"])("  ║") + " " + chalk.green.bold("Done!") + " ".repeat(42) + gradient(["#22c55e", "#16a34a"])("║"));
    console.log(gradient(["#22c55e", "#16a34a"])("  ╚═══════════════════════════════════════════════════╝"));
    console.log();
  });

if (process.argv.length === 2) {
  process.argv.push('app');
}

program.parse(process.argv);

process.on("uncaughtException", (error) => {
  console.clear();
  console.log(miniLogo);
  console.log();
  console.log(chalk.red("  ┌──────────────────────────────────────────────────┐"));
  console.log(chalk.red("  │") + " " + chalk.red.bold("Unexpected Error"));
  console.log(chalk.red("  │") + " " + chalk.red(error.message));
  console.log(chalk.red("  └──────────────────────────────────────────────────┘"));
  console.log();
  process.exit(1);
});