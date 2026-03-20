import path from "path";
import { fileURLToPath } from "url";
import { readdir, readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DesignLanguageTokens {
  colors: Record<string, string>;
  borderRadius: Record<string, string>;
  spacing: Record<string, string>;
}

export interface DesignLanguageTypography {
  fontFamily: Record<string, string[]>;
  fontSize: Record<string, [string, { lineHeight: string }]>;
  fontWeight: Record<string, string>;
  letterSpacing: Record<string, string>;
}

export interface DesignLanguageEffects {
  shadows: Record<string, string>;
  gradients: Record<string, string>;
  blur: Record<string, string>;
  transitions: Record<string, string>;
}

export interface DesignLanguageLayout {
  containerMaxWidth: string;
  sectionPadding: string;
  gridGap: string;
  cardPadding: string;
  navbarHeight: string;
  [key: string]: unknown;
}

export interface DesignLanguage {
  name: string;
  description: string;
  tokens: DesignLanguageTokens;
  typography: DesignLanguageTypography;
  effects: DesignLanguageEffects;
  layout: DesignLanguageLayout;
}

const registry: Map<string, DesignLanguage> = new Map();
let isInitialized = false;

async function initialize(): Promise<void> {
  if (isInitialized) return;

  const cliDir = path.dirname(__dirname);
  const projectRoot = path.dirname(cliDir);
  const designLangPath = path.join(projectRoot, "design-languages");

  try {
    const entries = await readdir(designLangPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const configPath = path.join(designLangPath, entry.name, "config.json");
        try {
          const content = await readFile(configPath, "utf-8");
          const config = JSON.parse(content) as DesignLanguage;
          registry.set(entry.name, config);
        } catch {
          // Skip invalid configs
        }
      }
    }
  } catch {
    // Directory doesn't exist yet
  }

  isInitialized = true;
}

export async function listStyles(): Promise<DesignLanguage[]> {
  await initialize();
  return Array.from(registry.values());
}

export async function getStyle(name: string): Promise<DesignLanguage | null> {
  await initialize();
  return registry.get(name) || null;
}

export async function styleExists(name: string): Promise<boolean> {
  await initialize();
  return registry.has(name);
}

export async function getDefaultStyle(): Promise<DesignLanguage> {
  const minimal = await getStyle("minimal");
  if (!minimal) {
    throw new Error('Default style "minimal" not found');
  }
  return minimal;
}

export function mergeTokens(
  base: DesignLanguageTokens,
  override: Partial<DesignLanguageTokens>
): DesignLanguageTokens {
  return {
    colors: { ...base.colors, ...override.colors },
    borderRadius: { ...base.borderRadius, ...override.borderRadius },
    spacing: { ...base.spacing, ...override.spacing },
  };
}

export function generateStyleCSSVariables(style: DesignLanguage): string {
  const { tokens, typography, effects } = style;

  let css = ":root {\n";

  css += "  /* Colors */\n";
  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --${cssVar}: ${value};\n`;
  }

  css += "\n  /* Border Radius */\n";
  for (const [key, value] of Object.entries(tokens.borderRadius)) {
    css += `  --radius-${key === "DEFAULT" ? "" : key}: ${value};\n`;
  }

  css += "\n  /* Spacing */\n";
  for (const [key, value] of Object.entries(tokens.spacing)) {
    css += `  --spacing-${key}: ${value};\n`;
  }

  css += "\n  /* Typography */\n";
  for (const [key, family] of Object.entries(typography.fontFamily)) {
    css += `  --font-${key}: ${family.join(", ")};\n`;
  }

  css += "\n  /* Effects */\n";
  for (const [key, value] of Object.entries(effects.shadows)) {
    css += `  --shadow-${key === "DEFAULT" ? "" : key}: ${value};\n`;
  }
  for (const [key, value] of Object.entries(effects.gradients)) {
    css += `  --gradient-${key}: ${value};\n`;
  }
  for (const [key, value] of Object.entries(effects.blur)) {
    css += `  --blur-${key}: ${value};\n`;
  }

  css += "}\n";

  return css;
}

export function generateStyleTailwindConfig(style: DesignLanguage): string {
  const { tokens, typography, effects, layout } = style;

  const colorEntries = Object.entries(tokens.colors)
    .map(([key, value]) => `        "${key}": "${value}"`)
    .join(",\n");

  const fontFamilyEntries = Object.entries(typography.fontFamily)
    .map(
      ([key, family]) =>
        `        "${key}": [${family.map(f => `"${f}"`).join(", ")}]`
    )
    .join(",\n");

  return `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
      fontFamily: {
${fontFamilyEntries}
      },
      borderRadius: {
${Object.entries(tokens.borderRadius)
  .map(
    ([key, value]) =>
      `        "${key === "DEFAULT" ? "DEFAULT" : key}": "${value}"`
  )
  .join(",\n")}
      },
      boxShadow: {
${Object.entries(effects.shadows)
  .map(
    ([key, value]) =>
      `        "${key === "DEFAULT" ? "DEFAULT" : key}": "${value}"`
  )
  .join(",\n")}
      },
      maxWidth: {
        container: "${layout.containerMaxWidth}",
      },
      spacing: {
${Object.entries(tokens.spacing)
  .map(([key, value]) => `        "${key}": "${value}"`)
  .join(",\n")}
      },
    },
  },
  plugins: [],
} satisfies Config;
`;
}

export const designLanguageRegistry = {
  listStyles,
  getStyle,
  styleExists,
  getDefaultStyle,
  mergeTokens,
  generateStyleCSSVariables,
  generateStyleTailwindConfig,
};
