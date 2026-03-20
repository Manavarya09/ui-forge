# UIForge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-6366f1?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Node-18+-22c55e?style=for-the-badge" alt="Node" />
  <a href="https://twitter.com/intent/follow?screen_name=manavarya09">
    <img src="https://img.shields.io/twitter/follow/manavarya09?style=for-the-badge&logo=twitter" alt="Follow on Twitter" />
  </a>
</p>

<p align="center">
  <strong>Generate production-grade UI systems with AI-powered design language styles</strong>
</p>

<p align="center">
  Next.js • Tailwind CSS • Framer Motion • TypeScript • shadcn/ui • AI-Powered • Design Languages
</p>

---

## Quick Start

```bash
npx uiforge create saas my-app
cd my-app
npm install
npm run dev
```

**With Design Language Style:**

```bash
npx uiforge create saas my-app --style glass
```

**With AI-powered copy:**

```bash
npx uiforge create saas my-app --ai
```

---

## Features

- **12 Design Language Styles** - Choose from minimal, glass, brutalism, enterprise, bento, neumorphism, flat, material, dark-minimal, tech-futurism, monochrome, and swiss
- **7 Production Templates** - SaaS, Portfolio, Dashboard, Marketplace, Agency, AI Product, Premium Landing
- **AI-Powered Copy** - Generate marketing copy with Ollama (local) or Groq (cloud)
- **Premium Animations** - Framer Motion animations out of the box
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling with design tokens
- **Git Init** - Auto-initialize git repositories
- **Deploy Ready** - One-command deployment to Vercel/Netlify

---

## Design Language Styles

Apply a design language to any template for instant visual transformation:

| Style           | Description                                       |
| --------------- | ------------------------------------------------- |
| `minimal`       | Clean, minimalist design with generous whitespace |
| `glass`         | Frosted glass panels with soft transparency       |
| `brutalism`     | Bold typography, strong grid, high contrast       |
| `enterprise`    | Clean, functional, professional design            |
| `bento`         | Modular, boxed layout with flexible cards         |
| `neumorphism`   | Soft shadows, subtle depth, tactile UI            |
| `flat`          | No depth effects, clean shapes                    |
| `material`      | Layered UI, consistent spacing system             |
| `dark-minimal`  | Dark background, high contrast text               |
| `tech-futurism` | Glow effects, gradients, sleek feel               |
| `monochrome`    | Single color with tonal variations                |
| `swiss`         | Strong grid system, clean typography              |

---

## CLI Commands

### Create a project

```bash
npx uiforge create <template> [options]

Options:
  -n, --name <name>       Project name
  -o, --output <dir>      Output directory
  -s, --sections          Specific sections
  --style <style>         Design language style (default: minimal)
  --ai                    Enable AI copy generation
  --git                   Initialize git repo
  --install               Auto-install dependencies
  --color <hex>           Primary color
  --font <font>           Google Font
```

### Preview in browser

```bash
npx uiforge preview --template saas
```

### List available styles

```bash
npx uiforge styles
```

### Deploy

```bash
npx uiforge deploy --provider vercel
npx uiforge deploy --provider netlify
```

### AI Features

```bash
npx uiforge ai copy          # Generate marketing copy
npx uiforge ai suggest       # Get section suggestions
```

### Other commands

```bash
npx uiforge list             # List all templates
npx uiforge demo             # Create demo project
npx uiforge init             # Initialize Next.js project
npx uiforge theme            # Manage design system
```

---

## Available Templates

| Template            | Description                 | Tags                   |
| ------------------- | --------------------------- | ---------------------- |
| **saas**            | Conversion-focused landing  | saas, startup, product |
| **saas-modern**     | Modern SaaS with bento grid | saas, modern, bento    |
| **portfolio**       | Creative showcase           | portfolio, creative    |
| **dashboard**       | Analytics admin             | dashboard, admin       |
| **marketplace**     | Multi-vendor e-commerce     | marketplace, ecommerce |
| **agency**          | Professional services       | agency, business       |
| **ai-product**      | AI capabilities showcase    | ai, ml, tech           |
| **premium-landing** | Full-featured landing       | landing, premium       |

---

## Example Usage

```bash
# Minimal style (default)
npx uiforge create saas my-app

# Glass morphism style
npx uiforge create saas my-app --style glass

# Brutalist design
npx uiforge create saas my-app --style brutalism

# Bento grid layout
npx uiforge create saas my-app --style bento

# Dark minimal
npx uiforge create saas my-app --style dark-minimal

# With AI copy generation
npx uiforge create saas my-app --style glass --ai
```

---

## AI Setup

### Ollama (Local - Free)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

### Groq (Cloud - Free Tier)

```bash
export GROQ_API_KEY=your-api-key
```

---

## Architecture

```
uiforge/
├── cli/                    # Commander.js CLI
├── engine/                 # Generation engine
│   ├── generator.ts        # Project generation
│   └── registry.ts         # Template registry + AI
├── templates/              # Source templates
├── design-languages/       # Design language configs
├── design-system/          # Design tokens
├── ai/                     # Ollama + Groq providers
├── utils/                  # Logger, FS utilities
└── examples/               # Example projects
```

---

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **Framer Motion** - Animations
- **Commander.js** - CLI

---

## Development

```bash
# Clone
git clone https://github.com/Manavarya09/ui-forge.git
cd ui-forge

# Install
npm install

# Build
npm run build

# Run
node dist/cli/index.js create saas my-app
```

---

## License

MIT © [Manav Arya Singh](https://github.com/Manavarya09)

---

<p align="center">
  <strong>Built with ❤️</strong>
</p>
