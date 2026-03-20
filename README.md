# UIForge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.1.0-6366f1?style=for-the-badge&labelColor=0a0a0a" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge&labelColor=0a0a0a" alt="License" />
  <img src="https://img.shields.io/badge/Node-18+-22c55e?style=for-the-badge&labelColor=0a0a0a" alt="Node" />
  <img src="https://img.shields.io/badge/NPM-@manavarya0909/ui-forge--cli-fc521f?style=for-the-badge&labelColor=0a0a0a" alt="npm" />
</p>

<p align="center">
  <strong>Generate production-grade UI systems with 12 design styles. One command to production-ready Next.js, Tailwind and Framer Motion code.</strong>
</p>

---

## Quick Start

### Installation

```bash
npm install -g @manavarya0909/ui-forge-cli
```

Or use with npx:

```bash
npx @manavarya0909/ui-forge-cli create saas my-app
```

### Create a Project

```bash
uiforge create saas my-app
uiforge create saas my-app --style glass
uiforge create saas my-app --style brutalism --ai
```

### Run the Project

```bash
cd my-app
npm install
npm run dev
```

---

## Features

- **12 Design Styles** - Glass, Brutalism, Minimal, Enterprise, Bento, Neumorphism, Flat, Material, Dark Minimal, Tech Futurism, Monochrome, Swiss
- **12 Production Templates** - SaaS, Portfolio, Dashboard, Marketplace, Agency, AI Product, Real Estate, E-Commerce, Fitness, Tactical Dashboard, Premium Landing
- **AI-Powered Copy** - Generate marketing copy with Ollama or Groq
- **Premium Animations** - Framer Motion animations included
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling with design tokens
- **shadcn/ui** - Beautiful, accessible components
- **Deploy Ready** - One-command deployment to Vercel or Netlify

---

## Design Styles

Apply a design language to any template for instant visual transformation:

| Style | Description |
|-------|-------------|
| `glass` | Frosted glass panels with soft transparency |
| `minimal` | Clean, minimalist design with generous whitespace |
| `brutalism` | Bold typography, strong grid, high contrast |
| `enterprise` | Clean, functional, professional design |
| `bento` | Modular, boxed layout with flexible cards |
| `neumorphism` | Soft shadows, subtle depth, tactile UI |
| `flat` | No depth effects, clean shapes |
| `material` | Layered UI, consistent spacing system |
| `dark-minimal` | Dark background, high contrast text |
| `tech-futurism` | Glow effects, gradients, sleek feel |
| `monochrome` | Single color with tonal variations |
| `swiss` | Strong grid system, clean typography |

### Examples

```bash
uiforge create saas my-app --style glass
uiforge create agency my-app --style brutalism
uiforge create saas-modern my-app --style bento
uiforge create portfolio my-app --style dark-minimal
uiforge create ai-product my-app --style tech-futurism
```

---

## Templates

| Template | Description | Tags |
|----------|-------------|------|
| **saas** | Conversion-focused landing with pricing and testimonials | saas, startup, product |
| **saas-modern** | Modern SaaS with bento grid and dashboard preview | saas, modern, bento |
| **portfolio** | Creative portfolio with case studies and contact | portfolio, creative |
| **dashboard** | Analytics admin with charts and data tables | dashboard, admin, analytics |
| **marketplace** | Multi-vendor e-commerce landing | marketplace, ecommerce |
| **agency** | Professional services with portfolio | agency, business |
| **ai-product** | AI capabilities showcase | ai, ml, tech |
| **real-estate** | 3D property showcase | real-estate, 3d |
| **ecommerce** | Full e-commerce dashboard | ecommerce, shop |
| **fitness** | Bold gym landing with programs | fitness, gym |
| **tactical-dashboard** | Military-inspired operations center | dashboard, tactical |
| **premium-landing** | Full-featured landing with animations | landing, premium |

### Examples

```bash
uiforge create saas my-saas --style glass
uiforge create portfolio my-portfolio --style minimal
uiforge create dashboard my-dashboard --style enterprise
uiforge create ai-product my-ai --style tech-futurism
uiforge create ecommerce my-shop --style material
```

---

## CLI Commands

### Global Options

```bash
uiforge --version    # Show version
uiforge --help       # Show help
```

### Create Command

