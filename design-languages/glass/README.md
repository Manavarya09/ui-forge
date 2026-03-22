# Glass Design Language

## Overview
Frosted glass panels with soft transparency, blurred backgrounds, and layered depth. Creates a modern, ethereal look.

## Characteristics

### Visual Style
- **Transparency**: Semi-transparent backgrounds (rgba)
- **Blur**: Backdrop blur effects (16px default)
- **Layers**: Multiple glass panels with depth
- **Borders**: Subtle white/light borders

### Use Cases
- Modern web apps
- Dashboards
- Mobile-first designs
- Tech/SaaS products

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | rgba(255, 255, 255, 0.1) | Glass panels |
| backgroundSolid | #1a1a2e | Solid fallback |
| primary | #8b5cf6 | Actions |
| secondary | rgba(255, 255, 255, 0.15) | Cards |
| glassTint | rgba(255, 255, 255, 0.05) | Subtle tint |

## Typography

- **Font Family**: Plus Jakarta Sans
- **Monospace**: Fira Code
- **Serif**: Cormorant Garamond

## Effects

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradients
- Primary: `linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)`
- Background: `linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.95) 100%)`

## Getting Started

```bash
npx uiforge create my-app --style glass
```

## Example Component

```tsx
<div className="glass-panel">
  <h1>Glass Card</h1>
  <p>Frosted glass effect</p>
</div>

<style>{`
  .glass-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 2rem;
  }
`}</style>
```