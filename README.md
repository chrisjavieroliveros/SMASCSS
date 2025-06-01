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
│   ├── _colors.scss          # Color system configuration (comprehensive color palette)
│   ├── _spacing.scss         # Spacing system configuration (rem-based scale)
│   └── _breakpoints.scss     # Breakpoint definitions & responsive mixins
│
├── mixins/                   # Global utility mixins
│   ├── __index.scss          # Forwards all mixins (accessibility, text, layout, ui)
│   ├── _accessibility.scss   # Accessibility helper mixins (e.g., visually-hidden)
│   ├── _text.scss            # Text manipulation mixins (e.g., truncate-text)
│   ├── _layout.scss          # Layout helper mixins (e.g., clearfix, aspect-ratio)
│   └── _ui.scss              # UI helper mixins (e.g., disabled-state)
│
├── base/                     # Base styles (resets, typography, element defaults)
│   ├── __index.scss          # Base entry point
│   ├── _reset.scss           # Modern CSS reset
│   ├── _typography.scss      # Base typography styles & utility functions
│   ├── _button.scss          # Base button styles
│   ├── _links.scss           # Base anchor/link styles
│   ├── _forms.scss           # Base form element styles
│   ├── _lists.scss           # Base list element styles
│   ├── _tables.scss          # Base table element styles
│   ├── _media.scss           # Base media element styles (img, video, etc.)
│   ├── _code.scss            # Base code element styles
│   ├── _navigation.scss      # Base navigation element styles
│   └── _footer.scss          # Base footer element styles
│
├── layouts/                  # Layout-specific styles
│   ├── __index.scss          # Layouts entry point
│   └── _container.scss       # Responsive container system
│
├── components/               # UI components
│   └── __index.scss          # Components entry point (ready for component additions)
│
├── classes/                  # Utility classes for spacing, display, text, etc.
│   ├── __index.scss          # Classes entry point
│   ├── _display.scss         # Display and flexbox utility classes
│   ├── _margin.scss          # Margin utility classes
│   ├── _padding.scss         # Padding utility classes
│   └── _text-align.scss      # Text alignment utility classes
│
├── pages/                    # Page-specific styles
│   └── __index.scss          # Pages entry point (ready for page-specific styles)
│
└── main.scss                 # Main entry point, imports all modules in logical order
```

## Quick Start

### 1. Import the Main Stylesheet

```scss
// In your main SCSS file
@use "path/to/scss/main";
```

### 2. Core Configuration & Tools

The `core` directory houses the configuration system with comprehensive color palettes, spacing scales, and responsive breakpoints. Global utility mixins are located in the top-level `scss/mixins/` directory. Typography-related functions like unit conversions are located in `scss/base/_typography.scss`.

```scss
// Example of using core variables and mixins
@use "path/to/scss/core" as core;
@use "path/to/scss/mixins" as mixins;

.my-element {
  color: core.getColor("Primary");
  padding: core.spacing("4");

  @include core.breakpoint("md") {
    // Responsive styles for medium breakpoints and up
    padding: core.spacing("6");
  }

  @include mixins.visually-hidden; // Accessibility mixin from mixins directory
}
```

The `core` system includes:

- **Color system**: Comprehensive color palette with semantic naming and variants (`_colors.scss`)
- **Spacing system**: Rem-based spacing scale from 0.25rem to 8rem (`_spacing.scss`)
- **Breakpoint system**: Mobile-first responsive breakpoints with utility functions and mixins (`_breakpoints.scss`)

The `scss/mixins/` directory contains global utility mixins for accessibility, text manipulation, layout helpers, and UI states.

Typography functions for unit conversion and base typography styles are centralized in `scss/base/_typography.scss`.

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

### 3. Using Utility Classes

The `classes` directory provides utility classes for common styling needs. These are applied directly in your HTML.

```html
<!-- Example HTML usage -->
<div class="d-flex mt-4 mb-2 p-3">Styled with utility classes.</div>
<div class="text-center mx-auto">Centered content with auto margins.</div>
```

### 4. Import Order in `main.scss`

The `main.scss` file follows a logical import order:

1. `core` - Configuration system (colors, spacing, breakpoints)
2. `mixins` - Global utility mixins
3. `base` - CSS reset, base element styles, typography
4. `layouts` - Structural page elements (container system)
5. `components` - Reusable UI components
6. `classes` - Utility classes for spacing, display, text alignment
7. `pages` - Page-specific styles

## Configuration System

Configuration for your project (colors, typography defaults, spacing units, breakpoints) is primarily managed within the `scss/core/` directory. Files like `_colors.scss`, `_spacing.scss`, and `_breakpoints.scss` define these foundational aspects.

### Colors

Configure your color palette in `scss/core/_colors.scss`. The system includes a comprehensive color palette with semantic naming, color variants, and utility functions.

```scss
// scss/core/_colors.scss includes:
// - Primary, Secondary, Tertiary color families with 50-950 variants
// - Success, Warning, Danger, Info status colors
// - Neutral grays from Light to Dark
// - Utility colors (Black, White, Transparent)

