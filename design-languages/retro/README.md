# Retro Design Language

## Overview

Retro draws inspiration from 70s and 80s aesthetics, featuring warm sunset tones, groovy rounded shapes, and nostalgic typography. It brings back the optimistic, colorful spirit of that era while being fully modern in functionality.

## Characteristics

### Visual Style
- **Colors**: Warm sunset palette (oranges, yellows, reds)
- **Shapes**: Large border-radius, soft curves
- **Typography**: Righteous, Comic Neue fonts
- **Shadows**: Hard bottom shadows (3D effect)
- **Vibe**: Playful, optimistic, nostalgic

### Use Cases
- Music/entertainment sites
- Food & restaurant
- Creative portfolios
- Event websites
- Retro-themed products

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #fef3e2 | Warm cream |
| foreground | #2d2a26 | Warm black |
| primary | #e85d04 | Orange |
| secondary | #ffba08 | Yellow |
| accent | #d00000 | Red |
| border | #9d0208 | Dark red |

## Typography

- **Font**: Righteous (display), Comic Neue (body)
- **Style**: Rounded, friendly, slightly playful

## Example CSS

```css
.retro-btn {
  background: linear-gradient(135deg, #e85d04 0%, #ffba08 100%);
  border-radius: 2rem;
  box-shadow: 0 6px 0px #9d0208;
  padding: 1rem 2rem;
  font-family: 'Righteous', cursive;
  font-weight: 700;
  color: white;
  transition: all 200ms ease-out;
}

.retro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0px #9d0208;
}

.retro-card {
  background: #fff8f0;
  border-radius: 1.5rem;
  box-shadow: 0 6px 0px #9d0208;
  padding: 2rem;
}
```
