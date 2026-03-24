import {
  writeFile,
  ensureDir,
  copyDir,
  getTemplatePath,
  fileExists,
  readFile,
} from "../utils/fs.js";
import { logger, setVerboseMode, setDryRunMode, isDryRunMode, isVerboseMode } from "../utils/logger.js";
import { registry, type Template, type TemplateFile } from "./registry.js";
import {
  generateTailwindConfig,
  generateCSSVariables,
} from "../design-system/tailwind-generator.js";
import { defaultTokens } from "../design-system/tokens.js";
import { aiManager } from "./registry.js";
import {
  designLanguageRegistry,
  type DesignLanguage,
} from "../design-languages/registry.js";
import { injector, availableSections } from "./injector.js";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import {
  UIForgeError,
  TemplateNotFoundError,
  StyleNotFoundError,
  InvalidProjectNameError,
  ErrorCode,
  type GenerationOptions,
  type BackendOptions,
  type GeneratedCopy,
  type GenerationResult,
  type DryRunResult,
  type FileChange,
} from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Generator {
  async initProject(options: GenerationOptions): Promise<void> {
    const { projectName, outputDir } = options;

    logger.header("Initializing Project");

    const steps = [
      "Creating project structure",
      "Setting up package.json",
      "Configuring TypeScript",
      "Configuring Tailwind CSS",
      "Setting up shadcn/ui",
      "Creating base components",
    ];

    for (let i = 0; i < steps.length; i++) {
      logger.step(i + 1, steps.length, steps[i]);
      await this.sleep(200);
    }

    await this.createNextJSProject(projectName, outputDir);
    await this.setupShadcn(outputDir);

    logger.done();
  }

  async createTemplate(options: GenerationOptions): Promise<void> {
    setVerboseMode(options.verbose || false);
    setDryRunMode(options.dryRun || false);

    const template = registry.get(options.template);

    if (!template) {
      throw new TemplateNotFoundError(options.template);
    }

    const styleName = options.style || "minimal";
    let designLanguage: DesignLanguage;

    const styleExists = await designLanguageRegistry.styleExists(styleName);
    if (styleExists) {
      designLanguage = (await designLanguageRegistry.getStyle(styleName))!;
    } else {
      designLanguage = await designLanguageRegistry.getDefaultStyle();
    }

    const sections = options.sections || template.sections;
    const outputPath = path.join(options.outputDir, options.projectName);

    const cliDir = path.dirname(__dirname);
    const projectRoot = path.dirname(cliDir);
    const sourceTemplatePath = path.join(
      projectRoot,
      "templates",
      options.template,
    );
    const templateExists = await fileExists(sourceTemplatePath);

    let generatedCopy: GeneratedCopy | null = null;

    if (options.useAI) {
      logger.info("Generating AI-powered copy...");
      const provider = await aiManager.initialize();
      if (provider) {
        const templateContext = `Generate marketing copy for a ${template.name.toLowerCase()} website`;
        const result = await provider.generateCopy(templateContext);

        if (result.success) {
          generatedCopy = this.parseGeneratedCopy(result.content);
          logger.success("AI-powered copy generated");
        } else {
          logger.warning("AI generation failed, using default copy");
        }
      }
    }

    if (isDryRunMode()) {
      const dryRunResult = await this.performDryRun(
        options.projectName,
        outputPath,
        template,
        sections,
        designLanguage,
        templateExists,
        sourceTemplatePath,
        cliDir,
        projectRoot
      );
      return;
    }

    await this.createFullProject(options.projectName, outputPath);

    if (templateExists) {
      const { default: fsExtra } = await import("fs-extra");
      await fsExtra.copy(sourceTemplatePath, path.join(outputPath, "app"));
      logger.success(`Template copied`);

      if (generatedCopy) {
        await this.injectAICopy(outputPath, generatedCopy);
      }
    } else {
      await this.generateFromRegistry(
        template,
        outputPath,
        sections,
        generatedCopy,
      );
    }

    await this.generateDesignSystem(outputPath, designLanguage);
  }

  private async performDryRun(
    projectName: string,
    outputPath: string,
    template: Template,
    sections: string[],
    designLanguage: DesignLanguage,
    templateExists: boolean,
    sourceTemplatePath: string,
    cliDir: string,
    projectRoot: string
  ): Promise<void> {
    const changes: FileChange[] = [];
    const files: { path: string; action: 'create' | 'update' | 'skip' }[] = [];

    logger.dryRun.header(`Project: ${projectName} at ${outputPath}`);

    const baseFiles = [
      "package.json",
      "tsconfig.json",
      "next.config.mjs",
      "postcss.config.mjs",
      "components.json",
      "tailwind.config.ts",
      "app/globals.css",
      "lib/utils.ts",
    ];

    for (const file of baseFiles) {
      files.push({ path: `${projectName}/${file}`, action: 'create' });
    }

    if (templateExists) {
      files.push({ path: `${projectName}/app/page.tsx`, action: 'create' });
      files.push({ path: `${projectName}/app/layout.tsx`, action: 'create' });
      files.push({ path: `${projectName}/app/globals.css`, action: 'update' });
    }

    for (const section of sections) {
      files.push({ path: `${projectName}/app/sections/${section}.tsx`, action: 'create' });
    }

    files.push({ path: `${projectName}/tailwind.config.ts`, action: 'update' });

    for (const file of files) {
      logger.dryRun.file(file.action, file.path);
    }

    const stats = {
      created: files.filter(f => f.action === 'create').length,
      updated: files.filter(f => f.action === 'update').length,
      skipped: files.filter(f => f.action === 'skip').length,
      total: files.length,
    };

    logger.dryRun.summary(stats);

    console.log(chalk.bold.yellow('  💡 To create this project, run without --dry-run flag'));
    console.log();
  }

  private parseGeneratedCopy(content: string): GeneratedCopy {
    const lines = content.split("\n").filter((l) => l.trim());

    return {
      heroTitle:
        lines[0]?.replace(/^#?\s*/, "").trim() || "Build Something Amazing",
      heroSubtitle:
        lines[1]?.replace(/^#?\s*/, "").trim() ||
        "The modern platform for building and scaling your product.",
      ctaText:
        lines
          .find(
            (l) =>
              l.toLowerCase().includes("get started") ||
              l.toLowerCase().includes("start"),
          )
          ?.replace(/^#?\s*/, "")
          .trim() || "Get Started",
      featuresTitle:
        lines
          .find((l) => l.toLowerCase().includes("feature"))
          ?.replace(/^#?\s*/, "")
          .trim() || "Features",
      pricingTitle:
        lines
          .find(
            (l) =>
              l.toLowerCase().includes("pricing") ||
              l.toLowerCase().includes("price"),
          )
          ?.replace(/^#?\s*/, "")
          .trim() || "Pricing",
    };
  }

  private async injectAICopy(
    outputPath: string,
    copy: GeneratedCopy,
  ): Promise<void> {
    const pagePath = path.join(outputPath, "app", "page.tsx");
    const pageExists = await fileExists(pagePath);

    if (pageExists) {
      const { readFile } = await import("fs/promises");
      let content = await readFile(pagePath, "utf-8");

      content = content.replace(
        /Build Something Amazing|Build Amazing Products|Build [\w\s]+/,
        copy.heroTitle,
      );
      content = content.replace(
        /Create stunning[^"]*|The modern platform[^"]*/,
        copy.heroSubtitle,
      );

      await writeFile(pagePath, content);
      logger.success("AI copy injected into template");
    }
  }

  async addSection(
    sectionName: string,
    outputDir: string,
    position: "start" | "end" = "end"
  ): Promise<void> {
    const projectPath = path.resolve(outputDir);
    const pagePath = path.join(projectPath, "app", "page.tsx");

    if (!(await fileExists(pagePath))) {
      throw new Error(
        "No page.tsx found. Are you in a UIForge-generated project?"
      );
    }

    const validSections = availableSections.map((s) => s.name);
    if (!validSections.includes(sectionName)) {
      throw new Error(
        `Invalid section "${sectionName}". Available: ${validSections.join(", ")}`
      );
    }

    logger.header("Adding Section");

    const steps = [
      `Creating ${sectionName} component`,
      `Updating imports`,
      `Injecting into page`,
    ];

    for (let i = 0; i < steps.length; i++) {
      logger.step(i + 1, steps.length, steps[i]);
      await this.sleep(250);
    }

    await injector.addSectionToProject(projectPath, sectionName, position);

    logger.success(`Section "${sectionName}" added successfully`);
    logger.done();
  }

  async generateDesignSystem(
    outputDir: string,
    designLanguage?: DesignLanguage,
  ): Promise<void> {
    const tailwindPath = path.join(outputDir, "tailwind.config.ts");
    const cssPath = path.join(outputDir, "app", "globals.css");

    if (designLanguage) {
      const { generateStyleTailwindConfig, generateStyleCSSVariables } =
        designLanguageRegistry;
      await writeFile(
        tailwindPath,
        generateStyleTailwindConfig(designLanguage),
      );
      await writeFile(cssPath, generateStyleCSSVariables(designLanguage));
      logger.success(`Design system generated (${designLanguage.name} style)`);
    } else {
      await writeFile(tailwindPath, generateTailwindConfig(defaultTokens));
      await writeFile(cssPath, generateCSSVariables(defaultTokens));
      logger.success("Design system generated");
    }
  }

  private async createNextJSProject(
    projectName: string,
    outputDir: string,
  ): Promise<void> {
    const projectPath = path.join(outputDir, projectName);
    await ensureDir(projectPath);
    await ensureDir(path.join(projectPath, "app"));
    await ensureDir(path.join(projectPath, "components", "ui"));
    await ensureDir(path.join(projectPath, "lib"));
    await ensureDir(path.join(projectPath, "public"));

    const packageJson = {
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^14.2.0",
        react: "^18.3.0",
        "react-dom": "^18.3.0",
        "framer-motion": "^11.0.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.3.0",
        "class-variance-authority": "^0.7.0",
        "@radix-ui/react-slot": "^1.0.2",
        "lucide-react": "^0.400.0",
      },
      devDependencies: {
        typescript: "^5.4.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        autoprefixer: "^10.4.0",
        postcss: "^8.4.0",
        tailwindcss: "^3.4.0",
        "tailwindcss-animate": "^1.0.7",
        eslint: "^8.0.0",
        "eslint-config-next": "^14.2.0",
      },
    };

    await writeFile(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );

    await writeFile(
      path.join(projectPath, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2017",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [{ name: "next" }],
            paths: { "@/*": ["./*"] },
          },
          include: [
            "next-env.d.ts",
            "**/*.ts",
            "**/*.tsx",
            ".next/types/**/*.ts",
          ],
          exclude: ["node_modules"],
        },
        null,
        2,
      ),
    );

    await writeFile(
      path.join(projectPath, "next.config.mjs"),
      `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,
    );

    await writeFile(
      path.join(projectPath, "postcss.config.mjs"),
      `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
    );
  }

  private async createFullProject(
    projectName: string,
    projectPath: string,
  ): Promise<void> {
    await ensureDir(projectPath);
    await ensureDir(path.join(projectPath, "app"));
    await ensureDir(path.join(projectPath, "app", "sections"));
    await ensureDir(path.join(projectPath, "components", "ui"));
    await ensureDir(path.join(projectPath, "lib"));
    await ensureDir(path.join(projectPath, "public"));

    const packageJson = {
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^14.2.0",
        react: "^18.3.0",
        "react-dom": "^18.3.0",
        "framer-motion": "^11.0.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.3.0",
        "class-variance-authority": "^0.7.0",
        "@radix-ui/react-slot": "^1.0.2",
        "lucide-react": "^0.400.0",
      },
      devDependencies: {
        typescript: "^5.4.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        autoprefixer: "^10.4.0",
        postcss: "^8.4.0",
        tailwindcss: "^3.4.0",
        "tailwindcss-animate": "^1.0.7",
        eslint: "^8.0.0",
        "eslint-config-next": "^14.2.0",
      },
    };

    await writeFile(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );

    await writeFile(
      path.join(projectPath, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2017",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [{ name: "next" }],
            paths: { "@/*": ["./*"] },
          },
          include: [
            "next-env.d.ts",
            "**/*.ts",
            "**/*.tsx",
            ".next/types/**/*.ts",
          ],
          exclude: ["node_modules"],
        },
        null,
        2,
      ),
    );

    await writeFile(
      path.join(projectPath, "next.config.mjs"),
      `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,
    );

    await writeFile(
      path.join(projectPath, "postcss.config.mjs"),
      `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
    );

    await writeFile(
      path.join(projectPath, "lib", "utils.ts"),
      `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
    );

    await writeFile(
      path.join(projectPath, "components.json"),
      JSON.stringify(
        {
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
        },
        null,
        2,
      ),
    );
  }

  private async setupShadcn(outputDir: string): Promise<void> {
    const componentsPath = path.join(outputDir, "components.json");
    const utilsPath = path.join(outputDir, "lib", "utils.ts");

    await writeFile(
      componentsPath,
      JSON.stringify(
        {
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          rsc: true,
          tsx: true,
          tailwind: {
            config: "tailwind.config.ts",
            css: "app/globals.css",
            baseColor: "slate",
            cssVariables: true,
            prefix: "",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        },
        null,
        2,
      ),
    );

    await writeFile(
      utilsPath,
      `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
    );
  }

  private async generateFromRegistry(
    template: Template,
    outputPath: string,
    sections: string[],
    generatedCopy?: GeneratedCopy | null,
  ): Promise<void> {
    for (const file of template.files) {
      await writeFile(path.join(outputPath, file.path), file.content);
    }

    await writeFile(
      path.join(outputPath, "app", "layout.tsx"),
      this.generateLayoutComponent(),
    );

    const sectionComponents: Record<string, string> = {
      hero: this.generateHeroSection(generatedCopy),
      features: this.generateFeaturesSection(generatedCopy),
      testimonials: this.generateTestimonialsSection(),
      pricing: this.generatePricingSection(generatedCopy),
      cta: this.generateCTASection(generatedCopy),
      footer: this.generateFooterSection(),
      navbar: this.generateNavbarSection(),
    };

    for (const section of sections) {
      const component = sectionComponents[section];
      if (component) {
        await writeFile(
          path.join(outputPath, "app", "sections", `${section}.tsx`),
          component,
        );
      }
    }

    await writeFile(
      path.join(outputPath, "app", "page.tsx"),
      this.generatePageComponent(sections),
    );
  }

  private generateLayoutComponent(): string {
    return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'UIForge - Premium UI Generation',
  description: 'Build stunning, production-ready interfaces with UIForge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={\`\${inter.variable} font-sans antialiased\`}>
        {children}
      </body>
    </html>
  );
}
`;
  }

  private generatePageComponent(sections: string[]): string {
    const imports = sections
      .map((s) => `import ${this.toPascalCase(s)} from "./sections/${s}"`)
      .join("\n");

    const components = sections
      .map((s) => `      <${this.toPascalCase(s)} />`)
      .join("\n");

    return `${imports}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