// Example usage in a component:
@use "../core" as core;
.button {
  background-color: core.getColor("Primary");
  color: core.getColor("Primary-Contrast");

  &:hover {
    background-color: core.getColor("Primary-600");
  }

  &--success {
    background-color: core.getColor("Success");
  }
}

// The system also generates CSS custom properties:
// :root {
//   --color-primary: #314459;
//   --color-primary-contrast: #ffffff;
//   --color-success: #28a745;
// }
```

### Typography

Base typography styles and utility functions are defined in `scss/base/_typography.scss`. This file provides sensible defaults for all HTML typographic elements and includes utility functions for unit conversions.

```scss
// scss/base/_typography.scss provides:
// - Base font family, size, and line-height for html/body
// - Heading hierarchy (h1-h6) with appropriate sizing
// - Typography utility functions

// The file includes elements like:
html,
body {
  font-family: sans-serif;
  font-size: 16px; // Base for rem calculations
  line-height: 1.2;
}

h1 {
  font-size: 2.5rem;
} // 40px
h2 {
  font-size: 2rem;
} // 32px
h3 {
  font-size: 1.75rem;
} // 28px
h4 {
  font-size: 1.5rem;
} // 24px
h5 {
  font-size: 1.25rem;
} // 20px
h6 {
  font-size: 1rem;
} // 16px

// Usage in components:
@use "../base/typography" as typo;
.custom-heading {
  @extend h2; // Inherit h2 styling
}
```

### Spacing

Configure the spacing scale in `scss/core/_spacing.scss`. The system uses a rem-based scale that provides consistent spacing throughout your application.

```scss
// scss/core/_spacing.scss includes:
$spacing: (
  "0": 0,
  "1": 0.25rem,
  // 4px
  "2": 0.5rem,
  // 8px
  "3": 0.75rem,
  // 12px
  "4": 1rem,
  // 16px
  "5": 1.5rem,
  // 24px
  "6": 2rem,
  // 32px
  "8": 3rem,
  // 48px
  "10": 4rem,
  // 64px
  "12": 6rem,
  // 96px
  "16": 8rem,
  // 128px
);

// Usage in components:
@use "../core" as core;
.component {
  margin: core.spacing("4");
  padding: core.spacing("6");

  @include core.breakpoint("md") {
    padding: core.spacing("8");
  }
}

// The spacing values are also used by utility classes:
// .mt-4 { margin-top: 1rem; }
// .p-6 { padding: 2rem; }
```

### Breakpoints

Configure responsive breakpoints in `scss/core/_breakpoints.scss`. The system provides both functions and mixins for responsive design with a mobile-first approach.

```scss
// scss/core/_breakpoints.scss includes:
$breakpoints: (
  "xs": 375px,
  "sm": 576px,
  "md": 768px,
  "lg": 992px,
  "xl": 1200px,
  "xxl": 1400px,
);

// Using breakpoint mixin (mobile-first):
@use "../core" as core;
.responsive-element {
  width: 100%;
  padding: core.spacing("4");

  @include core.breakpoint("md") {
    width: 50%;
    padding: core.spacing("6");
  }

  @include core.breakpoint("lg") {
    width: 33.333%;
    padding: core.spacing("8");
  }
}

