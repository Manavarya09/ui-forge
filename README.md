# UIForge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.4.0-6366f1?style=for-the-badge&labelColor=0a0a0a" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge&labelColor=0a0a0a" alt="License" />
  <img src="https://img.shields.io/badge/Node-18+-22c55e?style=for-the-badge&labelColor=0a0a0a" alt="Node" />
</p>

<p align="center">
  <strong>Build production-grade UI systems and backends in seconds. Frontend with Next.js + Tailwind | Backend with Express + Database</strong>
</p>

---

## 🚀 Quick Start

### One Command - Complete Project

```bash
npx uiforge
```

That's it! The interactive CLI will guide you through:
1. **Choose template** (Frontend, Backend, or Full Stack)
2. **Select design language** (12 styles - or skip)
3. **Pick database** (for backend/fullstack)
4. **Choose auth** (optional)
5. **Auto-push to GitHub** (optional)

---

## 📦 Installation

### Using npx (Recommended)
```bash
npx uiforge create saas-modern my-app
```

### Install Globally
```bash
npm install -g @manavarya0909/ui-forge-cli
uiforge create saas-modern my-app
```

---

## 🎯 All Features

### Frontend Templates
- **12 Design Styles**: glass, minimal, brutalism, enterprise, bento, neumorphism, flat, material, dark-minimal, tech-futurism, monochrome, swiss
- **Production Ready**: Next.js 14, Tailwind CSS, Framer Motion, shadcn/ui components

### Backend Features
- **Full Code Generation** - Not just configs! Complete API with:
  - Express.js server setup
  - RESTful routes (auth, users, products)
  - Middleware (error handling, auth)
  - Database integration (Prisma/Drizzle)
  - TypeScript throughout
- **Authentication**: Clerk, NextAuth.js, Supabase Auth
- **Databases**: PostgreSQL, MongoDB (via Prisma/Drizzle)

### AI-Powered
- **Design Language Application**: AI applies chosen design to template automatically
- **Smart Copy Generation**: Marketing content via Ollama or Groq

### Developer Experience
- **GitHub Push**: Auto-initialize and push to GitHub
- **Auto Install**: Dependencies installed automatically
- **TypeScript**: Full type safety everywhere

---

## 💻 Usage Examples

### Interactive Mode (Recommended)
```bash
npx uiforge
# CLI prompts for all choices
```

### Create Frontend Only
```bash
npx uiforge create saas-modern my-app --style glass
```

### Create Backend with Database
```bash
npx uiforge backend my-api --database prisma --auth nextauth
```

### Full Stack with GitHub Push
```bash
npx uiforge app --name my-fullstack --database prisma --push --git
```

### Quick Create
```bash
# Create with all defaults
npx uiforge create saas my-app

# Create with design style
npx uiforge create saas my-app --style glass

# Create with options
npx uiforge create saas my-app --style brutalism --git --install
```

---

## 📋 CLI Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `npx uiforge` | Interactive mode (recommended) |
| `npx uiforge app` | Full-stack generator |
| `npx uiforge create [template]` | Create frontend project |
| `npx uiforge backend [name]` | Create backend API |
| `npx uiforge list` | List all templates |
| `npx uiforge styles` | List design styles |

### Options

```bash
# Template options
--style <style>        Design style (minimal, glass, brutalism, etc.)
--color <hex>         Primary color
--font <font>         Google Font
--dark                Enable dark mode

# Project options
-n, --name <name>     Project name
-o, --output <dir>    Output directory

# Backend options
-d, --database <db>   Database: prisma, drizzle, mongodb
-a, --auth <auth>     Auth: clerk, nextauth, supabase

# Automation options
--git                 Initialize git
--push                Push to GitHub
--install             Auto-install dependencies

# AI options
--ai                  Enable AI copy generation
--api-key <key>       AI API key for design language
```

### Examples

```bash
# Frontend with design style
uiforge create saas-modern my-app --style glass

# Frontend with all options
uiforge create portfolio my-portfolio --style minimal --git --install

# Backend with database
uiforge backend my-api --database prisma

# Full stack
uiforge app --name my-app --database prisma --auth nextauth --push
```

---

## 🎨 Design Styles

| Style | Description | Best For |
|-------|-------------|----------|
| `glass` | Frosted glass, transparency | Modern apps |
| `minimal` | Clean whitespace | Portfolios |
| `brutalism` | Bold, high contrast | Creative sites |
| `enterprise` | Professional, structured | Business apps |
| `bento` | Grid boxes layout | Dashboards |
| `neumorphism` | Soft shadows | Mobile apps |
| `material` | Layered UI | Android-style |
| `dark-minimal` | Dark theme | Developer tools |
| `tech-futurism` | Neon, glow effects | Tech products |
| `monochrome` | Single color tones | Sophisticated |
| `swiss` | Grid typography | Minimal brands |
| `flat` | No depth | Simple apps |

### View Design Docs
```bash
uiforge styles --docs
```

---

## 📂 Templates

### Frontend Templates
- `saas` - SaaS landing with pricing
- `saas-modern` - Modern bento-style SaaS
- `portfolio` - Creative portfolio
- `dashboard` - Analytics dashboard
- `marketplace` - E-commerce landing
- `agency` - Business services
- `ai-product` - AI product showcase
- `real-estate` - Property showcase
- `ecommerce` - Shop dashboard
- `fitness` - Gym landing
- `tactical-dashboard` - Operations center
- `premium-landing` - Full-featured

### Backend Templates
- `api-express` - Express.js REST API
- `api-next` - Next.js API routes

---

## 🗄️ Backend Generation

### What's Generated (Full Code, Not Configs!)

```
src/
├── index.ts              # Express server
├── routes/
│   ├── auth.ts          # Login/register endpoints
│   ├── user.ts          # CRUD for users
│   └── product.ts       # CRUD for products
├── middleware/
│   ├── auth.ts          # JWT authentication
│   └── errorHandler.ts  # Error handling
├── utils/
│   └── helpers.ts       # Utility functions
└── tests/
    └── auth.test.ts     # Test file

prisma/
└── schema.prisma        # Database schema

package.json             # Dependencies + scripts
tsconfig.json           # TypeScript config
.env.example            # Environment variables
```

### API Endpoints Created

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users` | List users |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

## 🔧 Development

### Run Locally
```bash
git clone https://github.com/Manavarya09/ui-forge.git
cd ui-forge
npm install
npm run build
npm run dev
```

---

## 🤖 AI Setup

### Option 1: Ollama (Local - Free)
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama serve
```

### Option 2: Groq (Cloud - Free Tier)
```bash
export GROQ_API_KEY=your-key
```

---

## 📝 Project Structure

```
ui-forge/
├── cli/                 # CLI commands
├── engine/              # Code generation
├── templates/           # Frontend templates
├── design-languages/    # 12 design styles
│   └── <style>/README.md
├── design-system/       # Tailwind tokens
├── ai/                  # AI providers
└── utils/               # Helpers
```

---

## ⚡ Quick Reference Card

```bash
# Interactive (recommended)
npx uiforge

# Create frontend
npx uiforge create saas-modern my-app --style glass

# Create backend
npx uiforge backend my-api --database prisma

# Full stack
npx uiforge app --database prisma --push

# List all
npx uiforge list
npx uiforge styles

# Deploy
npx uiforge deploy --provider vercel
```

---

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Manavarya09">Manav Arya Singh</a>
</p>