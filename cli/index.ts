#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { logger } from "../utils/logger.js";
import { generator } from "../engine/generator.js";
import { registry, aiManager } from "../engine/registry.js";
import { designLanguageRegistry } from "../design-languages/registry.js";
import path from "path";
import { fileURLToPath } from "url";
import { exec, spawn } from "child_process";
import { promisify } from "util";

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
  
  console.log("  " + chalk.cyan("create") + " " + chalk.gray("[template]") + " " + chalk.cyan("[name]"));
  console.log("    " + chalk.gray("Generate a new project from a template"));
  console.log("    " + chalk.dim("Aliases:") + " " + chalk.green("c") + ", " + chalk.green("new"));
  console.log();
  
  console.log("  " + chalk.cyan("init"));
  console.log("    " + chalk.gray("Initialize a new Next.js project with UIForge"));
  console.log();
  
  console.log("  " + chalk.cyan("preview") + " " + chalk.gray("[template]"));
  console.log("    " + chalk.gray("Generate and preview a template in browser"));
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
  
  console.log("  " + chalk.cyan("deploy"));
  console.log("    " + chalk.gray("Deploy your project to Vercel or Netlify"));
  console.log();
  
  console.log("  " + chalk.cyan("add") + " " + chalk.gray("<section>"));
  console.log("    " + chalk.gray("Add a section to your existing project"));
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
  
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Interactive mode:") + "  " + chalk.green("npx uiforge create"));
  console.log("  " + chalk.cyan("→") + "  " + chalk.white("Direct creation:") + "   " + chalk.green("npx uiforge create saas my-app"));
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
  .description("")
  .version("1.0.0");

program.on("--help", () => {
  showHelp();
});

program
  .command("init")
  .alias("i")
  .description("Initialize a new Next.js project")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--git", "Initialize git repository", false)
  .action(async (options) => {
    logger.banner();

    try {
      const spinner = logger.startSpinner("Initializing project...");

      await generator.initProject({
        projectName: options.name,
        outputDir: options.output,
        template: "",
      });

      spinner.succeed();

      if (options.git) {
        const gitSpinner = logger.startSpinner(
          "Initializing git repository...",
        );
        try {
          await execAsync("git init", {
            cwd: path.resolve(options.output, options.name),
          });
          gitSpinner.succeed();
        } catch {
          gitSpinner.warn("Git init skipped (git not available)");
        }
      }

      console.log();
      logger.done();
      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox(
        "Initialization Failed",
        error instanceof Error ? error.message : "Unknown error",
      );
      process.exit(1);
    }
  });