// Using breakpoint function:
.custom-media-query {
  @media (min-width: core.breakpoint("lg")) {
    // Custom responsive styles
  }
}
```

## Tools & Utilities

The framework provides three types of utilities:

- **Global mixins** in `scss/mixins/` for use within SCSS files
- **Typography functions** in `scss/base/_typography.scss` for unit conversions
- **Utility classes** in `scss/classes/` for direct HTML application

### Global Mixins (in `scss/mixins/`)

Located in `scss/mixins/`, these are used within your SCSS files. The mixins are organized by category for better maintainability.

```scss
// Usage in components (assuming mixins are available via main.scss imports):
@use "../mixins" as mixins;

.visually-hidden-text {
  @include mixins.visually-hidden;
}

.clearfix-container {
  @include mixins.clearfix;
}

.truncated-text {
  @include mixins.truncate-text;
}

.aspect-ratio-video {
  @include mixins.aspect-ratio(16/9);
}

.disabled-button {
  @include mixins.disabled-state;
}
```

Available mixin categories:

- **Accessibility**: `visually-hidden` for screen reader only content
- **Text**: `truncate-text`, `truncate-multiline` for text overflow handling
- **Layout**: `clearfix`, `aspect-ratio` for layout utilities
- **UI**: `disabled-state` for consistent disabled styling

### Typography Functions (in `base/_typography.scss`)

Unit conversion and typography-related functions are included in the base typography module.

```scss
// These functions are available when typography is imported:
@use "../base/typography" as typo;

.element {
  font-size: typo.px-to-rem(18px); // Convert pixels to rem
  line-height: typo.rem-to-px(1.5rem); // Convert rem to pixels
  margin: typo.strip-unit(16px); // Remove unit from value
}
```

### Utility Classes (in `scss/classes/`)

Located in `scss/classes/`, these generate CSS classes for common styling patterns. Apply them directly in HTML.

```html
<!-- Spacing utilities -->
<div class="mt-4 mb-2 p-3">Margin top, margin bottom, padding all sides</div>

<!-- Display utilities -->
<div class="d-flex">Flexbox container</div>
<div class="d-none">Hidden element</div>

<!-- Text alignment -->
<div class="text-center">Centered text</div>
<div class="text-right">Right-aligned text</div>

<!-- Responsive utilities -->
<div class="d-block d-md-flex">Block on mobile, flex on tablet+</div>
```

## Theme System

### Base Styles

Base styles provide sensible defaults for HTML elements and include comprehensive coverage:

- **Reset**: Modern CSS reset with improved defaults (`_reset.scss`)
- **Typography**: Heading hierarchy, base fonts, and utility functions (`_typography.scss`)
- **Interactive Elements**: Button and link styling (`_button.scss`, `_links.scss`)
- **Forms**: Complete form element styling (`_forms.scss`)
- **Content**: Lists, tables, and media elements (`_lists.scss`, `_tables.scss`, `_media.scss`)
- **Structure**: Navigation and footer elements (`_navigation.scss`, `_footer.scss`)
- **Code**: Styling for code elements (`_code.scss`)

### Layout System

#### Container System

The container system provides responsive, centered content wrappers with configurable max-widths and intelligent padding.

```html
<!-- Default container (max-width: 1200px) -->
<div class="container">Content</div>

<!-- Container variations -->
<div class="container container--narrow">Narrow content (max-width: 800px)</div>
<div class="container container--wide">Wide content (max-width: 1600px)</div>
<div class="container container--full">Full width content</div>
```

The container system includes:

- **Responsive padding**: Scales from mobile (1rem) to desktop (2rem)
- **Automatic centering**: Uses auto margins for horizontal centering
- **Flexible max-widths**: Multiple container sizes for different content needs

### Utility Classes

#### Spacing Utilities

```html
<!-- Margin utilities -->
<div class="m-4">All margins (1rem)</div>
<div class="mt-2 mb-4">Top margin (0.5rem) and bottom margin (1rem)</div>
<div class="mx-6">Horizontal margins (2rem)</div>
<div class="my-auto">Vertical margins auto</div>

<!-- Padding utilities -->
<div class="p-8">All padding (3rem)</div>
<div class="px-4 py-2">
  Horizontal padding (1rem) and vertical padding (0.5rem)