${components}
    </main>
  );
}
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  private generateHeroSection(copy?: GeneratedCopy | null): string {
    const title =
      copy?.heroTitle ||
      'Build <span className="text-gradient">Amazing</span> Products';
    const subtitle =
      copy?.heroSubtitle ||
      "Create stunning, production-ready interfaces with ease. The modern way to build beautiful web applications.";
    const cta = copy?.ctaText || "Get Started";

    return `import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          ${title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          ${subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
            ${cta}
          </button>
          <button className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
`;
  }

  private generateFeaturesSection(copy?: GeneratedCopy | null): string {
    const featuresTitle = copy?.featuresTitle || "Features";
    return `import { motion } from 'framer-motion';

const features = [
  {
    title: 'Lightning Fast',
    description: 'Built with performance in mind. Every component is optimized for speed.',
    icon: '⚡',
  },
  {
    title: 'Accessible',
    description: 'WCAG compliant out of the box. Everyone can use your products.',
    icon: '♿',
  },
  {
    title: 'Customizable',
    description: 'Full control over styling. Make it yours with our design tokens.',
    icon: '🎨',
  },
  {
    title: 'Type Safe',
    description: 'Built with TypeScript. Catch errors before they happen.',
    icon: '🔒',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build modern web applications.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
`;
  }

  private generateTestimonialsSection(): string {
    return `import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'This changed how we build products. The quality is outstanding.',
    author: 'Sarah Chen',
    role: 'CTO at TechCorp',
    avatar: 'SC',
  },
  {
    quote: 'Best investment we made. The documentation is incredible.',
    author: 'Marcus Johnson',
    role: 'Lead Developer at StartupX',
    avatar: 'MJ',
  },
  {
    quote: 'Beautiful components that just work. Highly recommended!',
    author: 'Emily Rodriguez',
    role: 'Designer at DesignCo',
    avatar: 'ER',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of developers who love our products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
  }

  private generatePricingSection(copy?: GeneratedCopy | null): string {
    const pricingTitle = copy?.pricingTitle || "Simple Pricing";
    return `import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    features: ['5 Projects', 'Basic Support', 'Community Access', '1 Team Member'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    features: ['Unlimited Projects', 'Priority Support', 'Advanced Features', '5 Team Members'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    features: ['Everything in Pro', 'Custom Solutions', 'Dedicated Support', 'Unlimited Team'],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">${pricingTitle}</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={\`relative p-8 bg-card rounded-xl border \${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}\`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={\`w-full py-3 rounded-lg font-semibold transition-colors \${plan.popular ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted hover:bg-muted/80'}\`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
  }

  private generateCTASection(copy?: GeneratedCopy | null): string {
    const ctaText = copy?.ctaText || "Start Building Today";
    return `import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <div className="relative bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-primary-foreground overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              backgroundSize: '200% 200%',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of developers building beautiful products.
            </p>
            <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:opacity-90 transition-opacity">
              ${ctaText}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
`;
  }

  private generateFooterSection(): string {
    return `import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">UIForge</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 UIForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
`;
  }

  private generateNavbarSection(): string {
    return `import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold">
            UIForge
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async createBackend(options: BackendOptions): Promise<void> {
    const { projectName, template, outputDir, database, auth, design, apiKey } = options;
    const projectPath = path.join(outputDir, projectName);

    await ensureDir(projectPath);
    await ensureDir(path.join(projectPath, "src"));
    await ensureDir(path.join(projectPath, "src", "routes"));
    await ensureDir(path.join(projectPath, "src", "controllers"));
    await ensureDir(path.join(projectPath, "src", "models"));
    await ensureDir(path.join(projectPath, "src", "middleware"));
    await ensureDir(path.join(projectPath, "src", "services"));
    await ensureDir(path.join(projectPath, "src", "utils"));
    await ensureDir(path.join(projectPath, "prisma"));
    await ensureDir(path.join(projectPath, "drizzle"));
    await ensureDir(path.join(projectPath, "src", "db"));
    await ensureDir(path.join(projectPath, "tests"));

    const deps: Record<string, string> = {
      express: "^4.18.2",
      "express-rate-limit": "^7.1.5",
      "express-validator": "^7.0.1",
      cors: "^2.8.5",
      helmet: "^7.1.0",
      morgan: "^1.10.0",
      dotenv: "^16.3.1",
      jsonwebtoken: "^9.0.2",
      bcryptjs: "^2.4.3",
      "bcrypt": "^5.1.1",
      "uuid": "^9.0.1",
      zod: "^3.22.4",
    };

    const devDeps: Record<string, string> = {
      typescript: "^5.3.3",
      "@types/node": "^20.10.6",
      "@types/express": "^4.17.21",
      "@types/cors": "^2.8.17",
      "@types/morgan": "^1.9.9",
      "@types/jsonwebtoken": "^9.0.5",
      "@types/bcryptjs": "^2.4.6",
      "@types/uuid": "^9.0.7",
      tsx: "^4.7.0",
      jest: "^29.7.0",
      "@types/jest": "^29.5.11",
      "ts-jest": "^29.1.1",
      eslint: "^8.56.0",
      "typescript-eslint": "^6.18.1",
    };

    const scripts: Record<string, string> = {
      dev: "tsx watch src/index.ts",
      build: "tsc",
      start: "node dist/index.js",
      test: "jest",
    };

    if (database === 'prisma') {
      scripts["db:generate"] = "prisma generate";
      scripts["db:push"] = "prisma db push";
      scripts["db:migrate"] = "prisma migrate dev";
      devDeps["prisma"] = "^5.8.0";
    }

    if (database === 'drizzle') {
      scripts["db:generate"] = "drizzle-kit generate";
      scripts["db:push"] = "drizzle-kit push";
      scripts["db:migrate"] = "drizzle-kit migrate";
      deps["drizzle-orm"] = "^0.29.0";
      deps["postgres"] = "^3.4.3";
      devDeps["drizzle-kit"] = "^0.20.0";
    }

    if (auth === 'nextauth') {
      deps["next-auth"] = "^4.24.5";
      devDeps["@types/bcrypt"] = "^5.0.2";
    }

    const packageJson = {
      name: projectName,
      version: "1.0.0",
      private: true,
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    };

    await writeFile(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    await writeFile(
      path.join(projectPath, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022"],
          module: "NodeNext",
          moduleResolution: "NodeNext",
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          declaration: true,
          declarationMap: true,
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist", "tests"],
      }, null, 2)
    );

    await writeFile(
      path.join(projectPath, "src", "index.ts"),
      `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';
import { productRouter } from './routes/product.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;
`
    );

    await writeFile(
      path.join(projectPath, "src", "middleware", "errorHandler.ts"),
      `import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('Error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
`
    );

    await writeFile(
      path.join(projectPath, "src", "middleware", "auth.ts"),
      `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }
    next();
  };
};
`
    );

    await writeFile(
      path.join(projectPath, "src", "routes", "auth.ts"),
      `import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const users: User[] = [];

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array(),
        });
      }

      const { email, password, name } = req.body;

      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
      };

      users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Registration failed',
      });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const user = users.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Login failed',
      });
    }
  }
);