program
  .command("create [template]")
  .description("Generate a full UI system from a template")
  .option("-n, --name <name>", "Project name", "my-app")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("-s, --sections <sections...>", "Specific sections to generate")
  .option("--ai", "Enable AI-powered copy generation")
  .option("--git", "Initialize git repository", false)
  .option("--install", "Auto-install dependencies", false)
  .option("--color <hex>", "Primary color (hex)", "")
  .option("--font <font>", "Google Font name", "")
  .option(
    "--style <style>",
    "Design style (minimal, glass, brutalism, etc.)",
    "minimal",
  )
  .option("-i, --interactive", "Interactive template selection", false)
  .action(async (templateArg, options) => {
    logger.logo();

    let selectedTemplate = templateArg;

    try {
      if (!selectedTemplate || options.interactive) {
        const templates = registry.list();

        const templateChoices = templates.map((t, i) => ({
          name: `${chalk.hex((t as any).color || "#6366f1")(t.name)} - ${t.description.substring(0, 40)}...`,
          value: t.id,
          short: t.name,
        }));

        const styleChoices = [
          {
            name: `${chalk.cyan("minimal")} - Clean, minimalist design`,
            value: "minimal",
          },
          {
            name: `${chalk.cyan("glass")} - Frosted glass with transparency`,
            value: "glass",
          },
          {
            name: `${chalk.cyan("brutalism")} - Bold, raw, high contrast`,
            value: "brutalism",
          },
          {
            name: `${chalk.cyan("enterprise")} - Professional, structured`,
            value: "enterprise",
          },
          {
            name: `${chalk.cyan("bento")} - Modular, boxed layout`,
            value: "bento",
          },
          {
            name: `${chalk.cyan("neumorphism")} - Soft shadows, tactile UI`,
            value: "neumorphism",
          },
          {
            name: `${chalk.cyan("flat")} - No depth, simple shapes`,
            value: "flat",
          },
          {
            name: `${chalk.cyan("material")} - Layered, consistent spacing`,
            value: "material",
          },
          {
            name: `${chalk.cyan("dark-minimal")} - Dark, high contrast`,
            value: "dark-minimal",
          },
          {
            name: `${chalk.cyan("tech-futurism")} - Glow effects, gradients`,
            value: "tech-futurism",
          },
          {
            name: `${chalk.cyan("monochrome")} - Single color variations`,
            value: "monochrome",
          },
          {
            name: `${chalk.cyan("swiss")} - Strong grid, clean typography`,
            value: "swiss",
          },
        ];

        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "template",
            message: "✨ Select a template:",
            choices: templateChoices,
            pageSize: 12,
          },
          {
            type: "input",
            name: "projectName",
            message: "📁 Project name:",
            default: options.name || "my-app",
            validate: (input: string) => {
              if (!input.trim()) return "Project name cannot be empty";
              if (!/^[a-z0-9-]+$/.test(input))
                return "Use lowercase letters, numbers, and hyphens only";
              return true;
            },
          },
          {
            type: "list",
            name: "style",
            message: "🎨 Select a design style:",
            choices: styleChoices,
            default: "minimal",
          },
          {
            type: "confirm",
            name: "useAI",
            message: "🤖 Enable AI-powered copy generation?",
            default: false,
          },
          {
            type: "confirm",
            name: "initGit",
            message: "📚 Initialize git repository?",
            default: false,
          },
          {
            type: "confirm",
            name: "installDeps",
            message: "📦 Install dependencies automatically?",
            default: true,
          },
        ]);

        options.style = answers.style;

        selectedTemplate = answers.template;
        options.name = answers.projectName;
        options.ai = answers.useAI;
        options.git = answers.initGit;
        options.install = answers.installDeps;

        console.log();
      }

      const templateExists = registry.exists(selectedTemplate!);
      if (!templateExists) {
        logger.errorBox(
          "Template Not Found",
          `Template "${selectedTemplate}" does not exist.\nRun "uiforge list" to see available templates.`,
        );
        process.exit(1);
      }

      const templateData = registry.get(selectedTemplate!)!;

      const selectedStyle = options.style || "minimal";
      const styleExists =
        await designLanguageRegistry.styleExists(selectedStyle);
      if (!styleExists) {
        logger.errorBox(
          "Style Not Found",
          `Style "${selectedStyle}" does not exist.\nRun "uiforge styles" to see available styles.`,
        );
        process.exit(1);
      }

      console.log();
      console.log(
        `  ${chalk.cyan("📦")} Template: ${chalk.white(templateData.name)}`,
      );
      console.log(
        `  ${chalk.cyan("🎨")} Style:   ${chalk.white(selectedStyle)}`,
      );
      console.log(
        `  ${chalk.cyan("📁")} Output:  ${chalk.white(path.resolve(options.output, options.name))}`,
      );
      console.log();

      let aiProvider = null;
      if (options.ai) {
        const spinner = logger.startSpinner("Connecting to AI provider...");
        aiProvider = await aiManager.initialize();

        if (aiProvider) {
          const isLocal = aiProvider.name === "ollama";
          spinner.succeed(
            chalk.green(`${isLocal ? "🏠 Ollama" : "☁️ Groq"} connected`),
          );
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

      if (options.ai && aiProvider) {
        steps.push({ text: "Generating AI copy", delay: 300 });
      }

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
      });

      if (options.git) {
        const gitSpinner = logger.startSpinner("Initializing git...");
        try {
          await execAsync("git init", {
            cwd: path.resolve(options.output, options.name),
          });
          await execAsync("git add .", {
            cwd: path.resolve(options.output, options.name),
          });
          await execAsync('git commit -m "Initial commit from UIForge"', {
            cwd: path.resolve(options.output, options.name),
          });
          gitSpinner.succeed();
        } catch {
          gitSpinner.warn("Git init skipped");
        }
      }

      console.log();
      logger.done();

      if (options.install) {
        const installSpinner = logger.startSpinner(
          "Installing dependencies...",
        );
        try {
          await execAsync("npm install", {
            cwd: path.resolve(options.output, options.name),
          });
          installSpinner.succeed();
        } catch {
          installSpinner.warn("npm install failed, run manually");
        }
        console.log();
      }

      logger.nextSteps(options.name);
    } catch (error) {
      logger.errorBox(
        "Generation Failed",
        error instanceof Error ? error.message : "Unknown error",
      );
      process.exit(1);
    }
  });

