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
- [Mixins & Utilities](#mixins--utilities)
- [Theme System](#theme-system)
- [Component Development](#component-development)
- [Layout System](#layout-system)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

SMASCSS provides a complete SCSS framework with:

- **Configuration-driven design** - Centralized configuration for colors, typography, spacing, and breakpoints
- **Modular mixins system** - Utilities for unit conversion, layout, accessibility, and responsive design
- **Flexible theme system** - Base styles, layouts, components, and utility classes
- **CSS custom properties generation** - Automatic CSS variable creation for runtime theming

## Architecture Principles

1. **Separation of Concerns** - Clear distinction between configuration, mixins, and theme
2. **Modularity** - Each file serves a single purpose and can be imported independently
3. **Scalability** - Architecture scales from small projects to enterprise applications
4. **Maintainability** - Organized structure makes updates and debugging straightforward
5. **Performance** - Efficient CSS output with minimal redundancy
6. **Accessibility** - Built-in accessibility utilities and best practices

## Folder Structure

```
scss/
├── config/                    # Configuration layer
│   ├── config.scss           # Main config file (generates CSS variables)
│   ├── _colors.scss          # Color system configuration
│   ├── _typography.scss      # Typography configuration
│   ├── _spacing.scss         # Spacing system configuration
│   ├── _breakpoints.scss     # Responsive breakpoints
│   └── _buttons.scss         # Button configuration
│
├── mixins/                    # Utilities & functions (no CSS output)
│   ├── __index.scss          # Mixins entry point
│   ├── _unit-conversion.scss # Unit conversion functions
│   ├── _layout.scss          # Layout utilities & functions
│   ├── _breakpoints.scss     # Responsive mixins
│   ├── _accessibility.scss   # A11y mixins
│   └── _text.scss            # Text manipulation utilities
│
├── theme/                     # Theme implementation
│   ├── base/                 # Base styles
│   │   ├── __index.scss      # Base entry point
│   │   ├── _reset.scss       # CSS reset
│   │   ├── _typography.scss  # Typography styles
│   │   └── _buttons.scss     # Button styles
│   │
│   ├── layouts/              # Layout components
│   │   ├── __index.scss      # Layouts entry point
│   │   ├── _container.scss   # Container system
│   │   └── _grid.scss        # Grid system
│   │
│   ├── components/           # UI components
│   │   ├── __index.scss      # Components entry point
│   │   ├── _card.scss        # Card component
│   │   └── _hero.scss        # Hero section component
│   │
│   ├── utilities/            # Utility classes
│   │   ├── __index.scss      # Utilities entry point
│   │   ├── _helpers.scss     # Layout helpers
│   │   ├── _display.scss     # Display utilities
│   │   ├── _text-align.scss  # Text alignment
│   │   ├── _margins.scss     # Margin utilities
│   │   └── _paddings.scss    # Padding utilities
│   │
│   └── pages/                # Page-specific styles
│       └── __index.scss      # Pages entry point
│
└── main.scss                 # Main entry point
```

## Quick Start

### 1. Import the Main Stylesheet

```scss
// In your main SCSS file
@use "path/to/scss/main";
```

### 2. Configuration System

The configuration system automatically generates CSS custom properties from your configuration files. Import the config to enable them:

```scss
// This is already included in main.scss
@use "config/config" as config;
```

The configuration system includes:

- Color system with CSS variable generation
- Typography system with font variables
- Spacing scale with CSS custom properties
- Breakpoint system with responsive variables
- Button configuration with theme variables

### 3. Use the Mixins

```scss
// Import mixins for development
@use "mixins" as mixins;

.my-component {
  padding: mixins.spacing(4);

  @include mixins.breakpoint("md") {
    padding: mixins.spacing(6);
  }
}
```

### 4. Import Order

The main.scss file follows this specific import order:

1. Mixins (utilities and functions)
2. Base styles (resets and defaults)
3. Layouts (structural components)
4. Components (reusable UI elements)
5. Classes (helper classes)
6. Page-specific styles

## Configuration System

### Colors

Configure your color palette in `config/_colors.scss`:

```scss
// Using color functions
.element {
  color: color("primary");
  background: color-alpha("primary", 0.1);
  border: 1px solid color("primary-300");
}

// Using CSS variables (runtime)
.element {
  color: var(--color-primary);
  background: var(--color-primary-50);
}
```

### Typography

Configure fonts, sizes, and weights in `config/_typography.scss`:

```scss
// Using typography functions
.heading {
  font-family: font-family("heading");
  font-size: font-size("2xl");
  font-weight: font-weight("bold");
  line-height: line-height("tight");
}

// Using CSS variables
.heading {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}
```

### Spacing

Configure spacing scale in `config/_spacing.scss`:

```scss
// Using spacing function
.component {
  margin: spacing(4); // Returns 1rem
  padding: spacing("lg"); // Using alias
}

// Using CSS variables
.component {
  margin: var(--spacing-4);
  padding: var(--spacing-8);
}
```

### Breakpoints

Configure responsive breakpoints in `config/_breakpoints.scss`:

```scss
// Using breakpoint mixin
.responsive-element {
  width: 100%;

  @include mixins.breakpoint("md") {
    width: 50%;
  }

  @include mixins.breakpoint("lg") {
    width: 33.333%;
  }
}
```

## Mixins & Utilities

### Unit Conversion

```scss
@use "mixins" as mixins;

.element {
  font-size: mixins.px-to-rem(18px); // Convert 18px to rem
  width: mixins.rem-to-px(2rem); // Convert 2rem to px
}
```

### Layout Utilities

```scss
// Fluid spacing between breakpoints
.hero {
  padding: mixins.fluid-space(1rem, 3rem, 320px, 1200px);
}

// Aspect ratio
.video-container {
  @include mixins.aspect-ratio(16/9);
}

// Clearfix
.float-container {
  @include mixins.clearfix;
}
```

### Accessibility

```scss
// Visually hidden (for screen readers)
.sr-only {
  @include mixins.visually-hidden;
}

// Focus ring
.interactive-element {
  @include mixins.focus-ring;
}
```

### Text Utilities

```scss
// Truncate text
.truncated {
  @include mixins.truncate-text;
}

// Multiple line truncation
.excerpt {
  @include mixins.truncate-text(3); // 3 lines
}
```

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

1. Create the component file in `theme/components/`:

```scss
// theme/components/_alert.scss
@use "../../mixins" as mixins;
@use "../../config/colors" as colors;

.alert {
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  border: 1px solid transparent;

  &--success {
    background-color: var(--color-success-50);
    border-color: var(--color-success-200);
    color: var(--color-success-800);
  }

  &--danger {
    background-color: var(--color-danger-50);
    border-color: var(--color-danger-200);
    color: var(--color-danger-800);
  }
}
```

2. Add to the components index:

```scss
// theme/components/__index.scss
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
@use "../../mixins" as mixins;

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

  @include mixins.breakpoint("md") {
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
