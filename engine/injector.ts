import { readFile, writeFile, fileExists, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export interface InjectionTarget {
  file: string;
  anchor: string;
  position: 'before' | 'after' | 'replace';
}

export interface InjectionConfig {
  component: string;
  import?: string;
  target: InjectionTarget;
}

export interface SectionDefinition {
  name: string;
  component: string;
  imports: string[];
  description: string;
}

export const availableSections: SectionDefinition[] = [
  {
    name: 'hero',
    component: 'Hero',
    imports: ['framer-motion', 'lucide-react'],
    description: 'Main hero section with headline and CTA'
  },
  {
    name: 'features',
    component: 'Features',
    imports: ['framer-motion', 'lucide-react'],
    description: 'Features grid with icons'
  },
  {
    name: 'pricing',
    component: 'Pricing',
    imports: ['framer-motion'],
    description: 'Pricing plans section'
  },
  {
    name: 'testimonials',
    component: 'Testimonials',
    imports: ['framer-motion'],
    description: 'Customer testimonials section'
  },
  {
    name: 'cta',
    component: 'CTA',
    imports: ['framer-motion', 'lucide-react'],
    description: 'Call to action section'
  },
  {
    name: 'footer',
    component: 'Footer',
    imports: ['lucide-react'],
    description: 'Site footer with links'
  },
  {
    name: 'navbar',
    component: 'Navbar',
    imports: ['framer-motion', 'lucide-react'],
    description: 'Navigation header'
  },
  {
    name: 'stats',
    component: 'Stats',
    imports: ['framer-motion'],
    description: 'Statistics/numbers section'
  },
  {
    name: 'faq',
    component: 'FAQ',
    imports: ['framer-motion'],
    description: 'Frequently asked questions'
  },
  {
    name: 'gallery',
    component: 'Gallery',
    imports: ['framer-motion'],
    description: 'Image gallery grid'
  },
  {
    name: 'team',
    component: 'Team',
    imports: ['framer-motion'],
    description: 'Team members section'
  },
  {
    name: 'contact',
    component: 'Contact',
    imports: ['framer-motion'],
    description: 'Contact form section'
  },
  {
    name: 'newsletter',
    component: 'Newsletter',
    imports: [],
    description: 'Email subscription form'
  },
  {
    name: 'logos',
    component: 'Logos',
    imports: [],
    description: 'Logo cloud section'
  },
];

export class Injector {
  async inject(config: InjectionConfig): Promise<void> {
    logger.info(`Injecting ${config.component} into ${config.target.file}`);
    const targetPath = config.target.file;
    const content = await readFile(targetPath);
    const updated = this.performInjection(content, config);
    await writeFile(targetPath, updated);
  }

  private performInjection(content: string, config: InjectionConfig): string {
    const anchor = config.target.anchor;
    
    if (config.import && !content.includes(`import ${config.component}`)) {
      const importLine = `import ${config.component} from "${config.import}";`;
      if (content.includes("import")) {
        const lastImportIndex = content.lastIndexOf("import ");
        const nextSemicolon = content.indexOf(";", lastImportIndex);
        if (nextSemicolon !== -1) {
          content = content.slice(0, nextSemicolon + 1) + '\n' + importLine + content.slice(nextSemicolon + 1);
        }
      }
    }

    if (config.target.position === 'after') {
      const anchorIndex = content.indexOf(anchor);
      if (anchorIndex !== -1) {
        const insertPoint = anchorIndex + anchor.length;
        content = content.slice(0, insertPoint) + '\n' + config.component + content.slice(insertPoint);
      }
    } else if (config.target.position === 'before') {
      const anchorIndex = content.indexOf(anchor);
      if (anchorIndex !== -1) {
        content = content.slice(0, anchorIndex) + config.component + '\n' + content.slice(anchorIndex);
      }
    }

    return content;
  }

  async injectImport(filePath: string, importStatement: string): Promise<void> {
    const content = await readFile(filePath);
    if (!content.includes(importStatement.split(' from ')[0])) {
      const importRegex = /^(import\s+.*?from\s+['"][^'"]+['"];?\s*)+/gm;
      const match = content.match(importRegex);
      if (match) {
        const lastImportEnd = content.indexOf(match[match.length - 1]) + match[match.length - 1].length;
        const updatedContent = content.slice(0, lastImportEnd) + '\n' + importStatement + content.slice(lastImportEnd);
        await writeFile(filePath, updatedContent);
      } else {
        await writeFile(filePath, importStatement + '\n' + content);
      }
      logger.success(`Added import to ${path.basename(filePath)}`);
    }
  }

  async injectComponent(filePath: string, componentTag: string, position: 'start' | 'end' = 'end'): Promise<void> {
    const content = await readFile(filePath);
    const returnMatch = content.match(/(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\()([\s\S]*?)(\)\s*\}\s*\})/);
    
    if (returnMatch) {
      const [fullMatch, before, innerJsx, after] = returnMatch;
      if (position === 'start') {
        const updatedJsx = `<${componentTag} />\n      ${innerJsx}`;
        const updatedContent = content.replace(fullMatch, `${before}${updatedJsx}${after}`);
        await writeFile(filePath, updatedContent);
      } else {
        const updatedJsx = `${innerJsx}\n      <${componentTag} />`;
        const updatedContent = content.replace(fullMatch, `${before}${updatedJsx}${after}`);
        await writeFile(filePath, updatedContent);
      }
      logger.success(`Injected <${componentTag} /> at ${position} of ${path.basename(filePath)}`);
    }
  }

  async addSectionToProject(
    projectPath: string,
    sectionName: string,
    position: 'start' | 'end' = 'end'
  ): Promise<void> {
    const sectionsDir = path.join(projectPath, 'app', 'sections');
    await ensureDir(sectionsDir);

    const sectionFile = path.join(sectionsDir, `${sectionName}.tsx`);
    const sectionComponent = this.generateSectionComponent(sectionName);
    await writeFile(sectionFile, sectionComponent);

    const pagePath = path.join(projectPath, 'app', 'page.tsx');
    if (await fileExists(pagePath)) {
      await this.injectImport(pagePath, `import ${this.toPascalCase(sectionName)} from "./sections/${sectionName}";`);
      await this.injectComponent(pagePath, `${this.toPascalCase(sectionName)}()`, position);
    }

    logger.success(`Section "${sectionName}" added to project`);
  }

  private generateSectionComponent(name: string): string {
    const pascalName = this.toPascalCase(name);
    return `'use client';

import { motion } from 'framer-motion';

export default function ${pascalName}() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">${pascalName} Section</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Add your ${name} content here. Customize this component to match your needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
`;
  }

  async updateConfig(filePath: string, key: string, value: unknown): Promise<void> {
    const content = await readFile(filePath);
    try {
      const config = JSON.parse(content);
      config[key] = value;
      await writeFile(filePath, JSON.stringify(config, null, 2));
      logger.success(`Updated ${key} in ${path.basename(filePath)}`);
    } catch {
      logger.error(`Failed to update config in ${path.basename(filePath)}`);
    }
  }

  async addToArray(filePath: string, arrayPath: string, item: unknown): Promise<void> {
    const content = await readFile(filePath);
    try {
      const config = JSON.parse(content);
      const keys = arrayPath.split('.');
      let current = config;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      if (Array.isArray(current[keys[keys.length - 1]])) {
        current[keys[keys.length - 1]].push(item);
        await writeFile(filePath, JSON.stringify(config, null, 2));
        logger.success(`Added item to ${arrayPath} in ${path.basename(filePath)}`);
      }
    } catch {
      logger.error(`Failed to add item to ${arrayPath} in ${path.basename(filePath)}`);
    }
  }

  async updateProjectStyle(projectPath: string, style: string, primaryColor?: string): Promise<void> {
    const tailwindPath = path.join(projectPath, 'tailwind.config.ts');
    const cssPath = path.join(projectPath, 'app', 'globals.css');

    if (await fileExists(tailwindPath)) {
      const content = await readFile(tailwindPath);
      const updated = this.updateTailwindColor(content, primaryColor);
      await writeFile(tailwindPath, updated);
    }

    if (await fileExists(cssPath)) {
      const content = await readFile(cssPath);
      const updated = this.updateCSSVariables(content, primaryColor, style);
      await writeFile(cssPath, updated);
    }

    logger.success(`Updated project style to ${style}`);
  }

  private updateTailwindColor(content: string, primaryColor?: string): string {
    if (!primaryColor) return content;
    const hslMatch = primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      const primaryHSL = `hsl(${h}, ${s}%, ${l}%)`;
      const secondaryHSL = `hsl(${(parseInt(h) + 30) % 360}, ${s}%, ${l}%)`;
      return content.replace(
        /primary:\s*["'][^"']+["']/,
        `primary: "${primaryHSL}"`
      ).replace(
        /secondary:\s*["'][^"']+["']/,
        `secondary: "${secondaryHSL}"`
      );
    }
    return content;
  }

  private updateCSSVariables(content: string, primaryColor?: string, style?: string): string {
    if (primaryColor) {
      const hslMatch = primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const [, h, s, l] = hslMatch;
        content = content.replace(/--primary:\s*[^;]+;/, `--primary: hsl(${h} ${s}% ${l}%);`);
        content = content.replace(/--primary-foreground:\s*[^;]+;/, `--primary-foreground: hsl(${h} ${s}% ${Math.min(parseInt(l) + 90, 99)}%);`);
      }
    }
    return content;
  }

  async addDarkMode(projectPath: string): Promise<void> {
    const componentsDir = path.join(projectPath, 'components');
    const uiDir = path.join(componentsDir, 'ui');
    await ensureDir(uiDir);

    const themeProvider = `'use client';

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`;

    const modeToggle = `'use client';

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
`;

    await writeFile(path.join(componentsDir, 'theme-provider.tsx'), themeProvider);
    await writeFile(path.join(componentsDir, 'mode-toggle.tsx'), modeToggle);

    const layoutPath = path.join(projectPath, 'app', 'layout.tsx');
    if (await fileExists(layoutPath)) {
      const layoutContent = await readFile(layoutPath);
      if (!layoutContent.includes('ThemeProvider')) {
        const updated = layoutContent
          .replace(
            "import './globals.css'",
            "import './globals.css'\nimport { ThemeProvider } from '@/components/theme-provider'"
          )
          .replace(
            '<body',
            '<body\n        suppressHydrationWarning'
          )
          .replace(
            '{children}',
            '<ThemeProvider\n            attribute="class"\n            defaultTheme="system"\n            enableSystem\n            disableTransitionOnChange\n          >\n            {children}\n          </ThemeProvider>'
        );
        await writeFile(layoutPath, updated);
      }
    }

    const cssPath = path.join(projectPath, 'app', 'globals.css');
    if (await fileExists(cssPath)) {
      const cssContent = await readFile(cssPath);
      if (!cssContent.includes('.dark')) {
        const darkModeCSS = `

/* Dark mode styles */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
`;
        await writeFile(cssPath, cssContent + darkModeCSS);
      }
    }

    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fileExists(packageJsonPath)) {
      const pkg = JSON.parse(await readFile(packageJsonPath));
      pkg.dependencies['next-themes'] = '^0.3.0';
      await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
    }

    logger.success('Dark mode added to project');
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

export const injector = new Injector();