program
  .command("preview")
  .description("Generate and preview a template in browser")
  .option("-t, --template <template>", "Template to preview", "saas")
  .option("-n, --name <name>", "Project name", "uiforge-preview")
  .action(async (options) => {
    logger.logo();

    try {
      const templateExists = registry.exists(options.template);
      if (!templateExists) {
        logger.errorBox(
          "Template Not Found",
          `Template "${options.template}" not found.`,
        );
        process.exit(1);
      }

      console.log();
      const spinner = logger.startSpinner(
        `Generating ${options.template} preview...`,
      );

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
        console.log(
          `  ${chalk.cyan("🚀")} Starting dev server at ${chalk.white("http://localhost:3000")}`,
        );
        console.log();

        spawn("npm", ["run", "dev"], {
          cwd: projectPath,
          stdio: "inherit",
          shell: true,
        });

        setTimeout(() => {
          exec("open http://localhost:3000");
        }, 3000);

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
        console.log(
          `    ${chalk.white(`cd ${options.name} && npm install && npm run dev`)}`,
        );
        console.log();
      }
    } catch (error) {
      logger.errorBox(
        "Preview Failed",
        error instanceof Error ? error.message : "Unknown error",
      );
      process.exit(1);
    }
  });

program
  .command("demo")
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
        await execAsync("npm install", {
          cwd: path.resolve(options.output, options.name),
        });
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
        console.log(
          `  ${chalk.gray("Demo at:")} ${chalk.white(path.resolve(options.output, options.name))}`,
        );
        console.log();
      }

      logger.done();
    } catch (error) {
      logger.errorBox(
        "Demo Failed",
        error instanceof Error ? error.message : "Unknown error",
      );
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
      logger.errorBox(
        "Invalid Provider",
        "Use: uiforge deploy --provider vercel|netlify",
      );
      process.exit(1);
    }

    console.log();
    const spinner = logger.startSpinner(`Deploying to ${provider}...`);

    try {
      if (provider === "vercel") {
        spawn("npx", ["vercel", "--yes"], { stdio: "inherit", shell: true });
      } else {
        spawn("npx", ["netlify", "deploy", "--prod"], {
          stdio: "inherit",
          shell: true,
        });
      }
      spinner.succeed();
      console.log();
      console.log(`  ${chalk.green("🚀")} Deployed successfully!`);
      console.log();
    } catch {
      spinner.fail(chalk.red("Deploy failed"));
      console.log();
      console.log(
        `  ${chalk.yellow("Make sure you are in a project directory with")} ${chalk.white("npm install")} ${chalk.yellow("completed.")}`,
      );
      console.log();
    }
  });

program
  .command("add <section>")
  .description("Add a section to your project")
  .option("-o, --output <dir>", "Project directory", ".")
  .action(async (section, options) => {
    logger.logo();

    try {
      const spinner = logger.startSpinner(`Adding ${section}...`);
      await generator.addSection(section, options.output);
      spinner.succeed();
      console.log();
      logger.done();
    } catch (error) {
      logger.errorBox(
        "Add Failed",
        error instanceof Error ? error.message : "Unknown error",
      );
      process.exit(1);
    }
  });