export { router as authRouter };
`
    );

    await writeFile(
      path.join(projectPath, "src", "routes", "user.ts"),
      `import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

const users: User[] = [];

router.get('/', authenticate, (req: AuthRequest, res) => {
  const userList = users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    avatar: u.avatar,
    bio: u.bio,
  }));
  
  res.json({
    status: 'success',
    data: userList,
  });
});

router.get('/:id', authenticate, (req: AuthRequest, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  
  res.json({
    status: 'success',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
});

router.put('/:id', authenticate, (req: AuthRequest, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  
  if (users[userIndex].id !== req.user?.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized',
    });
  }
  
  const { name, avatar, bio } = req.body;
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    avatar: avatar || users[userIndex].avatar,
    bio: bio || users[userIndex].bio,
  };
  
  res.json({
    status: 'success',
    data: {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      avatar: users[userIndex].avatar,
      bio: users[userIndex].bio,
    },
  });
});

router.delete('/:id', authenticate, (req: AuthRequest, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  
  if (users[userIndex].id !== req.user?.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized',
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    status: 'success',
    message: 'User deleted',
  });
});

export { router as userRouter };
`
    );

    await writeFile(
      path.join(projectPath, "src", "routes", "product.ts"),
      `import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const products: Product[] = [];

router.get('/', (req, res) => {
  const { category, search, limit = 10, offset = 0 } = req.query;
  
  let filtered = [...products];
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  
  const paginated = filtered.slice(offsetNum, offsetNum + limitNum);
  
  res.json({
    status: 'success',
    data: paginated,
    meta: {
      total: filtered.length,
      limit: limitNum,
      offset: offsetNum,
    },
  });
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }
  
  res.json({
    status: 'success',
    data: product,
  });
});

