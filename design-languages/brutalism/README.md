# Brutalism Design Language

## Overview
Bold, raw aesthetic with high contrast, solid colors, and unconventional layouts. Defies traditional design rules.

## Characteristics

### Visual Style
- **Contrast**: High contrast, often black/white with bold accent colors
- **Shapes**: Sharp edges, no border-radius
- **Typography**: Bold, often large, sometimes monospace
- **Borders**: Thick, solid borders

### Use Cases
- Creative portfolios
- Art/ design sites
- Bold brand identity
- Experimental projects

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| foreground | #000000 | Primary text |
| background | #ffffff | Page background |
| primary | #ff0000 | Bold accent |
| secondary | #0000ff | Secondary accent |
| border | #000000 | Thick borders |

## Typography

- **Font**: Space Grotesk, system-ui
- **Style**: Bold, uppercase for headings

## Getting Started

```bash
npx uiforge create my-app --style brutalism
```

## Example CSS

```css
.brutal-card {
  background: white;
  border: 3px solid black;
  box-shadow: 4px 4px 0px black;
  padding: 1.5rem;
}

.brutal-btn {
  background: #ff0000;
  border: 3px solid black;
  padding: 1rem 2rem;
  font-weight: bold;
  text-transform: uppercase;
}
```