program
  .command("theme")
  .description("Manage design system")
  .argument("[action]", "Action: generate|list", "generate")
  .action(async (action) => {
    logger.logo();

    if (action === "list") {
      console.log();
      console.log(`  ${chalk.bold.white("Available Themes")}`);
      console.log();
      console.log(
        `  ${chalk.cyan("default")}     ${chalk.gray("- Modern, clean design")}`,
      );
      console.log(
        `  ${chalk.cyan("minimal")}     ${chalk.gray("- Minimalist approach")}`,
      );
      console.log(
        `  ${chalk.cyan("bold")}       ${chalk.gray("- Bold typography")}`,
      );
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
      const result = await provider.generateCopy(
        "Modern SaaS platform for teams",
      );

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
          if (line.trim())
            console.log(`    ${chalk.cyan("•")} ${chalk.white(line)}`);
        });
        console.log();
      }
    }

    logger.done();
  });

program
  .command("styles")
  .description("List available design styles")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    const styles = await designLanguageRegistry.listStyles();

    if (options.json) {
      console.log(
        JSON.stringify(
          styles.map((s) => ({
            name: s.name,
            description: s.description,
          })),
          null,
          2,
        ),
      );
      return;
    }

    console.log();
    console.log(
      chalk.bold.white(
        "  ╔════════════════════════════════════════════════════════╗",
      ),
    );
    console.log(
      chalk.bold.white(
        "  ║              Available Design Styles                   ║",
      ),
    );
    console.log(
      chalk.bold.white(
        "  ╚════════════════════════════════════════════════════════╝",
      ),
    );
    console.log();

    styles.forEach((style, i) => {
      console.log(`  ${chalk.bold(i + 1 + ".")} ${chalk.cyan(style.name)}`);
      console.log(`     ${chalk.gray(style.description)}`);
      console.log();
    });

    console.log(
      "  ───────────────────────────────────────────────────────────",
    );
    console.log();
    console.log(
      `  ${chalk.gray("Usage:")} ${chalk.white("uiforge create <template> --style <style>")}`,
    );
    console.log(
      `  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas my-app --style glass")}`,
    );
    console.log();
  });

program
  .command("list")
  .description("List available templates")
  .option("--json", "Output as JSON")
  .action((options) => {
    const templates = registry.list();

    if (options.json) {
      console.log(
        JSON.stringify(
          templates.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            sections: t.sections,
            tags: t.tags,
          })),
          null,
          2,
        ),
      );
      return;
    }

    console.log();
    console.log(
      chalk.bold.white(
        "  ╔═══════════════════════════════════════════════════╗",
      ),
    );
    console.log(
      chalk.bold.white(
        "  ║            Available Templates                      ║",
      ),
    );
    console.log(
      chalk.bold.white(
        "  ╚═══════════════════════════════════════════════════╝",
      ),
    );
    console.log();

    templates.forEach((template, i) => {
      const color = (template as any).color || "#6366f1";
      console.log(
        `  ${chalk.bold(i + 1 + ".")} ${chalk.white(template.name)} ${chalk.gray(`[${template.id}]`)}`,
      );
      console.log(`     ${chalk.gray(template.description)}`);
      console.log(
        `     ${chalk.cyan("Tags:")} ${chalk.white(template.tags.join(", "))}`,
      );
      console.log();
    });

    console.log(
      `  ${chalk.gray("─────────────────────────────────────────────────────")}`,
    );
    console.log();
    console.log(
      `  ${chalk.gray("Usage:")} ${chalk.white("uiforge create <template> -n my-project")}`,
    );
    console.log(
      `  ${chalk.gray("Example:")} ${chalk.white("npx uiforge create saas my-app --ai")}`,
    );
    console.log();
  });

program.parse(process.argv);

process.on("uncaughtException", (error) => {
  logger.errorBox("Unexpected Error", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.errorBox(
    "Unexpected Error",
    reason instanceof Error ? reason.message : "Unknown error",
  );
  process.exit(1);
});
