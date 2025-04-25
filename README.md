# SMASCSS - Scalable and Modular Architecture for Sassy CSS

A modern, scalable, and maintainable SCSS architecture for web projects of any size.

## Table of Contents

- [Overview](#overview)
- [Architecture and Organization](#architecture-and-organization)
- [Getting Started](#getting-started)
- [Core Components](#core-components)
- [Using the Framework](#using-the-framework)
- [Customization](#customization)
- [Utilities](#utilities)
- [Best Practices](#best-practices)

## Overview

SMASCSS combines the best practices from SMACSS (Scalable and Modular Architecture for CSS), ITCSS (Inverted Triangle CSS), and BEM (Block, Element, Modifier) methodologies to create a flexible and maintainable SCSS foundation for your projects.

Key features:

- **Modular structure**: Organized into distinct layers for better maintainability
- **Responsive by default**: Built with a mobile-first approach
- **Utility-first when needed**: Includes essential utility classes for rapid development
- **Component-driven**: Encourages reusable, isolated components
- **Theming support**: Built-in light/dark mode and custom theming capabilities
- **Developer friendly**: Clean organization with clear naming conventions

## Architecture and Organization

The SCSS files are organized in a specific hierarchy to manage specificity and improve maintainability:

```
scss/
├── abstracts/          # Foundational variables, functions, and mixins
│   ├── _colors.scss    # Color definitions and themes
│   ├── _fonts.scss     # Typography and text utilities
│   ├── _responsive.scss # Breakpoints and responsive mixins
│   ├── _spacing.scss   # Spacing system
│   ├── __index.scss    # Forwards all abstracts
│   └── ...
├── base/               # Basic element styles
│   ├── _reset.scss     # CSS reset/normalize
│   ├── _root.scss      # Root variables and themes
│   ├── _typography.scss # Base typography styles
│   ├── _forms.scss     # Form element basics
│   ├── _lists.scss     # List styling
│   ├── __index.scss    # Forwards all base styles
│   └── ...
├── components/         # Reusable UI components
│   ├── __index.scss    # Forwards all components
│   └── ...
├── layouts/            # Major layout components
│   ├── _grid.scss      # Grid system
│   ├── _wrapper.scss   # Container wrappers
│   ├── __index.scss    # Forwards all layouts
│   └── ...
├── utilities/          # Utility classes
│   ├── _display.scss   # Display utilities
│   ├── _spacing.scss   # Margin and padding utilities
│   ├── _visibility.scss # Visibility utilities
│   ├── __index.scss    # Forwards all utilities
│   └── ...
└── main.scss           # Main file that imports all partials
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Import the main SCSS file in your project:

```scss
@import "path/to/scss/main.scss";
```

3. Build the CSS using your preferred build tool (Sass, webpack, etc.)

## Core Components

### Color System

Colors are defined in `abstracts/_colors.scss` and exposed as CSS variables for easy theming:

```scss
// Access colors through CSS variables
.my-element {
  color: var(--text-black);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
}

// For specific colors from the palette
.accent {
  color: var(--color-Primary);
}

.warning {
  color: var(--color-Warning);
}
```

### Typography

Typography is defined in `abstracts/_fonts.scss` and implemented in `base/_typography.scss`:

- Font families (base, heading, mono)
- Font weights
- Font size scale (using a major third scale)
- Line heights
- Letter spacing
- Responsive text sizing

### Responsive Grid System

A flexible grid system is available in `layouts/_grid.scss`:

```html
<!-- Basic responsive grid -->
<div class="grid grid--md-2 grid--lg-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Auto-fit grid for cards -->
<div class="grid grid--auto-fit">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Sidebar layout -->
<div class="grid grid--sidebar-right">
  <main>Main content</main>
  <aside>Sidebar content</aside>
</div>

<!-- Complex layout with span control -->
<div class="grid grid--lg-12">
  <header class="grid-item grid-item--span-12">Header</header>
  <nav class="grid-item grid-item--span-3">Navigation</nav>
  <main class="grid-item grid-item--span-6">Main content</main>
  <aside class="grid-item grid-item--span-3">Sidebar</aside>
  <footer class="grid-item grid-item--span-12">Footer</footer>
</div>
```

### Container Wrappers

Use the wrapper classes from `layouts/_wrapper.scss` to contain content:

```html
<div class="global-wrapper">
  <!-- Standard width container (1280px max) -->
  Content here
</div>

<div class="global-wrapper global-wrapper--narrow">
  <!-- Narrow container for text content (800px max) -->
  Content here
</div>

<div class="global-wrapper global-wrapper--wide">
  <!-- Wide container (1600px max) -->
  Content here
</div>

<div class="global-wrapper global-wrapper--full">
  <!-- Full width container (100% max width) -->
  Content here
</div>
```

## Using the Framework

### Responsive Breakpoints

The framework uses the following breakpoints:

- `xs`: 0px (default)
- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `xxl`: 1400px

To use these in your SCSS:

```scss
@use "../abstracts/responsive" as responsive;

.my-component {
  // Base styles first (mobile)

  @include responsive.breakpoint("md") {
    // Styles for medium screens and up
  }

  @include responsive.breakpoint("lg") {
    // Styles for large screens and up
  }
}
```

### Dark Mode Support

The framework includes built-in dark mode support:

1. **Automatic** via `prefers-color-scheme` media query
2. **Manual** via the `.dark-theme` class

To add new theme variables:

```scss
@use "../abstracts/colors" as colors;

@mixin theme-variables($theme: "light") {
  @if $theme == "light" {
    --my-custom-color: #{colors.getColor(Primary)};
    // More light theme variables
  } @else {
    --my-custom-color: #{colors.getColor(Secondary)};
    // More dark theme variables
  }
}

:root {
  @include colors.generate-color-variables();
  @include theme-variables("light");
  @include my-custom-theme-variables("light");
}

@media (prefers-color-scheme: dark) {
  :root {
    @include colors.theme-variables("dark");
    @include my-custom-theme-variables("dark");
  }
}

.dark-theme {
  @include colors.theme-variables("dark");
  @include my-custom-theme-variables("dark");
}
```

## Customization

### Colors

To customize the color palette:

1. Edit the `$colors` map in `abstracts/_colors.scss`
2. Adjust theme variables as needed in the `theme-variables` mixin

### Spacing

The spacing system uses a consistent scale based on a 0.25rem (4px) unit:

```scss
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.5rem; // 24px
$space-6: 2rem; // 32px
$space-7: 3rem; // 48px
$space-8: 4rem; // 64px
$space-9: 6rem; // 96px
$space-10: 8rem; // 128px
```

To use spacing values in your SCSS:

```scss
@use "../abstracts/spacing" as spacing;

.my-component {
  padding: spacing.spacing("md");
  margin-bottom: spacing.spacing("lg");
  gap: spacing.$gap-md;
}
```

### Typography

To customize typography:

1. Edit font families, sizes, and other variables in `abstracts/_fonts.scss`
2. Update heading sizes in the `$heading-sizes` map for responsive scaling

## Utilities

The framework includes utility classes for common needs:

### Display Utilities

```html
<!-- Coming soon in utilities/_display.scss -->
```

### Spacing Utilities

```html
<!-- Coming soon in utilities/_spacing.scss -->
```

### Visibility Utilities

```html
<!-- Coming soon in utilities/_visibility.scss -->
```

### Typography Utilities

```html
<p class="text-center">Centered text</p>
<p class="text-right">Right-aligned text</p>
<p class="text-uppercase">Uppercase text</p>
<p class="text-truncated">
  Text that will be truncated with ellipsis if it's too long
</p>
<p class="text-bold">Bold text</p>
<p class="text-medium">Medium weight text</p>
<p class="text-nowrap">Text that won't wrap</p>
```

## Best Practices

1. **Mobile-first approach**: Start with mobile styles, then enhance for larger screens
2. **Component isolation**: Keep components self-contained to prevent side effects
3. **Consistent naming**: Follow the established naming patterns for new components
4. **Use CSS variables**: Leverage CSS variables for themeable properties
5. **Avoid deep nesting**: Keep SCSS nesting to 3 levels maximum
6. **Optimize specificity**: Structure code to avoid specificity conflicts
7. **Documentation**: Add comments to explain complex or non-obvious code
8. **Use mixins for repetitive patterns**: Extract common patterns into reusable mixins

## Contributing

Please follow these guidelines when contributing to the codebase:

1. Follow the established architecture and naming conventions
2. Write clear, concise comments for new features or complex code
3. Update documentation when adding new functionality
4. Test changes across different browsers and device sizes

---

Built with ♥ by Chris Javier Oliveros

```

```
