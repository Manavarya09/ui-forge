# Editorial Design Language

## Overview

Editorial is a refined, magazine-inspired design language that emphasizes typography, whitespace, and classic layout principles. It draws from the tradition of print editorial design, bringing that sophistication to digital interfaces.

## Characteristics

### Visual Style
- **Typography**: Playfair Display for headlines, Source Sans for body
- **Whitespace**: Generous margins and padding
- **Color**: Warm, neutral palette with gold accents
- **Layout**: Classic editorial grid with clear hierarchy

### Use Cases
- Magazines and publications
- Blogs and editorial content
- Portfolio sites
- News websites
- Premium content platforms

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #faf9f7 | Warm off-white |
| foreground | #1a1a1a | Rich black |
| primary | #c9a962 | Gold accent |
| secondary | #f5f3f0 | Warm gray |
| border | #d4d2cf | Subtle dividers |

## Typography

- **Headlines**: Playfair Display (serif)
- **Body**: Source Sans 3 (sans-serif)
- **Mono**: JetBrains Mono

## Example

```css
.editorial-headline {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #1a1a1a;
}

.editorial-body {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  color: #404040;
}
```