```bash
uiforge create [template] [name] [options]

Aliases: c, new

Options:
  -n, --name <name>             Project name (default: my-app)
  -o, --output <dir>            Output directory (default: current directory)
  -s, --sections <sections>     Specific sections to generate
  --style <style>               Design style (minimal, glass, brutalism, etc.)
  --ai                          Enable AI-powered copy generation
  --git                         Initialize git repository
  --install                     Auto-install dependencies
  --color <hex>                 Primary color (hex)
  --font <font>                 Google Font name
  -i, --interactive             Interactive selection mode
```

### List Command

```bash
uiforge list                    # List all templates
uiforge ls                     # Alias
uiforge templates              # Alias
uiforge list --json            # JSON output
```

### Styles Command

```bash
uiforge styles                 # List all design styles
uiforge style                  # Alias
uiforge styles --json          # JSON output
```

### Preview Command

```bash
uiforge preview [template]     # Preview template in browser
uiforge preview --template saas --style glass
```

### Init Command

```bash
uiforge init                   # Initialize Next.js project
uiforge init -n my-app --git  # With git init
```

### Deploy Command

```bash
uiforge deploy                 # Deploy to Vercel (default)
uiforge deploy --provider netlify  # Deploy to Netlify
```

### Other Commands

```bash
uiforge demo                   # Generate demo project
uiforge add <section>          # Add a section
uiforge theme                  # Manage design system
uiforge components             # Browse components
uiforge audit                  # Accessibility audit
uiforge test                   # Setup tests
```

---

## AI Features

### Setup

#### Ollama (Local - Free)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

#### Groq (Cloud - Free Tier)

```bash
export GROQ_API_KEY=your-api-key
```

### AI Commands

```bash
uiforge ai copy          # Generate marketing copy
uiforge ai suggest       # Get section suggestions
uiforge create saas my-app --ai
```

---

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
git clone https://github.com/anomalyco/ui-forge.git
cd ui-forge
npm install
npm run build
```

### Run Locally

```bash
npm run dev
# or
node dist/cli/index.js create saas my-app
```

### Project Structure

```
uiforge/
├── cli/                      # Commander.js CLI
│   └── index.ts              # CLI entry point
├── engine/                   # Generation engine
│   ├── generator.ts          # Project generation
│   ├── registry.ts           # Template registry
│   ├── components.ts         # Component system
│   ├── injector.ts           # Code injection
│   └── testing.ts            # Test generation
├── templates/                # Source templates
├── design-languages/         # Design language configs
├── design-system/           # Design tokens
├── ai/                      # AI providers
├── utils/                   # Utilities
└── examples/                # Example projects
```

---

## Usage Examples

### Basic Usage

```bash
uiforge create saas my-saas
uiforge create portfolio my-portfolio
uiforge create dashboard my-dashboard
```

### With Design Styles

```bash
uiforge create saas my-app --style glass
uiforge create agency my-agency --style brutalism
uiforge create portfolio my-portfolio --style minimal
uiforge create dashboard my-dash --style enterprise
uiforge create saas-modern my-app --style bento
```

### With Options

```bash
uiforge create saas my-app -n "my-project" -o ./projects
uiforge create saas my-app --git
uiforge create saas my-app --install
uiforge create saas my-app --color #6366f1
uiforge create saas my-app --font Inter
uiforge create --interactive
```

### Combined Examples

```bash
uiforge create saas my-app --style glass --color #8b5cf6 --font Inter --git --install --ai

uiforge create portfolio my-portfolio --style minimal --git

uiforge create dashboard my-dashboard --style enterprise --install
```

---

## Architecture

### Design System Generation

When you run `uiforge create`, the engine:

1. Loads Template - Copies template files to output directory
2. Loads Design Style - Reads design language config
3. Generates Tokens - Creates Tailwind config from design tokens
4. Generates CSS Variables - Creates CSS custom properties
5. Applies Style - Overwrites template configs with generated design system
6. Done - Production-ready project with chosen design style

### Design Language Config

```json
{
  "name": "glass",
  "description": "Frosted glass panels with soft transparency",
  "tokens": {
    "colors": {
      "background": "rgba(255, 255, 255, 0.1)",
      "primary": "#8b5cf6"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": ["Plus Jakarta Sans", "system-ui"]
    }
  },
  "effects": {
    "shadows": {
      "glass": "0 8px 32px rgba(0, 0, 0, 0.3)"
    }
  }
}
```

---

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Headless components

---

<p align="center">
  Built by <a href="https://github.com/Manavarya09">Manav Arya Singh</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@manavarya0909/ui-forge-cli">
    <img src="https://img.shields.io/npm/dt/@manavarya0909/ui-forge-cli?style=for-the-badge&labelColor=0a0a0a" alt="npm downloads" />
  </a>
</p>
