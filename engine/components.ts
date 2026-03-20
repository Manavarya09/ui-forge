import { writeFile, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export interface ComponentDefinition {
  name: string;
  category: string;
  description: string;
  dependencies: string[];
  file: string;
}

export const componentRegistry: ComponentDefinition[] = [
  {
    name: 'button',
    category: 'form',
    description: 'Interactive button with multiple variants',
    dependencies: ['clsx', 'tailwind-merge', 'class-variance-authority'],
    file: 'components/ui/button.tsx',
  },
  {
    name: 'card',
    category: 'layout',
    description: 'Content container with header, body, footer',
    dependencies: ['clsx', 'tailwind-merge'],
    file: 'components/ui/card.tsx',
  },
  {
    name: 'dialog',
    category: 'overlay',
    description: 'Modal dialog overlay with animations',
    dependencies: ['@radix-ui/react-dialog', 'framer-motion', 'clsx', 'tailwind-merge'],
    file: 'components/ui/dialog.tsx',
  },
  {
    name: 'dropdown-menu',
    category: 'navigation',
    description: 'Dropdown menu with actions and submenus',
    dependencies: ['@radix-ui/react-dropdown-menu', 'clsx', 'tailwind-merge'],
    file: 'components/ui/dropdown-menu.tsx',
  },
  {
    name: 'input',
    category: 'form',
    description: 'Text input field with validation states',
    dependencies: ['clsx', 'tailwind-merge'],
    file: 'components/ui/input.tsx',
  },
  {
    name: 'modal',
    category: 'overlay',
    description: 'Modal overlay component',
    dependencies: ['@radix-ui/react-dialog', 'framer-motion'],
    file: 'components/ui/modal.tsx',
  },
  {
    name: 'navigation-menu',
    category: 'navigation',
    description: 'Top navigation bar with dropdowns',
    dependencies: ['@radix-ui/react-navigation-menu', 'clsx', 'tailwind-merge'],
    file: 'components/ui/navigation-menu.tsx',
  },
  {
    name: 'sidebar',
    category: 'layout',
    description: 'Collapsible sidebar navigation',
    dependencies: ['@radix-ui/react-slot', 'clsx', 'tailwind-merge', 'lucide-react'],
    file: 'components/ui/sidebar.tsx',
  },
  {
    name: 'tabs',
    category: 'navigation',
    description: 'Tabbed content switcher',
    dependencies: ['@radix-ui/react-tabs', 'clsx', 'tailwind-merge'],
    file: 'components/ui/tabs.tsx',
  },
  {
    name: 'table',
    category: 'data',
    description: 'Data table with sorting and pagination',
    dependencies: ['clsx', 'tailwind-merge'],
    file: 'components/ui/table.tsx',
  },
  {
    name: 'badge',
    category: 'display',
    description: 'Small status indicator badge',
    dependencies: ['clsx', 'tailwind-merge', 'class-variance-authority'],
    file: 'components/ui/badge.tsx',
  },
  {
    name: 'avatar',
    category: 'display',
    description: 'User avatar component with fallback',
    dependencies: ['@radix-ui/react-avatar', 'clsx', 'tailwind-merge'],
    file: 'components/ui/avatar.tsx',
  },
  {
    name: 'tooltip',
    category: 'overlay',
    description: 'Hover tooltip component',
    dependencies: ['@radix-ui/react-tooltip', 'clsx', 'tailwind-merge'],
    file: 'components/ui/tooltip.tsx',
  },
  {
    name: 'skeleton',
    category: 'feedback',
    description: 'Loading placeholder with pulse animation',
    dependencies: ['clsx', 'tailwind-merge'],
    file: 'components/ui/skeleton.tsx',
  },
  {
    name: 'progress',
    category: 'feedback',
    description: 'Progress indicator bar',
    dependencies: ['@radix-ui/react-progress', 'clsx', 'tailwind-merge'],
    file: 'components/ui/progress.tsx',
  },
  {
    name: 'select',
    category: 'form',
    description: 'Select dropdown component',
    dependencies: ['@radix-ui/react-select', 'clsx', 'tailwind-merge', 'lucide-react'],
    file: 'components/ui/select.tsx',
  },
  {
    name: 'checkbox',
    category: 'form',
    description: 'Checkbox input with label',
    dependencies: ['@radix-ui/react-checkbox', 'clsx', 'tailwind-merge'],
    file: 'components/ui/checkbox.tsx',
  },
  {
    name: 'radio-group',
    category: 'form',
    description: 'Radio button group',
    dependencies: ['@radix-ui/react-radio-group', 'clsx', 'tailwind-merge'],
    file: 'components/ui/radio-group.tsx',
  },
  {
    name: 'switch',
    category: 'form',
    description: 'Toggle switch component',
    dependencies: ['@radix-ui/react-switch', 'clsx', 'tailwind-merge'],
    file: 'components/ui/switch.tsx',
  },
  {
    name: 'slider',
    category: 'form',
    description: 'Range slider input',
    dependencies: ['@radix-ui/react-slider', 'clsx', 'tailwind-merge'],
    file: 'components/ui/slider.tsx',
  },
  {
    name: 'accordion',
    category: 'content',
    description: 'Collapsible accordion sections',
    dependencies: ['@radix-ui/react-accordion', 'clsx', 'tailwind-merge', 'lucide-react'],
    file: 'components/ui/accordion.tsx',
  },
  {
    name: 'alert',
    category: 'feedback',
    description: 'Alert message component',
    dependencies: ['clsx', 'tailwind-merge', 'class-variance-authority'],
    file: 'components/ui/alert.tsx',
  },
  {
    name: 'alert-dialog',
    category: 'overlay',
    description: 'Alert modal dialog',
    dependencies: ['@radix-ui/react-alert-dialog', 'clsx', 'tailwind-merge'],
    file: 'components/ui/alert-dialog.tsx',
  },
  {
    name: 'sonner',
    category: 'feedback',
    description: 'Toast notification system',
    dependencies: ['sonner'],
    file: 'components/ui/sonner.tsx',
  },
  {
    name: 'toast',
    category: 'feedback',
    description: 'Toast notification component',
    dependencies: ['framer-motion', 'clsx', 'tailwind-merge'],
    file: 'components/ui/toast.tsx',
  },
  {
    name: 'calendar',
    category: 'form',
    description: 'Calendar date picker',
    dependencies: ['@radix-ui/react-day-picker', 'clsx', 'tailwind-merge', 'date-fns'],
    file: 'components/ui/calendar.tsx',
  },
  {
    name: 'popover',
    category: 'overlay',
    description: 'Popover content overlay',
    dependencies: ['@radix-ui/react-popover', 'clsx', 'tailwind-merge'],
    file: 'components/ui/popover.tsx',
  },
  {
    name: 'separator',
    category: 'layout',
    description: 'Horizontal/vertical divider',
    dependencies: ['@radix-ui/react-separator', 'clsx', 'tailwind-merge'],
    file: 'components/ui/separator.tsx',
  },
  {
    name: 'scroll-area',
    category: 'layout',
    description: 'Scrollable content area',
    dependencies: ['@radix-ui/react-scroll-area', 'clsx', 'tailwind-merge'],
    file: 'components/ui/scroll-area.tsx',
  },
  {
    name: 'resizable',
    category: 'layout',
    description: 'Resizable panel layout',
    dependencies: ['@radix-ui/react-resizable', 'clsx', 'tailwind-merge'],
    file: 'components/ui/resizable.tsx',
  },
];

export class ComponentRegistry {
  static list(search?: string, category?: string): ComponentDefinition[] {
    let components = componentRegistry;

    if (search) {
      const q = search.toLowerCase();
      components = components.filter(
        c =>
          c.name.includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.includes(q)
      );
    }

    if (category) {
      components = components.filter(c => c.category === category);
    }

    return components;
  }

  static get(name: string): ComponentDefinition | undefined {
    return componentRegistry.find(c => c.name === name);
  }

  static getByCategory(category: string): ComponentDefinition[] {
    return componentRegistry.filter(c => c.category === category);
  }

  static getCategories(): string[] {
    return [...new Set(componentRegistry.map(c => c.category))];
  }

  static async addComponent(name: string, projectPath: string): Promise<void> {
    const component = this.get(name);
    if (!component) {
      throw new Error(`Component "${name}" not found`);
    }

    await ensureDir(path.join(projectPath, 'components', 'ui'));

    const componentCode = this.generateComponentCode(component);
    const componentPath = path.join(projectPath, component.file);
    await writeFile(componentPath, componentCode);

    logger.success(`Component "${name}" added to ${component.file}`);
  }

  private static generateComponentCode(component: ComponentDefinition): string {
    const templates: Record<string, string> = {
      button: `'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,

      card: `'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription }
`,

      badge: `'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`,

      input: `'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`,

      skeleton: `'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
`,

      tabs: `'use client';

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
`,

      accordion: `'use client';

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`,
    };

    return templates[component.name] || this.generateGenericComponent(component);
  }

  private static generateGenericComponent(component: ComponentDefinition): string {
    return `'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${this.toPascalCase(component.name)}Props
  extends React.HTMLAttributes<HTMLDivElement> {
}

const ${this.toPascalCase(component.name)} = React.forwardRef<HTMLDivElement, ${this.toPascalCase(component.name)}Props>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    />
  )
)
${this.toPascalCase(component.name)}.displayName = "${this.toPascalCase(component.name)}"

export { ${this.toPascalCase(component.name)} }
`;
  }

  private static toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
