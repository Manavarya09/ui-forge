# UIForge Design Language Specification

## Purpose

Design Languages in UIForge define how templates transform into themed, production-ready interfaces. They are the bridge between abstract visual intent and concrete CSS/Tailwind implementations.

When you run `uiforge create --style glass`, the system reads the glass design language's `config.json` and applies its tokens to the selected template. The result isn't a clone—it's a semantic translation where a "primary button" remains a primary button, but styled according to glass's visual grammar.

---

## Architecture

### Directory Structure

```
design-languages/
├── brutalism/
│   ├── config.json    # Machine-readable specification
│   └── README.md      # Human-readable documentation
├── glass/
│   ├── config.json
│   └── README.md
└── DESIGN_LANGUAGE.md  # This specification
```

Each design language requires:
1. **`config.json`** — The complete specification read by the system
2. **`README.md`** — Documentation explaining the design language's intent

---

## Configuration Schema

### Top-Level Structure

```json
{
  "name": "design-language-name",
  "description": "Brief description of the aesthetic",
  "tokens": { ... },
  "typography": { ... },
  "effects": { ... },
  "layout": { ... }
}
```

---

### Tokens Section

Tokens are the atomic visual decisions. Every design language must define these token types:

#### Colors

Colors use semantic naming with foreground/background pairs. This pairing ensures proper contrast in both light and dark contexts.

| Token | Purpose | Example |
|-------|---------|---------|
| `background` | Page background | `#ffffff` |
| `foreground` | Primary text | `#0a0a0a` |
| `primary` | Main interactive color | `#6366f1` |
| `primaryForeground` | Text on primary | `#ffffff` |
| `secondary` | Supporting surfaces | `#f5f5f5` |
| `secondaryForeground` | Text on secondary | `#404040` |
| `muted` | Subdued backgrounds | `#e5e5e5` |
| `mutedForeground` | Subdued text | `#737373` |
| `accent` | Emphasis color | `#171717` |
| `accentForeground` | Text on accent | `#ffffff` |
| `border` | Dividers and outlines | `#e5e5e5` |
| `ring` | Focus indicators | `#6366f1` |
| `destructive` | Error/delete actions | `#dc2626` |
| `destructiveForeground` | Text on destructive | `#ffffff` |
| `card` | Card backgrounds | `#ffffff` |
| `cardForeground` | Text in cards | `#0a0a0a` |
| `popover` | Dropdown backgrounds | `#ffffff` |
| `popoverForeground` | Text in popovers | `#0a0a0a` |

**Glass-specific colors** use rgba for transparency:
```json
{
  "background": "rgba(255, 255, 255, 0.1)",
  "backgroundSolid": "#1a1a2e",
  "glassTint": "rgba(255, 255, 255, 0.05)"
}
```

#### Border Radius

Follows Tailwind's scale. Values represent the radius applied to specific component types:

| Token | Use Case | Example Value |
|-------|----------|---------------|
| `none` | Brutalist designs, dividers | `0` |
| `sm` | Small inputs, tags | `0.125rem` |
| `DEFAULT` | Base components | `0.375rem` |
| `md` | Buttons, small cards | `0.5rem` |
| `lg` | Cards, panels | `0.75rem` |
| `xl` | Large cards, modals | `1rem` |
| `full` | Pills, avatars | `9999px` |

**Brutalism example** — all sharp edges:
```json
{
  "borderRadius": {
    "none": "0",
    "sm": "0",
    "DEFAULT": "0",
    "md": "0",
    "lg": "0",
    "xl": "0",
    "full": "0"
  }
}
```

**Glass example** — large, soft corners:
```json
{
  "borderRadius": {
    "none": "0",
    "sm": "0.5rem",
    "DEFAULT": "1rem",
    "md": "1.25rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "full": "9999px"
  }
}
```

#### Spacing

Uses Tailwind's scale. All design languages share the same spacing scale to ensure consistency:

```json
{
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "32": "8rem"
  }
}
```

---

### Typography Section

Typography defines the visual character of text across the interface:

#### Font Families

Each font context maps to a prioritized font stack:

```json
{
  "fontFamily": {
    "sans": ["Inter", "system-ui", "sans-serif"],
    "serif": ["Playfair Display", "Georgia", "serif"],
    "mono": ["JetBrains Mono", "Fira Code", "monospace"]
  }
}
```

**Font selection guides by aesthetic:**
- **Minimal**: Inter, Plus Jakarta Sans, Satoshi
- **Brutalist**: Space Grotesk, Archivo Black, monospace fonts
- **Elegant/Luxury**: Playfair Display, Cormorant Garamond, DM Serif Display
- **Tech/Modern**: Geist, Plus Jakarta Sans, Outfit

#### Font Sizes

