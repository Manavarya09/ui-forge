# Neumorphism Design Language

## Overview
Soft shadows creating tactile, raised appearance. Elements appear to be extruded from the background.

## Characteristics
- Soft, extruded shadows
- Low contrast
- Monochromatic
- Tactile feel

## Getting Started
```bash
npx uiforge create my-app --style neumorphism
```

## Shadow Formula
```css
.neumorphic {
  background: #e0e5ec;
  box-shadow: 9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff;
}
```