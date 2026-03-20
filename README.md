# UIForge

UIForge is a production-grade CLI tool for generating premium, animation-rich UI systems using Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Premium Templates** - Curated, production-ready UI templates with modern design
- **Framer Motion Animations** - Smooth, professional animations out of the box
- **TypeScript** - Fully typed components for excellent developer experience
- **Tailwind CSS** - Utility-first styling with shadcn/ui design tokens
- **AI-Powered** - Optional AI features for copy generation (Ollama or Groq)
- **One-Command Setup** - From zero to production-ready UI in seconds

## Quick Start

```bash
npx uiforge create premium-landing -n my-project
cd my-project
npm install
npm run dev
```

## Installation

### Using npx (Recommended)

```bash
npx uiforge create premium-landing -n my-project
```

### Global Installation

```bash
npm install -g uiforge
uiforge create premium-landing -n my-project
```

## CLI Commands

### create

Generate a full UI system from a template.

```bash
uiforge create <template> [options]

Options:
  -n, --name <name>        Project name (default: my-app)
  -o, --output <dir>       Output directory (default: .)
  -s, --sections <list>    Specific sections to generate
  --ai                     Enable AI-powered copy generation

Examples:
  uiforge create premium-landing -n my-project
  uiforge create premium-landing -n my-project --ai
  uiforge create premium-landing -n my-project -s hero features pricing
```

### init

Initialize a new Next.js project with Tailwind CSS and shadcn/ui.

```bash
uiforge init [options]

Options:
  -n, --name <name>        Project name (default: my-app)
  -o, --output <dir>       Output directory (default: .)
```

### demo

Generate and preview a demo project.

```bash
uiforge demo [options]

Options:
  -n, --name <name>        Project name (default: uiforge-demo)
  -o, --output <dir>       Output directory (default: .)
```

### add

Add a section to an existing project.

```bash
uiforge add <section> [options]

Options:
  -o, --output <dir>       Project directory (default: .)
```

### theme generate

Generate design tokens and theme configuration.

```bash
uiforge theme generate
```

### ai

Run AI-powered features.

```bash
uiforge ai <task> [options]

Tasks:
  copy       Generate marketing copy
  suggest    Get section suggestions

Options:
  -p, --provider <name>   AI provider (ollama, groq)
```

### list

List available templates.

```bash
uiforge list
```

## Available Templates

### Premium Landing

A complete, production-ready landing page with:

- Responsive navigation with mobile menu
- Animated hero with gradient effects
- Staggered reveal animations for features
- Social proof with ratings
- Interactive pricing cards
- Links and social icons

## Project Structure

```
uiforge/
├── cli/                    # Commander CLI entry point
├── engine/                 # Core generation logic
│   ├── generator.ts       # Project generation
│   ├── injector.ts        # Component injection
│   └── registry.ts        # Template & AI management
├── templates/             # UI templates
│   └── premium-landing/  # Premium landing template
├── design-system/         # Design tokens & config
├── ai/                    # AI provider integrations
│   ├── ollama.ts         # Local Ollama support
│   └── groq.ts           # Free Groq API support
└── utils/                 # CLI utilities
```

## Tech Stack

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **Framer Motion** - Production-grade animations
- **Commander.js** - CLI framework

## AI Features

UIForge supports AI-powered features through two providers:

### Ollama (Local - Free)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# Start Ollama
ollama serve
```

### Groq (Cloud - Free Tier)

```bash
# Get your API key from https://console.groq.com
export GROQ_API_KEY=your-api-key
```

## Generated Project Structure

```
my-project/
├── app/
│   ├── globals.css        # Tailwind + custom styles
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   └── sections/          # Component sections
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/Manavarya09/ui-forge.git
cd ui-forge

# Install dependencies
npm install

# Build the CLI
npm run build

# Run locally
node dist/cli/index.js create premium-landing -n my-project
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and linting
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Run `npm run check` before committing
- Write meaningful commit messages

### Commit Guidelines

Commits should follow conventional commit format:

```
feat: add new template
fix: resolve template generation issue
docs: update README
refactor: improve CLI argument parsing
```

## Security

See [SECURITY.md](SECURITY.md) for our security policy and reporting guidelines.

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues** - Report bugs and feature requests via GitHub Issues
- **Discussions** - Ask questions and share ideas

## Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Commander.js](https://github.com/tj/commander.js)

---

For detailed documentation, visit our [wiki](https://github.com/Manavarya09/ui-forge/wiki).