Follows Tailwind's scale. Each size includes line height for optimal readability:

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `xs` | 0.75rem | 1rem | Captions, badges |
| `sm` | 0.875rem | 1.25rem | Secondary text |
| `base` | 1rem | 1.5rem | Body text |
| `lg` | 1.125rem | 1.75rem | Lead paragraphs |
| `xl` | 1.25rem | 1.75rem | Subheadings |
| `2xl` | 1.5rem | 2rem | Section titles |
| `3xl` | 1.875rem | 2.25rem | Page subtitles |
| `4xl` | 2.25rem | 2.5rem | Page titles |
| `5xl` | 3rem | 1.1 | Hero subtitles |
| `6xl` | 3.75rem | 1 | Hero titles |
| `7xl` | 4.5rem | 1 | Large displays |
| `8xl` | 6rem | 1 | Landing heroes |
| `9xl` | 8rem | 1 | Statement text |

```json
{
  "fontSize": {
    "xs": ["0.75rem", { "lineHeight": "1rem" }],
    "sm": ["0.875rem", { "lineHeight": "1.25rem" }],
    "base": ["1rem", { "lineHeight": "1.5rem" }],
    "2xl": ["1.5rem", { "lineHeight": "2rem" }],
    "5xl": ["3rem", { "lineHeight": "1.1" }]
  }
}
```

#### Font Weights

Maps semantic weight names to numeric values. Different design languages use different weight distributions:

**Minimal — Light weights:**
```json
{
  "fontWeight": {
    "thin": "100",
    "light": "300",
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700"
  }
}
```

**Brutalist — Heavy weights:**
```json
{
  "fontWeight": {
    "thin": "700",
    "light": "700",
    "normal": "700",
    "medium": "700",
    "semibold": "700",
    "bold": "800",
    "extrabold": "800",
    "black": "900"
  }
}
```

#### Letter Spacing

Controls text density:

```json
{
  "letterSpacing": {
    "tighter": "-0.05em",
    "tight": "-0.025em",
    "normal": "0em",
    "wide": "0.025em",
    "wider": "0.05em",
    "widest": "0.1em"
  }
}
```

---

### Effects Section

Effects create depth, motion, and visual interest:

#### Shadows

Shadow scales create layered depth. Style guides:
- **Minimal**: Subtle, close to surface
- **Brutalist**: Hard offset shadows, no blur
- **Glass**: Colored, diffused shadows
- **Enterprise**: Neutral, professional

**Standard shadows:**
```json
{
  "shadows": {
    "none": "none",
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  }
}
```

**Brutalist offset shadows:**
```json
{
  "shadows": {
    "none": "none",
    "sm": "4px 4px 0px #000000",
    "DEFAULT": "6px 6px 0px #000000",
    "md": "8px 8px 0px #000000",
    "lg": "12px 12px 0px #000000",
    "offset": "4px 4px 0px"
  }
}
```

#### Gradients

Define consistent gradient patterns:

```json
{
  "gradients": {
    "primary": "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    "background": "linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.95) 100%)",
    "card": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
    "glow": "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
  }
}
```

#### Blur

Used for glass morphism and backdrop effects:

```json
{
  "blur": {
    "sm": "8px",
    "DEFAULT": "16px",
    "md": "24px",
    "lg": "40px",
    "xl": "64px"
  }
}
```

#### Transitions

Control animation timing and easing:

```json
{
  "transitions": {
    "DEFAULT": "all 150ms ease-in-out",
    "fast": "all 100ms ease-in-out",
    "slow": "all 300ms ease-in-out"
  }
}
```