router.post('/', authenticate, (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  
  const newProduct: Product = {
    id: crypto.randomUUID(),
    name,
    description,
    price,
    category,
    image,
    stock: stock || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    status: 'success',
    data: newProduct,
  });
});

router.put('/:id', authenticate, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }
  
  const { name, description, price, category, image, stock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price || products[productIndex].price,
    category: category || products[productIndex].category,
    image: image || products[productIndex].image,
    stock: stock !== undefined ? stock : products[productIndex].stock,
    updatedAt: new Date(),
  };
  
  res.json({
    status: 'success',
    data: products[productIndex],
  });
});

router.delete('/:id', authenticate, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }
  
  products.splice(productIndex, 1);
  
  res.json({
    status: 'success',
    message: 'Product deleted',
  });
});

export { router as productRouter };
`
    );

    await writeFile(
      path.join(projectPath, ".env.example"),
      `PORT=3000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# For production, use proper secret values
# Do not commit .env file to version control
`
    );

    if (database === 'prisma') {
      await writeFile(
        path.join(projectPath, "prisma", "schema.prisma"),
        `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  comments  Comment[]
}

model Post {
  id        String    @id @default(uuid())
  title     String
  content   String
  published Boolean   @default(false)
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
`
      );
    }

    if (database === 'drizzle') {
      await writeFile(
        path.join(projectPath, "drizzle.config.ts"),
        `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
  },
} satisfies Config;
`
      );

      await writeFile(
        path.join(projectPath, "src", "db", "index.ts"),
        `import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export type DB = typeof db;