</div>
```

#### Display & Flexbox

```html
<!-- Display utilities -->
<div class="d-block">Display block</div>
<div class="d-flex">Display flex</div>
<div class="d-none">Hidden element</div>
<div class="d-inline-block">Display inline-block</div>

<!-- Flexbox utilities -->
<div class="d-flex flex-row">Flex row direction</div>
<div class="d-flex flex-column">Flex column direction</div>

<!-- Responsive display -->
<div class="d-none d-md-block">Hidden on mobile, visible on tablet+</div>
```

#### Text Alignment

```html
<div class="text-left">Left-aligned text</div>
<div class="text-center">Centered text</div>
<div class="text-right">Right-aligned text</div>
```

## Component Development

### Creating a New Component

1. Create the component file in `scss/components/`:

```scss
// scss/components/_alert.scss
@use "../core" as core;

.alert {
  padding: core.spacing("4");
  border: 1px solid transparent;
  border-radius: 4px;
  margin-bottom: core.spacing("4");

  &--success {
    background-color: core.getColor("Success-50");
    border-color: core.getColor("Success-300");
    color: core.getColor("Success-800");
  }

  &--warning {
    background-color: core.getColor("Warning-50");
    border-color: core.getColor("Warning-300");
    color: core.getColor("Warning-800");
  }

  &--danger {
    background-color: core.getColor("Danger-50");
    border-color: core.getColor("Danger-300");
    color: core.getColor("Danger-800");
  }
}
```

2. Add to the components index:

```scss
// scss/components/__index.scss
@forward "alert";
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
// scss/components/_pricing-card.scss
@use "../core" as core;
@use "../mixins" as mixins;

.pricing-card {
  background: core.getColor("White");
  border: 1px solid core.getColor("Light-300");
  border-radius: 8px;
  padding: core.spacing("6");
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px core.getColor("Dark-900", 0.1);
  }

  @include core.breakpoint("md") {
    padding: core.spacing("8");
  }

  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: core.spacing("2");
    color: core.getColor("Dark-800");
  }

  &__price {
    font-size: 2.5rem;
    font-weight: bold;
    color: core.getColor("Primary");
    margin-bottom: core.spacing("4");

    &::before {
      content: "$";
      font-size: 1.5rem;
      vertical-align: top;
    }
  }

  &__features {
    list-style: none;
    padding: 0;
    margin-bottom: core.spacing("6");

    li {
      padding: core.spacing("2") 0;
      border-bottom: 1px solid core.getColor("Light-200");
      color: core.getColor("Dark-600");

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &--featured {
    border-color: core.getColor("Primary");
    position: relative;

    &::before {
      content: "Most Popular";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background: core.getColor("Primary");
      color: core.getColor("White");
      padding: core.spacing("1") core.spacing("3");
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
}
```

### Usage in HTML

```html
<!-- Using container and utility classes -->
<div class="container">
  <div class="d-flex flex-column">
    <!-- Mobile: stacked, larger screens: could use CSS Grid when available -->
    <div class="pricing-card">
      <h3 class="pricing-card__title">Basic</h3>
      <div class="pricing-card__price">9</div>
      <ul class="pricing-card__features">
        <li>Feature 1</li>
        <li>Feature 2</li>
        <li>Email support</li>
      </ul>
      <button class="btn btn--primary">Choose Plan</button>
    </div>

    <div class="pricing-card pricing-card--featured mt-4">
      <h3 class="pricing-card__title">Pro</h3>
      <div class="pricing-card__price">19</div>
      <ul class="pricing-card__features">
        <li>Everything in Basic</li>
        <li>Advanced features</li>
        <li>Priority support</li>
        <li>API access</li>
      </ul>
      <button class="btn btn--primary">Choose Plan</button>
    </div>

    <div class="pricing-card mt-4">
      <h3 class="pricing-card__title">Enterprise</h3>
      <div class="pricing-card__price">39</div>
      <ul class="pricing-card__features">
        <li>Everything in Pro</li>
        <li>Custom integrations</li>
        <li>Dedicated support</li>
        <li>SLA guarantee</li>
      </ul>
      <button class="btn btn--primary">Choose Plan</button>
    </div>
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
