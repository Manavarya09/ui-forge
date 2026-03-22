# Bento Design Language

## Overview
Modular, boxed layout inspired by Bento boxes. Each section is contained in distinct boxes with consistent spacing.

## Characteristics

### Visual Style
- **Grid**: Clear grid-based layout
- **Boxes**: Distinct container boxes
- **Spacing**: Consistent gaps between boxes
- **Modular**: Self-contained sections

### Use Cases
- Feature showcases
- Dashboard homepages
- Portfolio grids
- Pricing pages

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #f8fafc | Page background |
| foreground | #0f172a | Primary text |
| primary | #6366f1 | Primary actions |
| card | #ffffff | Bento boxes |

## Layout

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.bento-box {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

## Getting Started

```bash
npx uiforge create my-app --style bento
```