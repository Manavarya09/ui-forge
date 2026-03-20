# Contributing to UIForge

Thank you for your interest in contributing to UIForge!

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ui-forge.git
   cd ui-forge
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Manavarya09/ui-forge.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**

6. **Build and test**
   ```bash
   npm run build
   node dist/cli/index.js --help
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type     | Description                              |
|----------|------------------------------------------|
| feat     | New feature                              |
| fix      | Bug fix                                 |
| docs     | Documentation only changes               |
| style    | Code style changes (formatting, etc.)    |
| refactor| Code change that neither fixes bug nor adds feature |
| perf     | Performance improvements                 |
| test     | Adding or updating tests                 |
| build    | Changes to build system or dependencies  |
| ci       | Changes to CI configuration              |
| chore    | Other changes that don't modify src/test |

### Examples

```
feat(cli): add --ai flag for AI-powered generation
fix(generator): resolve template copy path issue
docs(readme): update installation instructions
refactor(registry): simplify template lookup logic
```

## Pull Request Process

1. **Fill out the PR template** - Include description, related issue, and testing steps
2. **Link related issues** - Use keywords like "Fixes #123" or "Closes #456"
3. **Pass CI checks** - Ensure all tests and linting pass
4. **Get review** - At least one maintainer must approve
5. **Squash if needed** - We may ask you to squash commits

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` type
- Export types for public APIs
- Use interfaces for object shapes

### File Organization

```
cli/           # CLI entry points and command handlers
engine/        # Core generation logic
templates/     # UI templates
design-system/ # Design tokens and generators
ai/           # AI provider integrations
utils/        # Shared utilities
```

### Naming Conventions

- **Files**: kebab-case (e.g., `template-registry.ts`)
- **Classes**: PascalCase (e.g., `TemplateRegistry`)
- **Functions**: camelCase (e.g., `generateProject`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_TEMPLATE`)
- **Interfaces**: PascalCase with `I` prefix only when needed for disambiguation

### Error Handling

- Use descriptive error messages
- Include relevant context in errors
- Handle errors gracefully in CLI output

### CLI Output

- Use the logger utilities from `utils/logger.ts`
- Follow the existing output format
- Provide helpful error messages with suggestions

## Templates

### Creating a New Template

1. Create template directory: `templates/your-template/`
2. Add `layout.tsx` with root layout
3. Add `page.tsx` with main page
4. Add sections in `sections/` directory
5. Register template in `engine/registry.ts`

### Template Requirements

- Use TypeScript and React
- Include proper prop types
- Support dark mode when applicable
- Include responsive design
- Use framer-motion for animations

## Testing

### Running Tests

```bash
# Build the project
npm run build

# Test CLI locally
node dist/cli/index.js create premium-landing -n test-project
```

### Manual Testing Checklist

- [ ] CLI help displays correctly
- [ ] Project generation completes without errors
- [ ] Generated project builds successfully
- [ ] All template sections render properly
- [ ] Animations work smoothly
- [ ] Error messages are helpful

## Documentation

### Updating Docs

- Update README.md for user-facing changes
- Add JSDoc comments for public functions
- Update type definitions when adding new options

### Doc Style

- Use clear, concise language
- Include code examples where appropriate
- Explain the "why" not just the "what"

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be specific and provide reproduction steps

## Recognition

Contributors will be recognized in:
- Release notes
- Our Contributors page
- Social media (with permission)

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
