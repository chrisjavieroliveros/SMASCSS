# SMASCSS - Scalable and Modular Architecture for SCSS

A comprehensive SCSS architecture designed for maintainable, scalable, and organized stylesheets. SMASCSS combines SMACSS (Scalable and Modular Architecture for CSS) principles with modern SCSS features to deliver a robust styling system for web applications.

**Version:** 2.0.0
**License:** MIT

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Folder Structure](#folder-structure)
- [Quick Start](#quick-start)
- [Configuration System](#configuration-system)
- [Tools & Utilities](#tools--utilities)
- [Theme System](#theme-system)
- [Component Development](#component-development)
- [Layout System](#layout-system)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

SMASCSS provides a complete SCSS framework with:

- **Configuration-driven design** - Centralized configuration for colors, typography, spacing, and breakpoints
- **Modular tools system** - Utilities for unit conversion, layout, accessibility, and responsive design
- **Flexible theme system** - Base styles, layouts, components, and utilities
- **CSS custom properties generation** - Automatic CSS variable creation for runtime theming

## Architecture Principles

1. **Separation of Concerns** - Clear distinction between configuration, tools, and theme
2. **Modularity** - Each file serves a single purpose and can be imported independently
3. **Scalability** - Architecture scales from small projects to enterprise applications
4. **Maintainability** - Organized structure makes updates and debugging straightforward
5. **Performance** - Efficient CSS output with minimal redundancy
6. **Accessibility** - Built-in accessibility utilities and best practices

## Folder Structure

```
scss/
├── core/                     # Core functionalities (variables, base functions, global configs)
│   ├── __index.scss          # Core entry point (forwards all core modules)
│   ├── _colors.scss          # Color system configuration (variables)
│   ├── _spacing.scss         # Spacing system configuration (variables)
│   └── _breakpoints.scss     # Breakpoint definitions (variables) & responsive mixin
│
├── mixins/                   # Global utility mixins
│   ├── __index.scss          # Forwards all mixins (e.g., accessibility, text, layout, ui)
│   ├── _accessibility.scss   # Accessibility helper mixins (e.g., visually-hidden)
│   ├── _text.scss            # Text manipulation mixins (e.g., truncate-text)
│   ├── _layout.scss          # Layout helper mixins (e.g., clearfix, aspect-ratio)
│   └── _ui.scss              # UI helper mixins (e.g., disabled-state)
│
├── base/                     # Base styles (resets, typography, element defaults)
│   ├── __index.scss          # Base entry point
│   ├── _reset.scss           # CSS reset
│   ├── _typography.scss      # Base typography styles & typography-related functions (e.g., px-to-rem)
│   └── _button.scss          # Base button styles
│
├── layouts/                  # Layout-specific styles (container, grid)
│   ├── __index.scss          # Layouts entry point
│   ├── _container.scss       # Container system
│   └── _grid.scss            # Grid system (if applicable, or other layout modules)
│
├── components/               # UI components
│   ├── __index.scss          # Components entry point
│   └── (e.g. _card.scss)     # Individual component styles
│
├── helpers/                  # Helper classes and utility mixins (non-outputting tools are in core)
│   ├── __index.scss          # Helpers entry point
│   ├── _display.scss         # Display utility classes
│   ├── _margin.scss          # Margin utility classes
│   ├── _padding.scss         # Padding utility classes
│   ├── _text-align.scss      # Text alignment utility classes
│   └── (e.g. _misc-utils.scss) # Other miscellaneous utility classes
│
├── pages/                    # Page-specific styles
│   ├── __index.scss          # Pages entry point
│   └── (e.g. _home.scss)     # Styles for specific pages
│
└── main.scss                 # Main entry point, imports all other modules
```

## Quick Start

### 1. Import the Main Stylesheet

```scss
// In your main SCSS file
@use "path/to/scss/main";
```

### 2. Core Configuration & Tools

The `core` directory houses the configuration (like colors, spacing, breakpoints).
Global utility mixins are now located in their own top-level `scss/mixins/` directory.
Typography-related functions like unit conversions (`px-to-rem`, `strip-unit`) are located in `scss/base/_typography.scss`.
`main.scss` handles the primary import of `core` and `mixins`.

```scss
// Example of using core variables and mixins
@use "path/to/scss/core" as core;
@use "path/to/scss/mixins" as mixins;
// For functions in base/typography.scss, you would typically use them within other base styles
// or import scss/base/typography directly if needed elsewhere.

.my-element {
  color: core.color("primary"); 
  padding: core.spacing(4); 

  @include core.breakpoint("md") { // Breakpoint mixin is still part of core
    // Styles for medium breakpoints and up
  }

  @include mixins.visually-hidden; // Example of using an accessibility mixin from the mixins directory
}
```

The `core` system primarily includes:
- Color system (variables and potentially functions/maps in `_colors.scss`)
- Spacing system (variables and potentially functions/maps in `_spacing.scss`)
- Breakpoint system (variables and mixins in `_breakpoints.scss`)

The `scss/mixins/` directory contains a collection of global mixins (e.g., for accessibility, text manipulation, layout, UI helpers).

Utility functions for unit conversion (`px-to-rem`, `rem-to-px`, `strip-unit`) are located in `scss/base/_typography.scss`.

Configure fonts, sizes, and weights in `scss/base/_typography.scss` for base HTML elements. This file now also contains typography-related functions like `px-to-rem` and `strip-unit`.
Core typography variables (like font families, base sizes if needed globally beyond base element styling) could be defined in `scss/core/_config.scss` (if you create one) or a dedicated `scss/core/_typography-vars.scss`.

```scss
// Example for base typography (scss/base/_typography.scss):
// html, body {
//   font-family: sans-serif;
//   font-size: 16px; // Base for px-to-rem
// }
// @function px-to-rem($px-value, $base-font-size: 16px) { ... }

// Using the function (typically within other SCSS files that import base/typography or core if re-exported):
// .some-component {
//   padding: px-to-rem(20px); // Assumes px-to-rem is available in the scope
// }
```

### 3. Using Helper Utilities

The `helpers` directory provides utility classes. These are typically applied directly in your HTML.

```scss
// SCSS for helpers is imported in main.scss
// HTML usage:
// <div class="d-flex justify-content-center mt-4 p-2">...</div>
```

### 4. Import Order in `main.scss`

The `main.scss` file should follow a logical import order:
1. `core` (configurations, base functions, global mixins)
2. `base` (resets, base element styles)
3. `layouts` (structural page layouts)
4. `components` (reusable UI elements)
5. `helpers` (utility classes)
6. `pages` (page-specific styles)

## Configuration System

Configuration for your project (colors, typography defaults, spacing units, breakpoints) is primarily managed within the `scss/core/` directory. Files like `_colors.scss`, `_spacing.scss`, and `_breakpoints.scss` define these foundational aspects.

### Colors

Configure your color palette in `scss/core/_colors.scss`. It's recommended to expose these as SCSS variables and potentially CSS custom properties for dynamic theming.

```scss
// scss/core/_colors.scss
// $primary-color: #007bff;
// ... other color variables

// Example usage in a component:
// @use "../core/colors" as c;
// .button {
//   background-color: c.$primary-color;
// }

// If generating CSS custom properties (handled in a global or core file):
// :root {
//   --color-primary: #007bff;
// }
// .button {
//   background-color: var(--color-primary);
// }
```

### Typography

Configure fonts, sizes, and weights in `scss/base/_typography.scss` for base HTML elements. This file now also contains typography-related functions like `px-to-rem` and `strip-unit`.
Core typography variables (like font families, base sizes if needed globally beyond base element styling) could be defined in `scss/core/_config.scss` (if you create one) or a dedicated `scss/core/_typography-vars.scss`.

```scss
// Example for base typography (scss/base/_typography.scss):
// html, body {
//   font-family: sans-serif;
//   font-size: 16px; // Base for px-to-rem
// }
// @function px-to-rem($px-value, $base-font-size: 16px) { ... }

// Using the function (typically within other SCSS files that import base/typography or core if re-exported):
// .some-component {
//   padding: px-to-rem(20px); // Assumes px-to-rem is available in the scope
// }
```

### Spacing

Configure spacing scale in `scss/core/_spacing.scss`. These are often unit-based values (e.g., rem, px) used by mixins or utility classes.

```scss
// scss/core/_spacing.scss
// $spacing-unit: 1rem;
// $spacing-map: (
//   0: 0,
//   1: $spacing-unit * 0.25,
//   2: $spacing-unit * 0.5,
//   4: $spacing-unit,
//   8: $spacing-unit * 2
// );

// Using spacing (via a function or directly)
// @use "../core/spacing" as s;
// .component {
//   margin: map-get(s.$spacing-map, 4);
//   padding: map-get(s.$spacing-map, 8);
// }

// If generating CSS variables for spacing utilities:
// :root {
//   --spacing-1: 0.25rem; /* etc. */
// }
// .p-1 { padding: var(--spacing-1); }
```

### Breakpoints

Configure responsive breakpoints in `scss/core/_breakpoints.scss`. This file typically contains a map of breakpoint names to values and mixins for applying styles at those breakpoints.

```scss
// scss/core/_breakpoints.scss
// $breakpoints: (
//   "sm": 576px,
//   "md": 768px,
//   "lg": 992px
// );
// @mixin breakpoint($name) {
//   @if map-has-key($breakpoints, $name) {
//     @media (min-width: map-get($breakpoints, $name)) {
//       @content;
//     }
//   }
// }

// Using breakpoint mixin (assuming core is imported as 'core')
// .responsive-element {
//   width: 100%;
//   @include core.breakpoint("md") {
//     width: 50%;
//   }
// }
```

## Tools & Utilities

Global utility mixins are now in the `scss/mixins/` directory (e.g., for accessibility, text, layout, UI). These are used within your SCSS files.
The `scss/base/_typography.scss` file contains unit conversion functions (`px-to-rem`, `rem-to-px`, `strip-unit`).
The `scss/helpers/` directory is primarily for utility classes that apply single-purpose styling directly in HTML.

### Global Mixins (in `scss/mixins/`)

Located in `scss/mixins/`, these are used within your SCSS files after importing `mixins` (usually in `main.scss`).
Example: `_accessibility.scss` contains `visually-hidden`, `_layout.scss` contains `clearfix`.

```scss
// In main.scss (or where you manage global imports):
// @use "path/to/scss/mixins" as mixins;

// Usage in a component:
// Assumes main.scss has made mixins available, or you @use mixins directly in the component file.
.visually-hidden-text {
  @include mixins.visually-hidden;
}

.float-container {
  @include mixins.clearfix;
}
```

### Unit Conversion Functions (in `base/_typography.scss`)

These functions are now part of `scss/base/_typography.scss`.
They are typically used when defining other base styles or within components if you need to convert units.

```scss
// In scss/base/_typography.scss (already defined there)
// @function px-to-rem($px-value, $base-font-size: 16px) { ... }

// Example usage if you were to import scss/base/_typography.scss directly
// or if its functions are made available globally via main.scss and @use with a global namespace.
// For simplicity, assume it's available:
// .element {
//   font-size: px-to-rem(18px); // Convert 18px to rem
// }
```

### Helper Utility Classes

Located in `scss/helpers/`, these generate CSS classes (e.g., `.mt-1`, `.p-2`, `.d-flex`).
Files like `_margin.scss`, `_padding.scss`, `_display.scss` generate these. They are imported via `scss/helpers/__index.scss` into `main.scss`.

```html
<!-- Example HTML usage -->
<div class="mt-4 mb-2 p-3 d-block">Styled with helper classes.</div>
```

No direct SCSS usage example is needed here as these are applied via HTML classes. Their generation is handled within the `helpers` files.

## Theme System

### Base Styles

Base styles are applied to HTML elements and provide sensible defaults:

- **Reset**: Normalizes browser differences
- **Typography**: Heading hierarchy and text styles
- **Buttons**: Default button styling

### Layout System

#### Container System

```html
<!-- Default container (max-width: 1200px) -->
<div class="container">Content</div>

<!-- Container variations -->
<div class="container container--narrow">Narrow content</div>
<div class="container container--wide">Wide content</div>
<div class="container container--fluid">Full width</div>
```

#### Grid System

```html
<!-- Basic grid -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive columns -->
<div class="grid grid--2-col">2 columns on tablet+</div>
<div class="grid grid--3-col">3 columns on desktop</div>
<div class="grid grid--4-col">4 columns on desktop</div>

<!-- Gap variations -->
<div class="grid grid--gap-sm">Small gap</div>
<div class="grid grid--gap-lg">Large gap</div>

<!-- Auto-fit for cards -->
<div class="grid grid--auto-fit">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Utility Classes

#### Spacing Utilities

```html
<!-- Margin utilities -->
<div class="m-4">All margins</div>
<div class="mt-2 mb-4">Top and bottom margins</div>
<div class="mx-6">Horizontal margins</div>

<!-- Padding utilities -->
<div class="p-8">All padding</div>
<div class="px-4 py-2">Horizontal and vertical padding</div>
```

#### Display & Flexbox

```html
<div class="flex-row justify-center align-center">Centered flex content</div>
```

## Component Development

### Creating a New Component

1. Create the component file in `scss/components/`:

```scss
// scss/components/_alert.scss
@use "../core" as core; // For variables, mixins
@use "../base/button" as b; // If you need to extend/style base button within alert

.alert {
  padding: core.spacing(4); // Example if spacing() is a function/map access
  // or padding: var(--spacing-4) if using CSS variables generated from core
  border: 1px solid transparent;

  &--success {
    background-color: core.color("success-bg"); // Example
    border-color: core.color("success-border");
    color: core.color("success-text");
  }

  // ... other modifiers
}
```

2. Add to the components index:

```scss
// scss/components/__index.scss
@forward "alert";
// ...existing forwards...
```

### Component Best Practices

- Use BEM methodology for naming: `.block__element--modifier`
- Leverage CSS custom properties for theming
- Include responsive behavior when needed
- Document usage in comments

## Best Practices

### 1. Naming Conventions

- **Files**: Use descriptive names with underscores: `_button-group.scss`
- **Classes**: Use BEM methodology: `.card__header--highlighted`
- **Variables**: Use semantic names: `$color-primary` not `$blue`

### 2. Architecture Guidelines

- **Import order**: Always follow the established import order in `main.scss`
- **Modularity**: Keep components independent and reusable
- **Specificity**: Avoid deep nesting; keep selectors flat
- **Documentation**: Comment complex logic and usage examples

### 3. Responsive Design

- **Mobile-first**: Start with mobile styles, enhance with breakpoints
- **Consistent breakpoints**: Use the predefined breakpoint system
- **Fluid design**: Leverage fluid spacing for smooth scaling

### 4. Performance

- **Selective imports**: Only import what you need
- **CSS variables**: Use CSS custom properties for runtime theming
- **Efficient selectors**: Avoid overly complex selectors

## Examples

### Complete Component Example

```scss
// theme/components/_pricing-card.scss
@use "../../core" as core; // Updated path for core variables
@use "../../mixins" as mixins; // For global mixins

.pricing-card {
  background: var(--color-white);
  border: 1px solid var(--color-light-300);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  @include core.breakpoint("md") {
    padding: var(--spacing-8);
  }

  &__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-2);
  }

  &__price {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin-bottom: var(--spacing-4);
  }

  &__features {
    list-style: none;
    padding: 0;
    margin-bottom: var(--spacing-6);

    li {
      padding: var(--spacing-2) 0;
      border-bottom: 1px solid var(--color-light-200);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &--featured {
    border-color: var(--color-primary);
    position: relative;

    &::before {
      content: "Most Popular";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-primary);
      color: var(--color-white);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--border-radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
  }
}
```

### Usage in HTML

```html
<div class="grid grid--3-col grid--gap-lg">
  <div class="pricing-card">
    <h3 class="pricing-card__title">Basic</h3>
    <div class="pricing-card__price">$9</div>
    <ul class="pricing-card__features">
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
    <button class="btn btn--primary">Choose Plan</button>
  </div>

  <div class="pricing-card pricing-card--featured">
    <h3 class="pricing-card__title">Pro</h3>
    <div class="pricing-card__price">$19</div>
    <ul class="pricing-card__features">
      <li>Everything in Basic</li>
      <li>Feature 3</li>
      <li>Feature 4</li>
    </ul>
    <button class="btn btn--primary">Choose Plan</button>
  </div>

  <div class="pricing-card">
    <h3 class="pricing-card__title">Enterprise</h3>
    <div class="pricing-card__price">$39</div>
    <ul class="pricing-card__features">
      <li>Everything in Pro</li>
      <li>Feature 5</li>
      <li>Priority Support</li>
    </ul>
    <button class="btn btn--primary">Choose Plan</button>
  </div>
</div>
```

---

## Contributing

When extending this architecture:

1. Follow the established folder structure
2. Update the appropriate `__index.scss` files
3. Document new utilities and components
4. Test responsive behavior across breakpoints
5. Ensure accessibility compliance

This architecture is designed to grow with your project while maintaining organization and performance.