`
      );

      await writeFile(
        path.join(projectPath, "src", "db", "schema.ts"),
        `import { pgTable, serial, varchar, timestamp, boolean, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
`
      );

      await writeFile(
        path.join(projectPath, "src", "db", "users.ts"),
        `import { db } from './index';
import { users, type NewUser } from './schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  async findAll() {
    return db.select().from(users);
  },

  async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  },

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  },

  async create(user: NewUser) {
    return db.insert(users).values(user).returning();
  },

  async update(id: string, user: Partial<NewUser>) {
    return db.update(users).set(user).where(eq(users.id, id)).returning();
  },

  async delete(id: string) {
    return db.delete(users).where(eq(users.id, id));
  },
};
`
      );

      await writeFile(
        path.join(projectPath, "src", "db", "posts.ts"),
        `import { db } from './index';
import { posts, type NewPost } from './schema';
import { eq, desc } from 'drizzle-orm';

export const postRepository = {
  async findAll(limit = 10, offset = 0) {
    return db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
  },

  async findById(id: string) {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  },

  async findByAuthor(authorId: string) {
    return db.select().from(posts).where(eq(posts.authorId, authorId)).orderBy(desc(posts.createdAt));
  },

  async create(post: NewPost) {
    return db.insert(posts).values(post).returning();
  },

  async update(id: string, post: Partial<NewPost>) {
    return db.update(posts).set(post).where(eq(posts.id, id)).returning();
  },

  async delete(id: string) {
    return db.delete(posts).where(eq(posts.id, id));
  },
};
`
      );
    }

    if (auth === 'nextauth') {
      await writeFile(
        path.join(projectPath, "src", "auth", "config.ts"),
        `import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // In a real app, fetch user from database
        // const user = await userRepository.findByEmail(credentials.email);
        
        // Demo: accept any user
        return {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
};
`
      );

      await writeFile(
        path.join(projectPath, "src", "auth", "[...nextauth].ts"),
        `import NextAuth from 'next-auth';
import { authOptions } from './config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
`
      );

      await writeFile(
        path.join(projectPath, "src", "routes", "auth.ts"),
        `import { Router } from 'express';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config.js';

const router = Router();

router.get('/session', async (req, res) => {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      res.json({ status: 'success', data: session });
    } else {
      res.json({ status: 'error', message: 'No session found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get session' });
  }
});

export { router as authRouter };
`
      );
    }

    await writeFile(
      path.join(projectPath, "src", "utils", "helpers.ts"),
      `import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }
  next();
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const paginate = (query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};
`
    );

    await writeFile(
      path.join(projectPath, "jest.config.js"),
      `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
};
`
    );

    await writeFile(
      path.join(projectPath, "tests", "auth.test.ts"),
      `import request from 'supertest';
import app from '../src/index.js';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  });

  it('should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
`
    );

    logger.success("Full backend with database code generated");
  }
}

export const generator = new Generator();
