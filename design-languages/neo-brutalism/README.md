# Neo-Brutalism Design Language

## Overview

Neo-brutalism is a modern take on brutalist web design, keeping the raw, bold aesthetic while adding color and playful elements. It maintains sharp edges and strong borders while incorporating more vibrant colors and softer shadows.

## Characteristics

### Visual Style
- **Contrast**: High contrast with bold colors
- **Shapes**: Sharp edges, zero border-radius
- **Typography**: Bold, often large, Space Grotesk font
- **Borders**: Thick solid borders (3px)
- **Shadows**: Hard offset shadows with color options

### Use Cases
- Creative agencies
- Portfolio sites
- Landing pages
- Marketing sites
- Bold brand identity

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #FFFDF5 | Warm cream |
| foreground | #1a1a1a | Rich black |
| primary | #6366f1 | Indigo |
| secondary | #fef3c7 | Soft yellow |
| accent | #f43f5e | Pink/red |
| border | #1a1a1a | Black borders |

## Typography

- **Font**: Space Grotesk, Archivo Black
- **Style**: Bold, uppercase for headings
- **Weight**: Heavy (700-900)

## Example CSS

```css
.neo-btn {
  background: #6366f1;
  border: 3px solid #1a1a1a;
  box-shadow: 6px 6px 0px #1a1a1a;
  padding: 1rem 2rem;
  font-weight: 800;
  text-transform: uppercase;
  transition: all 150ms ease-out;
}

.neo-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px #1a1a1a;
}

.neo-card {
  background: white;
  border: 3px solid #1a1a1a;
  box-shadow: 8px 8px 0px #1a1a1a;
  padding: 2rem;
}
```
