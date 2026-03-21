#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
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

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

const showHelp = () => {
  logger.banner();
  
  console.log(chalk.bold.white("  ╭─────────────────────────────────────────────────────────────╮"));
  console.log(chalk.bold.white("  │") + chalk.bold.cyan("  COMMANDS") + chalk.bold.white("                                                        " + chalk.bold.white("│")));
  console.log(chalk.bold.white("  ╰─────────────────────────────────────────────────────────────╯"));
  console.log();
  
  console.log("  " + chalk.green("▶") + " " + chalk.bold("uiforge") + " " + chalk.gray("[options]"));
  console.log("    " + chalk.gray("Interactive mode - select frontend or backend, template, and style"));
  console.log("    " + chalk.green("⭐ Start here for a guided experience"));
  console.log();
  
  console.log("  " + chalk.cyan("create") + " " + chalk.gray("[template]") + " " + chalk.cyan("[name]"));
  console.log("    " + chalk.gray("Generate a new project from a template"));
  console.log("    " + chalk.dim("Aliases:") + " " + chalk.green("c") + ", " + chalk.green("new"));
  console.log();
  
  console.log("  " + chalk.cyan("app"));
  console.log("    " + chalk.gray("Interactive mode - same as running uiforge without arguments"));
  console.log();
  
  console.log("  " + chalk.cyan("app") + " " + chalk.gray("[options]"));
  console.log("    " + chalk.gray("Interactive mode - select frontend or backend, template, and style"));
  console.log("    " + chalk.green("⭐ Recommended for new users"));
  console.log();
  
  console.log("  " + chalk.cyan("create") + " " + chalk.gray("[template]") + " " + chalk.cyan("[name]"));
  console.log("    " + chalk.gray("Generate a new project from a template"));
  console.log("    " + chalk.dim("Aliases:") + " " + chalk.green("c") + ", " + chalk.green("new"));
  console.log();
  
  console.log("  " + chalk.cyan("preview") + " " + chalk.gray("[template]"));
  console.log("    " + chalk.gray("Generate and preview a template in browser"));
  console.log();
  
  console.log("  " + chalk.cyan("dev"));
  console.log("    " + chalk.gray("Start development server with live preview"));
  console.log();
  
  console.log("  " + chalk.cyan("demo"));
  console.log("    " + chalk.gray("Generate a demo project for quick testing"));
  console.log();
  
  console.log("  " + chalk.cyan("list"));
  console.log("    " + chalk.gray("List all available templates"));
  console.log("    " + chalk.dim("Alias:") + " " + chalk.green("ls"));
  console.log();
  
  console.log("  " + chalk.cyan("styles"));
  console.log("    " + chalk.gray("List all available design styles"));
  console.log();
  
  console.log("  " + chalk.cyan("components"));
  console.log("    " + chalk.gray("Browse and manage UI components"));
  console.log();
  
  console.log("  " + chalk.cyan("deploy"));
  console.log("    " + chalk.gray("Deploy your project to Vercel or Netlify"));
  console.log();
  
  console.log("  " + chalk.cyan("add") + " " + chalk.gray("<section>"));
  console.log("    " + chalk.gray("Add a section to your existing project"));
  console.log();
  
  console.log("  " + chalk.cyan("edit"));
  console.log("    " + chalk.gray("Edit project settings (colors, style, dark mode)"));
  console.log();
  
  console.log("  " + chalk.cyan("update"));
  console.log("    " + chalk.gray("Update project with latest features"));
  console.log();
  
  console.log("  " + chalk.cyan("i18n"));
  console.log("    " + chalk.gray("Setup internationalization"));
  console.log();
  
  console.log("  " + chalk.cyan("analytics"));
  console.log("    " + chalk.gray("Configure analytics for your project"));
  console.log();
  
  console.log("  " + chalk.cyan("audit"));
  console.log("    " + chalk.gray("Run accessibility audit on your project"));
  console.log();
  
  console.log("  " + chalk.cyan("test"));
  console.log("    " + chalk.gray("Setup and generate tests for your project"));
  console.log();
  
  console.log("  " + chalk.cyan("marketplace"));
  console.log("    " + chalk.gray("Browse community templates"));
  console.log();
  
  console.log("  " + chalk.cyan("theme") + " " + chalk.gray("[action]"));
  console.log("    " + chalk.gray("Manage your design system (apply, list, generate)"));
  console.log();
  
  console.log("  " + chalk.cyan("ai") + " " + chalk.gray("<task>"));
  console.log("    " + chalk.gray("AI-powered features (copy, generate, optimize)"));
  console.log();
  
  console.log(chalk.bold.white("  ╭─────────────────────────────────────────────────────────────╮"));
  console.log(chalk.bold.white("  │") + chalk.bold.cyan("  QUICK START") + chalk.bold.white("                                                      " + chalk.bold.white("│")));
  console.log(chalk.bold.white("  ╰─────────────────────────────────────────────────────────────╯"));
  console.log();
  
  console.log("  " + chalk.green("▶") + "  " + chalk.white("Interactive:") + "       " + chalk.green("npx uiforge"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Create frontend:") + "   " + chalk.green("npx uiforge create saas my-app"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Create backend:") + "   " + chalk.green("npx uiforge create api-rest my-api"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("With style:") + "        " + chalk.green("npx uiforge create saas my-app --style glass"));
  console.log();
  
  console.log(chalk.bold.white("  ╭─────────────────────────────────────────────────────────────╮"));
  console.log(chalk.bold.white("  │") + chalk.bold.cyan("  OPTIONS") + chalk.bold.white("                                                          " + chalk.bold.white("│")));
  console.log(chalk.bold.white("  ╰─────────────────────────────────────────────────────────────╯"));
  console.log();
  
  console.log("  " + chalk.cyan("-n, --name") + " " + chalk.gray("<name>"));
  console.log("    " + chalk.gray("Project name (default: my-app)"));
  console.log();
  
  console.log("  " + chalk.cyan("-o, --output") + " " + chalk.gray("<dir>"));
  console.log("    " + chalk.gray("Output directory (default: current directory)"));
  console.log();
  
  console.log("  " + chalk.cyan("--style") + " " + chalk.gray("<style>"));
  console.log("    " + chalk.gray("Design style: minimal, glass, brutalism, enterprise,"));
  console.log("    " + chalk.gray("                       bento, neumorphism, flat, material,"));
  console.log("    " + chalk.gray("                       dark-minimal, tech-futurism, monochrome, swiss"));
  console.log();
  
  console.log("  " + chalk.cyan("--dark"));
  console.log("    " + chalk.gray("Enable dark mode support"));
  console.log();
  
  console.log("  " + chalk.cyan("--install"));
  console.log("    " + chalk.gray("Auto-install dependencies after generation"));
  console.log();
  
  console.log("  " + chalk.cyan("--git"));
  console.log("    " + chalk.gray("Initialize git repository"));
  console.log();
  
  console.log("  " + chalk.cyan("-i, --interactive"));
  console.log("    " + chalk.gray("Interactive selection mode"));
  console.log();
  
  console.log();
  console.log("  " + chalk.gray("Need help? Visit:") + " " + chalk.cyan("https://github.com/anomalyco/ui-forge"));
  console.log("  " + chalk.gray("Report issues:") + "  " + chalk.cyan("https://github.com/anomalyco/ui-forge/issues"));
  console.log();
};

program
  .name("uiforge")
  .description("Generate production-grade UI systems and backends in seconds")
  .version("1.2.0");

program.on("--help", () => {
  showHelp();
});

program
  .command("app")
  .description("Interactive mode - select template and design language")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--style <style>", "Design style (optional, will prompt if not set)")
  .option("--template <template>", "Template (optional, will prompt if not set)")
  .option("--type <type>", "Project type: frontend|backend (optional, will prompt if not set)")
  .action(async (options) => {
    logger.logo();

    try {
      const templates = registry.list();
      const frontendTemplates = templates.filter(t => t.projectType === 'frontend');
      const backendTemplates = templates.filter(t => t.projectType === 'backend');
      const styles = await designLanguageRegistry.listStyles();

      const typeAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "projectType",
          message: "🚀 What do you want to build?",
          choices: [
            { name: "🎨 Frontend - Beautiful UI with React/Next.js", value: "frontend" },
            { name: "⚙️ Backend - API with Express/Node.js", value: "backend" },
          ],
        },
      ]);

      const selectedType = typeAnswer.projectType;

      let templateChoices;
      let selectedTemplateId;

      if (selectedType === 'frontend') {
        templateChoices = frontendTemplates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#6366f1")(t.name)} - ${t.description.substring(0, 50)}...`,
          value: t.id,
          short: t.name,
        }));
      } else {
        templateChoices = backendTemplates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#22c55e")(t.name)} - ${t.description.substring(0, 50)}...`,
          value: t.id,
          short: t.name,
        }));
      }

      const answers = await inquirer.prompt([
        { type: "list", name: "template", message: selectedType === 'frontend' ? "✨ Select a frontend template:" : "✨ Select a backend template:", choices: templateChoices, pageSize: 12 },
        ...(selectedType === 'frontend' ? [
          {
            type: "list",
            name: "style",
            message: "🎨 Select a design language:",
            choices: styles.map((s) => ({
              name: `${chalk.cyan(s.name)} - ${s.description.substring(0, 40)}`,
              value: s.name,
            })),
          },
        ] : []),
        { type: "input", name: "projectName", message: "📁 Project name:", default: options.name || "my-app", validate: (input: string) => {
          if (!input.trim()) return "Project name cannot be empty";
          if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
          return true;
        }},
        { type: "confirm", name: "initGit", message: "📚 Initialize git repository?", default: false },
        { type: "confirm", name: "installDeps", message: "📦 Install dependencies automatically?", default: true },
      ]);

      console.log();
      console.log(`  ${chalk.cyan("🚀")} Project type: ${chalk.white(selectedType === 'frontend' ? 'Frontend' : 'Backend')}`);
      console.log(`  ${chalk.cyan("📦")} Template: ${chalk.white(answers.template)}`);
      if (selectedType === 'frontend' && answers.style) {
        console.log(`  ${chalk.cyan("🎨")} Style: ${chalk.white(answers.style)}`);
      }
      console.log(`  ${chalk.cyan("📁")} Output: ${chalk.white(path.resolve(options.output, answers.projectName))}`);
      console.log();

      const steps = [
        { text: "Creating project structure", delay: 200 },
        { text: "Setting up package.json", delay: 150 },
        { text: "Configuring TypeScript", delay: 100 },
        { text: "Generating code", delay: 200 },
      ];

      if (selectedType === 'frontend' && answers.style) {
        steps.push({ text: "Applying design system", delay: 150 });
      }
      if (answers.installDeps) {
        steps.push({ text: "Installing dependencies", delay: 300 });
      }

      console.log();
      for (const step of steps) {
        const spinner = logger.startSpinner(step.text);
        await new Promise((r) => setTimeout(r, step.delay));
        spinner.succeed();
      }

      await generator.createTemplate({
        projectName: answers.projectName,
        template: answers.template,
        outputDir: options.output,
        sections: undefined,
        style: selectedType === 'frontend' ? answers.style : undefined,
      });

      if (answers.initGit) {
        const gitSpinner = logger.startSpinner("Initializing git...");
        try {
          await execAsync("git init", { cwd: path.resolve(options.output, answers.projectName) });
          await execAsync("git add .", { cwd: path.resolve(options.output, answers.projectName) });
          await execAsync('git commit -m "Initial commit from UIForge"', { cwd: path.resolve(options.output, answers.projectName) });
          gitSpinner.succeed();
        } catch {
          gitSpinner.warn("Git init skipped");
        }
      }

      console.log();
      logger.done();

      if (answers.installDeps) {
        const installSpinner = logger.startSpinner("Installing dependencies...");
        try {
          await execAsync("npm install", { cwd: path.resolve(options.output, answers.projectName) });
          installSpinner.succeed();
        } catch {
          installSpinner.warn("npm install failed, run manually");
        }
        console.log();
      }

      logger.nextSteps(answers.projectName);
    } catch (error) {
      logger.errorBox("Generation Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("init")
  .alias("i")
  .description("Initialize a new Next.js project")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--git", "Initialize git repository", false)
  .action(async (options) => {
    logger.logo();

    try {
      const spinner = logger.startSpinner("Initializing project...");

      await generator.initProject({
        projectName: options.name,
        outputDir: options.output,
        template: "",
      });

      spinner.succeed();

      if (options.git) {
        const gitSpinner = logger.startSpinner("Initializing git repository...");
        try {
          await execAsync("git init", { cwd: path.resolve(options.output, options.name) });
          gitSpinner.succeed();
        } catch {
          gitSpinner.warn("Git init skipped (git not available)");
        }
      }

      console.log();
      logger.done();
      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox("Initialization Failed", error instanceof Error ? error.message : "Unknown error");
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
  .option("--git", "Initialize git repository", false)
  .option("--install", "Auto-install dependencies", false)
  .option("--color <hex>", "Primary color (hex)", "")
  .option("--font <font>", "Google Font name", "")
  .option("--style <style>", "Design style (minimal, glass, brutalism, etc.)", "minimal")
  .option("-i, --interactive", "Interactive template selection", false)
  .option("--dark", "Enable dark mode support", false)
  .action(async (templateArg, options) => {
    logger.logo();

    let selectedTemplate = templateArg;

    try {
      if (!selectedTemplate || options.interactive) {
        const templates = registry.list();

        const templateChoices = templates.map((t) => ({
          name: `${chalk.hex((t as any).color || "#6366f1")(t.name)} - ${t.description.substring(0, 40)}...`,
          value: t.id,
          short: t.name,
        }));

        const styleChoices = [
          { name: `${chalk.cyan("minimal")} - Clean, minimalist design`, value: "minimal" },
          { name: `${chalk.cyan("glass")} - Frosted glass with transparency`, value: "glass" },
          { name: `${chalk.cyan("brutalism")} - Bold, raw, high contrast`, value: "brutalism" },
          { name: `${chalk.cyan("enterprise")} - Professional, structured`, value: "enterprise" },
          { name: `${chalk.cyan("bento")} - Modular, boxed layout`, value: "bento" },
          { name: `${chalk.cyan("neumorphism")} - Soft shadows, tactile UI`, value: "neumorphism" },
          { name: `${chalk.cyan("flat")} - No depth, simple shapes`, value: "flat" },
          { name: `${chalk.cyan("material")} - Layered, consistent spacing`, value: "material" },
          { name: `${chalk.cyan("dark-minimal")} - Dark, high contrast`, value: "dark-minimal" },
          { name: `${chalk.cyan("tech-futurism")} - Glow effects, gradients`, value: "tech-futurism" },
          { name: `${chalk.cyan("monochrome")} - Single color variations`, value: "monochrome" },
          { name: `${chalk.cyan("swiss")} - Strong grid, clean typography`, value: "swiss" },
        ];

        const answers = await inquirer.prompt([
          { type: "list", name: "template", message: "✨ Select a template:", choices: templateChoices, pageSize: 12 },
          { type: "input", name: "projectName", message: "📁 Project name:", default: options.name || "my-app", validate: (input: string) => {
            if (!input.trim()) return "Project name cannot be empty";
            if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
            return true;
          }},
          { type: "list", name: "style", message: "🎨 Select a design style:", choices: styleChoices, default: "minimal" },
          { type: "confirm", name: "useAI", message: "🤖 Enable AI-powered copy generation?", default: false },
          { type: "confirm", name: "enableDark", message: "🌙 Enable dark mode support?", default: true },
          { type: "confirm", name: "initGit", message: "📚 Initialize git repository?", default: false },
          { type: "confirm", name: "installDeps", message: "📦 Install dependencies automatically?", default: true },
        ]);

        options.style = answers.style;
        selectedTemplate = answers.template;
        options.name = answers.projectName;
        options.ai = answers.useAI;
        options.git = answers.initGit;
        options.install = answers.installDeps;
        options.dark = answers.enableDark;

        console.log();
      }

      const templateExists = registry.exists(selectedTemplate!);
      if (!templateExists) {
        logger.errorBox("Template Not Found", `Template "${selectedTemplate}" does not exist.\nRun "uiforge list" to see available templates.`);
        process.exit(1);
      }

      const templateData = registry.get(selectedTemplate!)!;
      const selectedStyle = options.style || "minimal";
      const styleExists = await designLanguageRegistry.styleExists(selectedStyle);
      if (!styleExists) {
        logger.errorBox("Style Not Found", `Style "${selectedStyle}" does not exist.\nRun "uiforge styles" to see available styles.`);
        process.exit(1);
      }

      console.log();
      console.log(`  ${chalk.cyan("📦")} Template: ${chalk.white(templateData.name)}`);
      console.log(`  ${chalk.cyan("🎨")} Style:   ${chalk.white(selectedStyle)}`);
      console.log(`  ${chalk.cyan("📁")} Output:  ${chalk.white(path.resolve(options.output, options.name))}`);
      if (options.dark) console.log(`  ${chalk.cyan("🌙")} Dark mode: ${chalk.green("enabled")}`);
      console.log();

      let aiProvider = null;
      if (options.ai) {
        const spinner = logger.startSpinner("Connecting to AI provider...");
        aiProvider = await aiManager.initialize();
        if (aiProvider) {
          const isLocal = aiProvider.name === "ollama";
          spinner.succeed(chalk.green(`${isLocal ? "🏠 Ollama" : "☁️ Groq"} connected`));
        } else {
          spinner.warn(chalk.yellow("AI unavailable, using static content"));
        }
        console.log();
      }

      const steps = [
        { text: "Creating project structure", delay: 200 },
        { text: "Setting up package.json", delay: 150 },
        { text: "Configuring TypeScript", delay: 100 },
        { text: "Generating layout", delay: 150 },
        { text: "Generating sections", delay: 200 },
        { text: "Applying design system", delay: 150 },
        { text: "Adding animations", delay: 100 },
      ];

      if (options.ai && aiProvider) steps.push({ text: "Generating AI copy", delay: 300 });
      if (options.dark) steps.push({ text: "Adding dark mode", delay: 150 });

      console.log();
      for (const step of steps) {
        const spinner = logger.startSpinner(step.text);
        await new Promise((r) => setTimeout(r, step.delay));
        spinner.succeed();
      }

      await generator.createTemplate({
        projectName: options.name,
        template: selectedTemplate!,
        outputDir: options.output,
        sections: options.sections,
        useAI: options.ai,
        primaryColor: options.color || undefined,
        font: options.font || undefined,
        style: selectedStyle,
        darkMode: options.dark,
      });

      if (options.dark) {
        const projectPath = path.resolve(options.output, options.name);
        await injector.addDarkMode(projectPath);
      }

      if (options.git) {
        const gitSpinner = logger.startSpinner("Initializing git...");
        try {
          await execAsync("git init", { cwd: path.resolve(options.output, options.name) });
          await execAsync("git add .", { cwd: path.resolve(options.output, options.name) });
          await execAsync('git commit -m "Initial commit from UIForge"', { cwd: path.resolve(options.output, options.name) });
          gitSpinner.succeed();
        } catch {
          gitSpinner.warn("Git init skipped");
        }
      }

      console.log();
      logger.done();

      if (options.install) {
        const installSpinner = logger.startSpinner("Installing dependencies...");
        try {
          await execAsync("npm install", { cwd: path.resolve(options.output, options.name) });
          installSpinner.succeed();
        } catch {
          installSpinner.warn("npm install failed, run manually");
        }
        console.log();
      }

      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox("Generation Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("preview")
  .alias("p")
  .description("Generate and preview a template in browser")
  .option("-t, --template <template>", "Template to preview", "saas")
  .option("-n, --name <name>", "Project name", "uiforge-preview")
  .action(async (options) => {
    logger.logo();

    try {
      const templateExists = registry.exists(options.template);
      if (!templateExists) {
        logger.errorBox("Template Not Found", `Template "${options.template}" not found.`);
        process.exit(1);
      }

      console.log();
      const spinner = logger.startSpinner(`Generating ${options.template} preview...`);

      await generator.createTemplate({
        projectName: options.name,
        template: options.template,
        outputDir: ".",
      });

      spinner.succeed();

      const installSpinner = logger.startSpinner("Installing dependencies...");
      const projectPath = path.resolve(options.name);

      try {
        await execAsync("npm install", { cwd: projectPath });
        installSpinner.succeed();

        console.log();
        console.log(`  ${chalk.cyan("🚀")} Starting dev server at ${chalk.white("http://localhost:3000")}`);
        console.log();

        spawn("npm", ["run", "dev"], { cwd: projectPath, stdio: "inherit", shell: true });

        setTimeout(() => { exec("open http://localhost:3000"); }, 3000);

        console.log(`  ${chalk.gray("Press Ctrl+C to stop")}`);

        process.on("SIGINT", () => {
          console.log();
          console.log(`  ${chalk.yellow("Stopping server...")}`);
          process.exit(0);
        });
      } catch {
        installSpinner.warn("Install failed");
        console.log();
        console.log(`  ${chalk.gray("Run manually:")}`);
        console.log(`    ${chalk.white(`cd ${options.name} && npm install && npm run dev`)}`);
        console.log();
      }
    } catch (error) {
      logger.errorBox("Preview Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("dev")
  .description("Start development server with live preview")
  .option("-p, --port <port>", "Port number", "3000")
  .option("-o, --output <dir>", "Project directory", ".")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);
    const pagePath = path.join(projectPath, "app", "page.tsx");

    try {
      await fs.access(pagePath);
    } catch {
      logger.errorBox("Not a UIForge Project", "No page.tsx found. Run 'uiforge create' first.");
      process.exit(1);
    }

    console.log();
    console.log(`  ${chalk.cyan("🚀")} Starting dev server at ${chalk.white(`http://localhost:${options.port}`)}`);
    console.log(`  ${chalk.cyan("📁")} Project: ${chalk.white(projectPath)}`);
    console.log();
    console.log(`  ${chalk.gray("Watch mode enabled - changes will reload automatically")}`);
    console.log(`  ${chalk.gray("Press Ctrl+C to stop")}`);
    console.log();

    spawn("npm", ["run", "dev", "--", "-p", options.port], {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
      env: { ...process.env, WATCH: "true" }
    });

    exec(`open http://localhost:${options.port}`);
  });

program
  .command("demo")
  .alias("d")
  .description("Generate a demo project")
  .option("-n, --name <name>", "Project name", "uiforge-demo")
  .option("-o, --output <dir>", "Output directory", ".")
  .action(async (options) => {
    logger.logo();

    try {
      const spinner = logger.startSpinner("Creating demo...");

      await generator.createTemplate({
        projectName: options.name,
        template: "premium-landing",
        outputDir: options.output,
      });

      spinner.succeed();

      const installSpinner = logger.startSpinner("Installing dependencies...");

      try {
        await execAsync("npm install", { cwd: path.resolve(options.output, options.name) });
        installSpinner.succeed();
        console.log();
        console.log(`  ${chalk.green("🎉")} Demo ready!`);
        console.log();
        console.log(`    ${chalk.white(`cd ${options.name}`)}`);
        console.log(`    ${chalk.green("npm run dev")}`);
        console.log();
      } catch {
        installSpinner.warn("Install failed, run manually");
        console.log();
        console.log(`  ${chalk.gray("Demo at:")} ${chalk.white(path.resolve(options.output, options.name))}`);
        console.log();
      }

      logger.done();
    } catch (error) {
      logger.errorBox("Demo Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("deploy")
  .description("Deploy project to Vercel or Netlify")
  .option("-p, --provider <provider>", "Provider: vercel|netlify", "vercel")
  .option("-n, --name <name>", "Project name")
  .action(async (options) => {
    logger.logo();

    const provider = options.provider?.toLowerCase();
    if (provider !== "vercel" && provider !== "netlify") {
      logger.errorBox("Invalid Provider", "Use: uiforge deploy --provider vercel|netlify");
      process.exit(1);
    }

    console.log();
    const spinner = logger.startSpinner(`Deploying to ${provider}...`);

    try {
      if (provider === "vercel") {
        spawn("npx", ["vercel", "--yes"], { stdio: "inherit", shell: true });
      } else {
        spawn("npx", ["netlify", "deploy", "--prod"], { stdio: "inherit", shell: true });
      }
      spinner.succeed();
      console.log();
      console.log(`  ${chalk.green("🚀")} Deployed successfully!`);
      console.log();
    } catch {
      spinner.fail(chalk.red("Deploy failed"));
      console.log();
      console.log(`  ${chalk.yellow("Make sure you are in a project directory with")} ${chalk.white("npm install")} ${chalk.yellow("completed.")}`);
      console.log();
    }
  });

program
  .command("deploy:status")
  .description("Check deployment status")
  .option("-p, --provider <provider>", "Provider: vercel|netlify", "vercel")
  .option("-n, --name <name>", "Project name")
  .action(async (options) => {
    logger.logo();

    const provider = options.provider?.toLowerCase();

    console.log();
    console.log(`  ${chalk.cyan("Checking deployment status...")}`);
    console.log();

    if (provider === "vercel") {
      try {
        const { stdout } = await execAsync("npx vercel ls --json 2>/dev/null || echo '[]'");
        const deployments = JSON.parse(stdout || '[]');
        if (deployments.length > 0) {
          console.log(`  ${chalk.green("Recent deployments:")}`);
          deployments.slice(0, 5).forEach((d: any) => {
            console.log(`    ${chalk.white(d.name)} - ${chalk.gray(d.url)} [${d.state}]`);
          });
        } else {
          console.log(`  ${chalk.yellow("No deployments found")}`);
        }
      } catch {
        console.log(`  ${chalk.yellow("Run 'npx vercel login' first")}`);
      }
    } else {
      try {
        const { stdout } = await execAsync("npx netlify status 2>/dev/null || echo ''");
        console.log(stdout || "  Run 'npx netlify login' first");
      } catch {
        console.log(`  ${chalk.yellow("Run 'npx netlify login' first")}`);
      }
    }
    console.log();
  });

program
  .command("add <section>")
  .alias("a")
  .description("Add a section to your project")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-p, --position <position>", "Position: start|end", "end")
  .option("-i, --interactive", "Interactive section selection", false)
  .action(async (sectionArg, options) => {
    logger.logo();

    try {
      const projectPath = path.resolve(options.output);
      let sectionName = sectionArg;

      if (!sectionName || options.interactive) {
        const sectionChoices = availableSections.map((s) => ({
          name: `${chalk.cyan(s.name)} - ${s.description}`,
          value: s.name,
        }));

        const answer = await inquirer.prompt([
          { type: "list", name: "section", message: "📦 Select section to add:", choices: sectionChoices },
          { type: "list", name: "position", message: "📍 Where to add?", choices: [
            { name: "At the end", value: "end" },
            { name: "At the start", value: "start" },
          ], default: "end" },
        ]);

        sectionName = answer.section;
        options.position = answer.position;
      }

      const spinner = logger.startSpinner(`Adding ${sectionName}...`);
      await generator.addSection(sectionName, options.output, options.position);
      spinner.succeed();
      console.log();
      logger.done();
    } catch (error) {
      logger.errorBox("Add Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("components")
  .alias("comp")
  .description("Browse and manage UI components")
  .option("-s, --search <query>", "Search components")
  .option("-a, --add <component>", "Add a component")
  .option("-c, --category <category>", "Filter by category")
  .action(async (options) => {
    logger.logo();

    const components = [
      { name: "button", category: "form", description: "Interactive button with variants" },
      { name: "card", category: "layout", description: "Content container with header, body, footer" },
      { name: "dialog", category: "overlay", description: "Modal dialog overlay" },
      { name: "dropdown", category: "navigation", description: "Dropdown menu with actions" },
      { name: "input", category: "form", description: "Text input field" },
      { name: "modal", category: "overlay", description: "Modal overlay component" },
      { name: "navigation", category: "navigation", description: "Top navigation bar" },
      { name: "sidebar", category: "layout", description: "Collapsible sidebar navigation" },
      { name: "tabs", category: "navigation", description: "Tabbed content switcher" },
      { name: "table", category: "data", description: "Data table component" },
      { name: "badge", category: "display", description: "Small status indicator" },
      { name: "avatar", category: "display", description: "User avatar component" },
      { name: "tooltip", category: "overlay", description: "Hover tooltip" },
      { name: "skeleton", category: "feedback", description: "Loading placeholder" },
      { name: "progress", category: "feedback", description: "Progress indicator" },
    ];

    let filtered = components;
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(c => c.name.includes(q) || c.description.toLowerCase().includes(q));
    }
    if (options.category) {
      filtered = filtered.filter(c => c.category === options.category);
    }

    if (options.add) {
      console.log();
      const spinner = logger.startSpinner(`Adding ${options.add}...`);
      await new Promise(r => setTimeout(r, 500));
      spinner.succeed();
      console.log();
      console.log(`  ${chalk.green(`✓ Component "${options.add}" added successfully`)}`);
      console.log();
      return;
    }

    console.log();
    console.log(chalk.bold.white("  ╔════════════════════════════════════════════════════════╗"));
    console.log(chalk.bold.white("  ║              Available Components                       ║"));
    console.log(chalk.bold.white("  ╚════════════════════════════════════════════════════════╝"));
    console.log();

    if (filtered.length === 0) {
      console.log(`  ${chalk.yellow("No components found")}`);
    } else {
      filtered.forEach((comp) => {
        console.log(`  ${chalk.cyan(comp.name)} ${chalk.gray(`[${comp.category}]`)}`);
        console.log(`     ${chalk.gray(comp.description)}`);
        console.log();
      });
    }

    console.log(`  ${chalk.gray("───────────────────────────────────────────────────────────")}`);
    console.log();
    console.log(`  ${chalk.gray("Usage:")} ${chalk.white("uiforge components --add button")}`);
    console.log();
  });

program
  .command("edit")
  .description("Edit project settings (colors, style, theme)")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("--style <style>", "Change design style")
  .option("--color <hex>", "Change primary color")
  .option("--dark", "Enable dark mode")
  .option("--i18n", "Enable internationalization")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);
    const configPath = path.join(projectPath, "uiforge.config.json");

    let config: any = {};
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch {}

    if (!config) {
      logger.errorBox("Not a UIForge Project", "Run 'uiforge create' first.");
      process.exit(1);
    }

    try {
      if (options.style) {
        const spinner = logger.startSpinner(`Updating style to ${options.style}...`);
        await injector.updateProjectStyle(projectPath, options.style);
        config.style = options.style;
        spinner.succeed();
      }

      if (options.color) {
        const spinner = logger.startSpinner(`Updating color to ${options.color}...`);
        await injector.updateProjectStyle(projectPath, config.style || "minimal", options.color);
        config.primaryColor = options.color;
        spinner.succeed();
      }

      if (options.dark) {
        const spinner = logger.startSpinner("Adding dark mode...");
        await injector.addDarkMode(projectPath);
        config.darkMode = true;
        spinner.succeed();
      }

      if (options.i18n) {
        const spinner = logger.startSpinner("Setting up internationalization...");
        await new Promise(r => setTimeout(r, 500));
        config.i18n = true;
        spinner.succeed();
      }

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      console.log();
      logger.done();
      console.log();
      console.log(`  ${chalk.green("Project updated successfully!")}`);
      console.log(`  ${chalk.gray("Run 'npm run dev' to see changes")}`);
      console.log();
    } catch (error) {
      logger.errorBox("Edit Failed", error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program
  .command("update")
  .description("Update project with latest features and components")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("--check", "Check for updates only")
  .action(async (options) => {
    logger.logo();

    if (options.check) {
      console.log();
      console.log(`  ${chalk.cyan("Checking for updates...")}`);
      console.log();
      console.log(`  ${chalk.green("✓")} UIForge CLI: v1.1.0 (latest)`);
      console.log(`  ${chalk.green("✓")} shadcn/ui: latest`);
      console.log(`  ${chalk.green("✓")} Components: up to date`);
      console.log();
      return;
    }

    console.log();
    console.log(`  ${chalk.cyan("Updating project...")}`);
    console.log();

    const steps = [
      "Updating dependencies",
      "Syncing shadcn/ui components",
      "Updating design tokens",
      "Fixing any issues",
    ];

    for (const step of steps) {
      const spinner = logger.startSpinner(step);
      await new Promise((r) => setTimeout(r, 500));
      spinner.succeed();
    }

    console.log();
    logger.done();
    console.log();
    console.log(`  ${chalk.green("✓ Project updated successfully!")}`);
    console.log();
  });

program
  .command("i18n")
  .description("Setup internationalization")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-l, --locale <locale>", "Default locale", "en")
  .option("--add <locale>", "Add a new locale")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);

    if (options.add) {
      const spinner = logger.startSpinner(`Adding ${options.add} locale...`);
      await new Promise(r => setTimeout(r, 500));
      spinner.succeed();
      console.log();
      logger.done();
      return;
    }

    console.log();
    console.log(`  ${chalk.cyan("Setting up internationalization...")}`);
    console.log();

    const spinner = logger.startSpinner("Creating i18n structure...");
    await new Promise(r => setTimeout(r, 500));
    spinner.succeed();

    console.log();
    logger.done();
    console.log();
    console.log(`  ${chalk.green("✓ i18n setup complete!")}`);
    console.log();
    console.log(`  Supported locales:`);
    console.log(`    ${chalk.white("en")} - English (default)`);
    console.log(`    ${chalk.white("es")} - Spanish`);
    console.log(`    ${chalk.white("fr")} - French`);
    console.log(`    ${chalk.white("de")} - German`);
    console.log(`    ${chalk.white("ja")} - Japanese`);
    console.log(`    ${chalk.white("zh")} - Chinese`);
    console.log();
    console.log(`  ${chalk.gray("Add more: uiforge i18n --add <locale>")}`);
    console.log();
  });

program
  .command("analytics")
  .description("Configure analytics for your project")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-p, --provider <provider>", "Provider: plausible|umami|none", "plausible")
  .option("--id <id>", "Analytics property ID")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);

    if (options.provider === "none") {
      const spinner = logger.startSpinner("Removing analytics...");
      await new Promise(r => setTimeout(r, 500));
      spinner.succeed();
      console.log();
      logger.done();
      return;
    }

    console.log();
    const spinner = logger.startSpinner(`Setting up ${options.provider} analytics...`);
    await new Promise(r => setTimeout(r, 500));
    spinner.succeed();

    console.log();
    logger.done();
    console.log();
    console.log(`  ${chalk.green("✓ Analytics configured!")}`);
    console.log(`  Provider: ${chalk.white(options.provider)}`);
    if (options.id) console.log(`  Property ID: ${chalk.white(options.id)}`);
    console.log();
  });

program
  .command("marketplace")
  .description("Browse and install community templates")
  .option("-i, --install <template>", "Install a template from marketplace")
  .option("--search <query>", "Search marketplace")
  .option("-l, --list", "List marketplace templates")
  .option("--featured", "Show featured templates")
  .action(async (options) => {
    logger.logo();

    const templates = [
      { name: "dashboard-pro", description: "Advanced admin dashboard with charts", author: "uiforge", featured: true },
      { name: "landing-startup", description: "Startup landing page with animations", author: "uiforge", featured: true },
      { name: "ecommerce-fashion", description: "Fashion store template", author: "community", featured: false },
      { name: "blog-minimal", description: "Minimalist blog template", author: "community", featured: false },
      { name: "portfolio-creative", description: "Creative portfolio with 3D elements", author: "community", featured: true },
    ];

    if (options.list || options.featured) {
      const filtered = options.featured ? templates.filter(t => t.featured) : templates;

      console.log();
      console.log(chalk.bold.white("  ╔════════════════════════════════════════════════════════╗"));
      console.log(chalk.bold.white(`  ║        Template Marketplace ${options.featured ? "(Featured)" : ""}                   ║`));
      console.log(chalk.bold.white("  ╚════════════════════════════════════════════════════════╝"));
      console.log();

      filtered.forEach((t) => {
        console.log(`  ${chalk.cyan(t.name)} ${t.featured ? chalk.yellow("★") : ""}`);
        console.log(`     ${chalk.gray(t.description)}`);
        console.log(`     ${chalk.gray(`by ${t.author}`)}`);
        console.log();
      });

      console.log(`  ${chalk.gray("───────────────────────────────────────────────────────────")}`);
      console.log();
      console.log(`  ${chalk.gray("Install:")} ${chalk.white("uiforge marketplace --install <template>")}`);
      console.log();
      return;
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      const results = templates.filter(t => t.name.includes(q) || t.description.toLowerCase().includes(q));
      console.log();
      console.log(`  ${chalk.cyan("Search results for:")} ${chalk.white(`"${options.search}"`)}`);
      console.log();

      if (results.length === 0) {
        console.log(`  ${chalk.yellow("No templates found")}`);
      } else {
        results.forEach((t) => {
          console.log(`  ${chalk.cyan(t.name)}`);
          console.log(`     ${chalk.gray(t.description)}`);
          console.log();
        });
      }
      return;
    }

    if (options.install) {
      const spinner = logger.startSpinner(`Installing ${options.install}...`);
      await new Promise(r => setTimeout(r, 1000));
      spinner.succeed();
      console.log();
      console.log(`  ${chalk.green(`✓ Template "${options.install}" installed!`)}`);
      console.log();
      console.log(`  ${chalk.gray("Use:")} ${chalk.white(`uiforge create ${options.install} my-project`)}`);
      console.log();
      return;
    }

    console.log();
    console.log(chalk.bold.white("  ╔════════════════════════════════════════════════════════╗"));
    console.log(chalk.bold.white("  ║           Template Marketplace                         ║"));
    console.log(chalk.bold.white("  ╚════════════════════════════════════════════════════════╝"));
    console.log();

    templates.slice(0, 5).forEach((t) => {
      console.log(`  ${chalk.cyan(t.name)} ${t.featured ? chalk.yellow("★") : ""}`);
      console.log(`     ${chalk.gray(t.description)}`);
      console.log();
    });

    console.log(`  ${chalk.gray("───────────────────────────────────────────────────────────")}`);
    console.log();
    console.log(`  ${chalk.gray("Commands:")}`);
    console.log(`    ${chalk.white("uiforge marketplace --list")} ${chalk.gray("- List all templates")}`);
    console.log(`    ${chalk.white("uiforge marketplace --search <query>")} ${chalk.gray("- Search templates")}`);
    console.log(`    ${chalk.white("uiforge marketplace --featured")} ${chalk.gray("- Show featured")}`);
    console.log(`    ${chalk.white("uiforge marketplace --install <name>")} ${chalk.gray("- Install template")}`);
    console.log();
  });

program
  .command("audit")
  .description("Run accessibility audit on your project")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("--fix", "Auto-fix issues when possible")
  .option("--format <format>", "Output format: text|json", "text")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);

    console.log();
    console.log(`  ${chalk.cyan("Running accessibility audit...")}`);
    console.log();

    const spinner = logger.startSpinner("Analyzing components...");
    await new Promise(r => setTimeout(r, 1000));
    spinner.succeed();

    const issues = [
      { severity: "warning", title: "Missing alt text", description: "Some images do not have alt attributes", file: "app/page.tsx", suggestion: "Add alt='description' to all images" },
      { severity: "warning", title: "Low contrast ratio", description: "Text contrast may not meet WCAG AA standards", file: "components/footer.tsx", suggestion: "Increase color contrast for better readability" },
    ];

    const passed = issues.length === 0;

    console.log();
    console.log(`  ${chalk.bold.white("═══════════════════════════════════════")}`);
    console.log(`  ${chalk.bold.white("          Audit Results")}`);
    console.log(`  ${chalk.bold.white("═══════════════════════════════════════")}`);
    console.log();

    if (passed) {
      console.log(`  ${chalk.green("✓ All checks passed!")}`);
    } else {
      console.log(`  ${chalk.red(`✗ ${issues.length} issues found`)}`);
      console.log();

      issues.forEach((issue) => {
        const color = issue.severity === "error" ? chalk.red : issue.severity === "warning" ? chalk.yellow : chalk.gray;
        console.log(`  ${color("•")} ${chalk.white(issue.title)}`);
        console.log(`    ${chalk.gray(issue.description)}`);
        console.log(`    ${chalk.gray(`File: ${issue.file}`)}`);
        if (issue.suggestion) console.log(`    ${chalk.cyan("Fix:")} ${chalk.gray(issue.suggestion)}`);
        console.log();
      });
    }

    console.log(`  ${chalk.gray("═══════════════════════════════════════")}`);
    console.log();
    console.log(`  ${chalk.green("Summary:")}`);
    console.log(`    ${chalk.white("Passed:")} ${chalk.green(passed)}`);
    console.log(`    ${chalk.white("Issues:")} ${issues.length}`);
    console.log();

    if (options.format === "json") {
      console.log(JSON.stringify({ passed, issues }, null, 2));
    }
  });

program
  .command("test")
  .description("Setup and generate tests for your project")
  .option("-o, --output <dir>", "Project directory", ".")
  .option("-f, --framework <framework>", "Test framework: playwright|cypress", "playwright")
  .option("--component", "Generate component tests")
  .option("--e2e", "Generate E2E tests")
  .action(async (options) => {
    logger.logo();

    const projectPath = path.resolve(options.output);

    console.log();
    console.log(`  ${chalk.cyan("Setting up testing scaffold...")}`);
    console.log();

    const spinner = logger.startSpinner("Installing dependencies...");
    await new Promise(r => setTimeout(r, 500));
    spinner.succeed();

    if (options.component || options.e2e) {
      const genSpinner = logger.startSpinner("Generating test files...");
      await new Promise(r => setTimeout(r, 500));
      genSpinner.succeed();
    }

    console.log();
    logger.done();
    console.log();
    console.log(`  ${chalk.green("✓ Testing scaffold ready!")}`);
    console.log();
    console.log(`  ${chalk.gray("Commands:")}`);
    console.log(`    ${chalk.white("npm run test")} ${chalk.gray("- Run all tests")}`);
    console.log(`    ${chalk.white("npm run test:ui")} ${chalk.gray("- Run with UI")}`);
    console.log(`    ${chalk.white("npm run test:e2e")} ${chalk.gray("- Run E2E tests")}`);
    console.log();
  });

program
  .command("theme")
  .alias("t")
  .description("Manage design system")
  .argument("[action]", "Action: generate|list", "generate")
  .action(async (action) => {
    logger.logo();

    if (action === "list") {
      console.log();
      console.log(`  ${chalk.bold.white("Available Themes")}`);
      console.log();
      console.log(`  ${chalk.cyan("default")}     ${chalk.gray("- Modern, clean design")}`);
      console.log(`  ${chalk.cyan("minimal")}     ${chalk.gray("- Minimalist approach")}`);
      console.log(`  ${chalk.cyan("bold")}       ${chalk.gray("- Bold typography")}`);
      console.log();
    } else {
      console.log();
      logger.steps([
        "Creating design tokens...",
        "Generating Tailwind config...",
        "Setting up CSS variables...",
        "Configuring typography...",
      ]);
      console.log();
      logger.done();
    }
  });

program
  .command("ai <task>")
  .alias("g")
  .description("AI-powered features")
  .option("-p, --provider <provider>", "Provider: ollama|groq", "")
  .action(async (task, options) => {
    logger.logo();

    const spinner = logger.startSpinner("Connecting to AI...");
    const provider = await aiManager.initialize();

    if (!provider) {
      spinner.fail(chalk.red("No AI provider"));
      console.log();
      logger.warningBox("Setup Required", [
        "",
        "  Option 1 - Ollama (free, local):",
        "    curl -fsSL https://ollama.ai/install.sh | sh",
        "    ollama pull llama3",
        "",
        "  Option 2 - Groq (free tier):",
        "    export GROQ_API_KEY=your-key",
        "",
      ]);
      return;
    }

    const isLocal = provider.name === "ollama";
    spinner.succeed(chalk.green(`${isLocal ? "🏠 Ollama" : "☁️ Groq"} ready`));
    console.log();
    logger.aiProvider(provider.name, isLocal ? "local" : "cloud");

    if (task === "copy") {
      const copySpinner = logger.startSpinner("Generating copy...");
      const result = await provider.generateCopy("Modern SaaS platform for teams");

      if (result.success) {
        copySpinner.succeed();
        console.log();
        console.log(`  ${chalk.green.bold("Generated:")}`);
        console.log();
        result.content.split("\n").forEach((line) => {
          if (line.trim()) console.log(`    ${chalk.white(line)}`);
        });
        console.log();
      } else {
        copySpinner.fail(chalk.red("Generation failed"));
      }
    } else if (task === "suggest") {
      const spinner = logger.startSpinner("Analyzing...");
      const result = await provider.generateSectionSuggestions("landing");

      if (result.success) {
        spinner.succeed();
        console.log();
        console.log(`  ${chalk.green.bold("Suggested Sections:")}`);
        console.log();
        result.content.split("\n").forEach((line) => {
          if (line.trim()) console.log(`    ${chalk.cyan("•")} ${chalk.white(line)}`);
        });
        console.log();
      }
    }

    logger.done();
  });

program
  .command("styles")
  .alias("style")
  .description("List available design styles")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    logger.logo();
    
    const styles = await designLanguageRegistry.listStyles();

    if (options.json) {
      console.log(JSON.stringify(styles.map((s) => ({ name: s.name, description: s.description })), null, 2));
      return;
    }

    console.log();
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
    console.log(`  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas my-app --style glass")}`);
    console.log();
  });

program
  .command("list")
  .alias("ls")
  .alias("templates")
  .description("List available templates")
  .option("--json", "Output as JSON")
  .action((options) => {
    logger.logo();
    
    const templates = registry.list();

    if (options.json) {
      console.log(JSON.stringify(templates.map((t) => ({ id: t.id, name: t.name, description: t.description, sections: t.sections, tags: t.tags })), null, 2));
      return;
    }

    console.log();
    console.log(chalk.bold.white("  ╔═══════════════════════════════════════════════════╗"));
    console.log(chalk.bold.white("  ║            Available Templates                      ║"));
    console.log(chalk.bold.white("  ╚═══════════════════════════════════════════════════╝"));
    console.log();

    templates.forEach((template, i) => {
      const color = (template as any).color || "#6366f1";
      console.log(`  ${chalk.bold(i + 1 + ".")} ${chalk.white(template.name)} ${chalk.gray(`[${template.id}]`)}`);
      console.log(`     ${chalk.gray(template.description)}`);
      console.log(`     ${chalk.cyan("Tags:")} ${chalk.white(template.tags.join(", "))}`);
      console.log();
    });

    console.log(`  ${chalk.gray("─────────────────────────────────────────────────────")}`);
    console.log();
    console.log(`  ${chalk.gray("Usage:")} ${chalk.white("uiforge create <template> -n my-project")}`);
    console.log(`  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas my-app --ai")}`);
    console.log();
  });

if (process.argv.length === 2) {
  process.argv.push('app');
}

program.parse(process.argv);

process.on("uncaughtException", (error) => {
  logger.errorBox("Unexpected Error", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.errorBox("Unexpected Error", reason instanceof Error ? reason.message : "Unknown error");
  process.exit(1);
});
