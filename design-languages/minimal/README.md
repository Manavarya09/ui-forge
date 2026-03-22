# Minimal Design Language

## Overview
Clean layout, generous whitespace, simple typography, limited color palette - perfect for modern, uncluttered interfaces.

## Characteristics

### Visual Style
- **Whitespace**: Generous padding and margins
- **Typography**: Clean sans-serif fonts (Inter)
- **Colors**: Limited palette - mostly black/white/gray with subtle accents
- **Shapes**: Subtle rounded corners

### Use Cases
- Landing pages
- Portfolios
- SaaS applications
- Blog sites

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #ffffff | Page background |
| foreground | #0a0a0a | Primary text |
| primary | #000000 | Buttons, links |
| secondary | #f5f5f5 | Section backgrounds |
| muted | #e5e5e5 | Disabled states |
| accent | #171717 | Highlights |
| border | #e5e5e5 | Dividers |

## Typography

- **Font Family**: Inter, system-ui
- **Headings**: Bold, tight letter spacing
- **Body**: Regular weight, comfortable line height

## Effects

- Subtle shadows only
- No gradients by default
- Minimal animations (150ms transitions)

## Getting Started

```bash
npx uiforge create my-app --style minimal
```

## Example CSS Variables

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #000000;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #404040;
  --muted: #e5e5e5;
  --muted-foreground: #737373;
  --accent: #171717;
  --accent-foreground: #ffffff;
  --border: #e5e5e5;
  --radius: 0.375rem;
}
```