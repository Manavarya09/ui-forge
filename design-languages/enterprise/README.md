# Enterprise Design Language

## Overview
Professional, structured design with clear hierarchy, accessible colors, and reliable components. Built for business applications.

## Characteristics

### Visual Style
- **Structure**: Clear grid and spacing
- **Hierarchy**: Distinct visual levels
- **Professional**: Conservative color choices
- **Accessible**: WCAG compliant

### Use Cases
- Business dashboards
- Admin panels
- Enterprise SaaS
- Internal tools

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | #ffffff | Page background |
| foreground | #1e293b | Primary text |
| primary | #2563eb | Actions |
| secondary | #64748b | Secondary |
| muted | #f1f5f9 | Section bg |

## Typography

- **Font**: Inter, system-ui
- **Size**: 14px base, 16px for body

## Getting Started

```bash
npx uiforge create my-app --style enterprise
```

## Example Data Table

```tsx
<table className="enterprise-table">
  <thead>
    <th>Column 1</th>
    <th>Column 2</th>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```