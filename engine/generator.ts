import {
  writeFile,
  ensureDir,
  copyDir,
  getTemplatePath,
  fileExists,
  readFile,
} from "../utils/fs.js";
import { logger } from "../utils/logger.js";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface GenerationOptions {
  projectName: string;
  template: string;
  outputDir: string;
  sections?: string[];
  useAI?: boolean;
  darkMode?: boolean;
  primaryColor?: string;
  font?: string;
  style?: string;
}

export interface GeneratedCopy {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  featuresTitle: string;
  pricingTitle: string;
}

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
    const template = registry.get(options.template);

    if (!template) {
      throw new Error(`Template "${options.template}" not found`);
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

    await this.createFullProject(options.projectName, outputPath);

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
}

export const generator = new Generator();
