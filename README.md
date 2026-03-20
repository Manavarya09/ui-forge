# UIForge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.1.0-6366f1?style=for-the-badge&labelColor=0a0a0a" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge&labelColor=0a0a0a" alt="License" />
  <img src="https://img.shields.io/badge/Node-18+-22c55e?style=for-the-badge&labelColor=0a0a0a" alt="Node" />
  <img src="https://img.shields.io/badge/NPM-@manavarya0909/ui-forge--cli-fc521f?style=for-the-badge&labelColor=0a0a0a" alt="npm" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/anomalyco/ui-forge/main/.github/banner.gif" alt="UIForge Banner" width="100%" />
</p>

<p align="center">
  <strong>Generate production-grade UI systems with 12 design styles. One command to production-ready Next.js, Tailwind & Framer Motion code.</strong>
</p>

<br />

<p align="center">
  <a href="#quick-start"><strong>Quick Start</strong></a> •
  <a href="#-12-design-styles"><strong>Design Styles</strong></a> •
  <a href="#-templates"><strong>Templates</strong></a> •
  <a href="#cli-commands"><strong>CLI Commands</strong></a> •
  <a href="#ai-features"><strong>AI Features</strong></a> •
  <a href="#development"><strong>Development</strong></a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **12 Design Styles** | Glass, Brutalism, Minimal, Enterprise, Bento, Neumorphism, Flat, Material, Dark Minimal, Tech Futurism, Monochrome, Swiss |
| 📋 **12 Production Templates** | SaaS, Portfolio, Dashboard, Marketplace, Agency, AI Product, Real Estate, E-Commerce, Fitness, Tactical Dashboard & more |
| 🤖 **AI-Powered Copy** | Generate marketing copy with Ollama (local) or Groq (cloud) |
| ⚡ **Instant Generation** | Full UI system in seconds, not days |
| 🎭 **Premium Animations** | Framer Motion animations out of the box |
| 🔷 **TypeScript** | Full type safety throughout |
| 🎨 **Tailwind CSS** | Utility-first styling with design tokens |
| 📦 **shadcn/ui** | Beautiful, accessible components |
| 🚀 **Deploy Ready** | One-command deployment to Vercel/Netlify |

---

## 🚀 Quick Start

### Install (One Command)

```bash
npm install -g @manavarya0909/ui-forge-cli
```

Or use directly with npx:

```bash
npx @manavarya0909/ui-forge-cli create saas my-app
```

### Create Your First Project

```bash
# Basic
uiforge create saas my-app

# With design style
uiforge create saas my-app --style glass

# With AI copy
uiforge create saas my-app --style brutalism --ai
```

### Run Your Project

```bash
cd my-app
npm install
npm run dev
```

---

## 🎨 12 Design Styles

Apply a design language to any template for instant visual transformation:

