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
  <strong>Generate production-grade UI systems in seconds</strong>
</p>

<p align="center">
  Next.js • Tailwind CSS • Framer Motion • TypeScript • shadcn/ui • AI-Powered
</p>

---

## Quick Start

```bash
npx uiforge create saas my-app
cd my-app
npm install
npm run dev
```

**With AI-powered copy:**
```bash
npx uiforge create saas my-app --ai
```

---

## Features

- **7 Production Templates** - SaaS, Portfolio, Dashboard, Marketplace, Agency, AI Product, Premium Landing
- **AI-Powered Copy** - Generate marketing copy with Ollama (local) or Groq (cloud)
- **Premium Animations** - Framer Motion animations out of the box
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling with design tokens
- **Git Init** - Auto-initialize git repositories
- **Deploy Ready** - One-command deployment to Vercel/Netlify

---

## CLI Commands

### Create a project
```bash
npx uiforge create <template> [options]

Options:
  -n, --name <name>       Project name
  -o, --output <dir>      Output directory
  -s, --sections          Specific sections
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
npx uiforge demo              # Create demo project
npx uiforge init              # Initialize Next.js project
npx uiforge theme             # Manage design system
```

---

## Available Templates

| Template | Description | Tags |
|----------|-------------|------|
| **saas** | Conversion-focused landing | saas, startup, product |
| **portfolio** | Creative showcase | portfolio, creative |
| **dashboard** | Analytics admin | dashboard, admin |
| **marketplace** | Multi-vendor e-commerce | marketplace, ecommerce |
| **agency** | Professional services | agency, business |
| **ai-product** | AI capabilities showcase | ai, ml, tech |
| **premium-landing** | Full-featured landing | landing, premium |

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
├── design-system/           # Design tokens
├── ai/                     # Ollama + Groq providers
├── utils/                  # Logger, FS utilities
└── examples/               # Example projects
    ├── saas-demo/
    ├── portfolio-demo/
    ├── dashboard-demo/
    └── agency-demo/
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