**Glass uses custom easing:**
```json
{
  "transitions": {
    "DEFAULT": "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    "fast": "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    "slow": "all 500ms cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

**Brutalist is instant:**
```json
{
  "transitions": {
    "DEFAULT": "all 0ms",
    "fast": "all 0ms",
    "slow": "all 100ms"
  }
}
```

---

### Layout Section

Layout defines spatial systems and component dimensions:

```json
{
  "layout": {
    "containerMaxWidth": "1280px",
    "sectionPadding": "6rem 1.5rem",
    "gridGap": "1.5rem",
    "cardPadding": "1.5rem",
    "navbarHeight": "4rem"
  }
}
```

**Style-specific layout tokens:**

Glass navbar (taller, glass-effect):
```json
{
  "navbarHeight": "5rem"
}
```

Brutalist (solid borders, no gaps):
```json
{
  "gridGap": "0",
  "sectionPadding": "6rem 0",
  "borderWidth": "2px",
  "solidBorders": true
}
```

---

## Converting Templates to Design Languages

### Systematic Process

#### Step 1: Aesthetic Analysis

Identify the dominant visual qualities:

1. **Overall feel**: Minimal, bold, playful, professional, futuristic?
2. **Color temperature**: Warm, cool, neutral, saturated, muted?
3. **Edge treatment**: Sharp, rounded, soft?
4. **Depth model**: Flat, layered, floating?
5. **Motion philosophy**: Subtle, animated, static?

Document as the description:
```json
{
  "name": "your-style",
  "description": "Bold typography, strong grid, high contrast, raw and unapologetic layout"
}
```

#### Step 2: Color Extraction

Extract colors from template CSS and map semantically:

1. Scan `globals.css` for color values
2. Identify primary action color
3. Identify background colors (page, card, section variations)
4. Identify text colors (primary, muted, secondary)
5. Check for accent colors used sparingly

**Color mapping rules:**
- `background` → Page/container backgrounds
- `card` → Card components specifically
- `primary` → Buttons, links, active states, primary actions
- `foreground` → Body copy, headings
- `muted-foreground` → Captions, timestamps, secondary text
- `border` → Dividers, input borders, card outlines
- `accent` → Highlights, badges, hover states

#### Step 3: Typography Extraction

1. Identify font-family declarations
2. Note font sizes for each heading level (h1-h6)
3. Note body text size
4. Check font weights (regular=400, medium=500, bold=700 typically)
5. Identify special treatments (letter-spacing on headlines, uppercase, etc.)

**Questions to answer:**
- Sans, serif, or both?
- Display/headline fonts different from body?
- Monospace used anywhere?
- Any special tracking or sizing?

#### Step 4: Spatial System

1. Measure container max-width
2. Note section padding (top/bottom typically)
3. Check grid gap values
4. Identify card/component padding
5. Note navbar height

#### Step 5: Effects Catalog

1. List all shadow values (look for patterns: `sm`, `md`, `lg`)
2. Check for gradients (backgrounds, buttons, text)
3. Note blur values (typically backdrop-filter)
4. Identify transition/animation timing
5. Look for special effects (glow, outline, etc.)

#### Step 6: Style-Specific Tokens

Add tokens unique to the aesthetic:

**For Glass:**
```json
{
  "layout": {
    "glassEffect": {
      "background": "rgba(255, 255, 255, 0.05)",
      "backdropFilter": "blur(16px)",
      "border": "1px solid rgba(255, 255, 255, 0.1)"
    }
  }
}
```

**For Brutalism:**
```json
{
  "effects": {
    "borders": {
      "width": "2px",
      "style": "solid",
      "color": "#000000"
    }
  }
}
```

---

## Example Design Languages

### Minimal

Clean, functional, focuses on content:
- White backgrounds, dark text
- Subtle shadows only on hover
- Inter font family
- Standard rounded corners
- Generous whitespace

### Brutalism

Raw, bold, unapologetic:
- High contrast (black/white + single accent)
- Zero border-radius everywhere
- Thick borders (2-4px solid)
- Offset box shadows (no blur)
- Bold, heavy typography
- No transitions (instant state changes)

### Glass

Modern, layered, translucent:
- Dark backgrounds with glass panels
- Semi-transparent overlays (rgba)
- Backdrop blur effects
- Gradient accents
- Large rounded corners
- Soft, diffused shadows

### Tech Futurism

Advanced, glowing, neon:
- Dark base with bright accents
- Neon glow effects
- Animated gradients
- Sharp geometric shapes
- Monospace typography accents
- Pulsing/glowing interactive states

---

## Implementation

### CLI Usage

Apply a design language when creating a project:

```bash
# Interactive mode
npx uiforge create

# Direct style application
npx uiforge create saas-modern my-app --style brutalism

# With AI enhancement
npx uiforge create ecommerce my-store --style glass --ai
```

### Registry Functions

Located in `design-languages/registry.ts`:

```typescript
// List all available styles
const styles = await designLanguageRegistry.listStyles();

// Get a specific style
const glass = await designLanguageRegistry.getStyle("glass");

// Check if style exists
const exists = await designLanguageRegistry.styleExists("minimal");

// Generate CSS variables
const css = designLanguageRegistry.generateStyleCSSVariables(style);

// Generate Tailwind config
const config = designLanguageRegistry.generateStyleTailwindConfig(style);
```

### Output Generation

When applying a design language, the system generates:

1. **Tailwind Config** — Custom colors, fonts, shadows, border-radius
2. **CSS Variables** — Theme values for runtime access
3. **Base Styles** — Reset and foundational styles
4. **Component Tokens** — Semantic mappings for components

---

## Best Practices

### Accessibility
- All text combinations must meet WCAG contrast (4.5:1 normal, 3:1 large)
- Focus states must be visible (use `ring` token)
- Don't rely on color alone for information

### Consistency
- Use the complete Tailwind scale for spacing
- Keep border-radius values consistent with their names
- Ensure shadows create a logical depth hierarchy

### Documentation
- Write clear descriptions that explain the aesthetic intent
- Include example CSS/JSX in README.md
- Document any unique tokens or special behaviors

### Testing
- Test in both light and dark contexts if supporting dark mode
- Verify at different viewport sizes
- Check interactive states (hover, focus, active)
- Ensure gradients work on various backgrounds