| Style | Description | Preview |
|-------|-------------|---------|
| `glass` | Frosted glass panels with soft transparency | ![glass](https://img.shields.io/badge/-glass-8b5cf6?style=flat) |
| `minimal` | Clean, minimalist design with generous whitespace | ![minimal](https://img.shields.io/badge/-minimal-6366f1?style=flat) |
| `brutalism` | Bold typography, strong grid, high contrast | ![brutalism](https://img.shields.io/badge/-brutalism-ef4444?style=flat) |
| `enterprise` | Clean, functional, professional design | ![enterprise](https://img.shields.io/badge/-enterprise-3b82f6?style=flat) |
| `bento` | Modular, boxed layout with flexible cards | ![bento](https://img.shields.io/badge/-bento-f97316?style=flat) |
| `neumorphism` | Soft shadows, subtle depth, tactile UI | ![neumorphism](https://img.shields.io/badge/-neumorphism-a855f7?style=flat) |
| `flat` | No depth effects, clean shapes | ![flat](https://img.shields.io/badge/-flat-22c55e?style=flat) |
| `material` | Layered UI, consistent spacing system | ![material](https://img.shields.io/badge/-material-06b6d4?style=flat) |
| `dark-minimal` | Dark background, high contrast text | ![dark-minimal](https://img.shields.io/badge/-dark--minimal-e5e5e5?style=flat) |
| `tech-futurism` | Glow effects, gradients, sleek feel | ![tech-futurism](https://img.shields.io/badge/-tech--futurism-22d3ee?style=flat) |
| `monochrome` | Single color with tonal variations | ![monochrome](https://img.shields.io/badge/-monochrome-71717a?style=flat) |
| `swiss` | Strong grid system, clean typography | ![swiss](https://img.shields.io/badge/-swiss-fafafa?style=flat&color=000) |

### Style Examples

```bash
# Glass Morphism
uiforge create saas my-app --style glass

# Brutalist Design
uiforge create agency my-app --style brutalism

# Bento Grid
uiforge create saas-modern my-app --style bento

# Dark Minimal
uiforge create portfolio my-app --style dark-minimal

# Tech Futurism
uiforge create ai-product my-app --style tech-futurism
```

---

## 📋 12 Templates

| Template | Description | Tags |
|----------|-------------|------|
| **saas** | Conversion-focused landing with pricing & testimonials | `saas` `startup` `product` |
| **saas-modern** | Modern SaaS with bento grid, dashboard preview | `saas` `modern` `bento` |
| **portfolio** | Creative portfolio with case studies & contact | `portfolio` `creative` |
| **dashboard** | Analytics admin with charts & data tables | `dashboard` `admin` `analytics` |
| **marketplace** | Multi-vendor e-commerce landing | `marketplace` `ecommerce` |
| **agency** | Professional services with portfolio | `agency` `business` |
| **ai-product** | AI capabilities showcase | `ai` `ml` `tech` |
| **real-estate** | 3D property showcase | `real-estate` `3d` |
| **ecommerce** | Full e-commerce dashboard | `ecommerce` `shop` |
| **fitness** | Bold gym landing with programs | `fitness` `gym` |
| **tactical-dashboard** | Military-inspired operations center | `dashboard` `tactical` |
| **premium-landing** | Full-featured landing with animations | `landing` `premium` |

### Template Examples

```bash
# SaaS Landing
uiforge create saas my-saas --style glass

# Creative Portfolio
uiforge create portfolio my-portfolio --style minimal

# Admin Dashboard
uiforge create dashboard my-dashboard --style enterprise

# AI Product
uiforge create ai-product my-ai --style tech-futurism

# E-Commerce
uiforge create ecommerce my-shop --style material
```

---

## 💻 CLI Commands

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

## 🤖 AI Features

### Setup

#### Ollama (Local - Free)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# Start server
ollama serve
```

#### Groq (Cloud - Free Tier)

```bash
export GROQ_API_KEY=your-api-key
```

### AI Commands

```bash
# Generate marketing copy
uiforge ai copy

# Get section suggestions
uiforge ai suggest

# With project
uiforge create saas my-app --ai
```

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/anomalyco/ui-forge.git
cd ui-forge

# Install dependencies
npm install

# Build the project
npm run build
```

### Run Locally

```bash
# Using npm
npm run dev

# Or directly
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
│   ├── saas/
│   ├── portfolio/
│   ├── dashboard/
│   └── ...
├── design-languages/         # Design language configs
│   ├── minimal/
│   ├── glass/
│   ├── brutalism/
│   └── ...
├── design-system/           # Design tokens
│   ├── tokens.ts
│   └── tailwind-generator.ts
├── ai/                      # AI providers
│   ├── ollama.ts
│   ├── groq.ts
│   └── provider.ts
├── utils/                   # Utilities
│   ├── logger.ts            # CLI logger
│   └── fs.ts                # File system helpers
└── examples/                # Example projects
```

---

## 🎯 Usage Examples

### Basic Usage

```bash
# Create a SaaS landing page
uiforge create saas my-saas

# Create a portfolio
uiforge create portfolio my-portfolio

# Create a dashboard
uiforge create dashboard my-dashboard
```

### With Design Styles

```bash
# Glass morphism
uiforge create saas my-app --style glass

# Brutalist
uiforge create agency my-agency --style brutalism

# Minimal
uiforge create portfolio my-portfolio --style minimal

# Enterprise
uiforge create dashboard my-dash --style enterprise

# Bento
uiforge create saas-modern my-app --style bento
```

### With Options

```bash
# Custom name and output
uiforge create saas my-app -n "my-project" -o ./projects

# With git init
uiforge create saas my-app --git

# With auto-install
uiforge create saas my-app --install

# Custom color
uiforge create saas my-app --color #6366f1

# Custom font
uiforge create saas my-app --font Inter

# Interactive mode
uiforge create --interactive
```

### Combined Examples

```bash
# Full power
uiforge create saas my-app \
  --style glass \
  --color #8b5cf6 \
  --font Inter \
  --git \
  --install \
  --ai

# Portfolio with minimal style
uiforge create portfolio my-portfolio \
  --style minimal \
  --git

# Dashboard with enterprise style
uiforge create dashboard my-dashboard \
  --style enterprise \
  --install
```

---

## 📊 Architecture

### Design System Generation

When you run `uiforge create`, the engine:

1. **Loads Template** - Copies template files to output directory
2. **Loads Design Style** - Reads design language config (colors, typography, effects)
3. **Generates Tokens** - Creates Tailwind config from design tokens
4. **Generates CSS Variables** - Creates CSS custom properties
5. **Applies Style** - Overwrites template configs with generated design system
6. **Done** - Production-ready project with chosen design style

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Headless components

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Manavarya09">Manav Arya Singh</a></strong>
</p>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=manavarya09">
    <img src="https://img.shields.io/twitter/follow/manavarya09?style=social&logo=twitter" alt="Follow on Twitter" />
  </a>
  <a href="https://github.com/Manavarya09">
    <img src="https://img.shields.io/github/followers/Manavarya09?style=social&logo=github" alt="Follow on GitHub" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@manavarya0909/ui-forge-cli">
    <img src="https://img.shields.io/npm/dt/@manavarya0909/ui-forge-cli?style=for-the-badge&labelColor=0a0a0a" alt="npm downloads" />
  </a>
</p>
