# SMASCSS - Scalable and Modular Architecture for Sassy CSS

## Overview

SMASCSS (Scalable and Modular Architecture for Sassy CSS) is a lightweight, flexible SCSS architecture designed to organize stylesheets in a scalable, maintainable way. It's inspired by methodologies like SMACSS, BEM, and ITCSS, but optimized for modern development workflows.

## Directory Structure

```
scss/
├── abstracts/          # Variables, functions, mixins, etc.
│   ├── _colors.scss    # Color definitions and functions
│   ├── _fonts.scss     # Typography settings
│   ├── _responsive.scss # Breakpoints and media queries
│   ├── _spacing.scss   # Spacing system
│   ├── _mixins.scss    # Reusable mixins
│   ├── _functions.scss # Helper functions
│   └── __index.scss    # Forwards all abstract resources
│
├── base/               # Base styles (reset, typography, etc.)
│   ├── _reset.scss     # CSS reset/normalize
│   ├── _root.scss      # :root CSS variables
│   ├── _typography.scss # Base typography styles
│   ├── _forms.scss     # Form elements styling
│   ├── _lists.scss     # List styling
│   ├── _buttons.scss   # Button styles
│   └── __index.scss    # Forwards all base styles
│
├── layouts/            # Layout components
│   ├── _grid.scss      # Grid system
│   ├── _wrapper.scss   # Container wrappers
│   └── __index.scss    # Forwards all layout styles
│
├── components/         # Reusable UI components
│   └── __index.scss    # Forwards all components
│
├── pages/              # Page-specific styles
│   └── __index.scss    # Forwards all page styles
│
└── main.scss           # Main file that imports all partials
```

## Getting Started

### Installation

1. Clone this repository or download the source files
2. Include the scss directory in your project
3. Import `main.scss` in your build process

```scss
@import "path/to/scss/main";
```

## Using the Abstracts Layer

The Abstracts layer forms the foundation of the SMASCSS architecture. It contains no actual CSS output, but rather holds variables, functions, and mixins that are used throughout the rest of the codebase.

### Colors (`_colors.scss`)

The colors system provides a centralized palette and utility functions for consistent color usage throughout your project.

```scss
// Access colors using the getColor function
.example {
  color: getColor(Primary);
  background-color: getColor(Light-100);
  border-color: getColor(Secondary);
}

// Use with opacity
.transparent-element {
  background-color: getColorWithOpacity(Primary, 0.5);
}
```

Key features:

- Centralized color definitions in a Sass map
- CSS variables automatically generated for all colors
- Helper functions for accessing colors consistently
- Support for opacity adjustments

### Typography (`_fonts.scss`)

Typography settings provide consistent font styles and responsive scaling.

```scss
// Using font variables
.custom-element {
  font-family: $font-family-heading;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
  line-height: $line-height-snug;
}

// Text truncation mixin
.truncated-text {
  @include text-truncate;
}

// Responsive font sizing
.responsive-heading {
  @include responsive-font-size($font-size-2xl, 320px, 1200px);
}
```

Key features:

- Font family definitions
- Consistent font weight scale
- Modular type scale for font sizes
- Line height and letter spacing presets
- Responsive typography helpers

### Responsive (`_responsive.scss`)

Breakpoint and media query utilities for consistent responsive design.

```scss
.responsive-component {
  // Base styles for mobile

  @include breakpoint("md") {
    // Styles for medium screens and up
  }

  @include breakpoint("lg") {
    // Styles for large screens and up
  }

  @include breakpoint-between("sm", "lg") {
    // Only apply between small and large breakpoints
  }

  @include breakpoint-down("sm") {
    // Only apply below the small breakpoint
  }
}
```

Key features:

- Predefined breakpoint map (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`)
- Support for custom breakpoint values
- Direction-specific media queries (up, down, between)

### Spacing (`_spacing.scss`)

A consistent spacing system for margins, paddings, and layout.

```scss
.spaced-component {
  padding: spacing("4"); // 1rem
  margin-bottom: spacing("6"); // 2rem
  gap: $gap-md; // 1rem

  // Container paddings
  padding-left: $container-padding-sm;
  padding-right: $container-padding-sm;

  @include breakpoint("md") {
    padding: spacing("5"); // 1.5rem
  }
}
```

Key features:

- Consistent spacing scale based on a base unit (0.25rem)
- Named spacing variables for semantic usage
- Container-specific padding values
- Section and component spacing presets
- Gap values for grid and flex layouts

## Best Practices

### Importing Abstracts

When working with a file that needs access to abstract resources, import only what you need:

```scss
@use "../abstracts/colors" as colors;
@use "../abstracts/spacing" as spacing;
@use "../abstracts/responsive" as responsive;

.component {
  color: colors.getColor(Primary);
  padding: spacing.spacing("4");

  @include responsive.breakpoint("md") {
    padding: spacing.spacing("6");
  }
}
```

### Using CSS Variables

The system automatically generates CSS variables from the color definitions. Use them in your CSS when appropriate:

```css
.component {
  color: var(--color-Primary);
  background-color: var(--color-Light-100);
}
```

### Avoiding Abstracts in Component Files

Keep your component files focused on their specific styling concerns:

```scss
// Good
@use "../abstracts/colors" as colors;

.card {
  color: colors.getColor(Dark-600);
}

// Avoid
.card {
  // Don't put color definitions here
  $card-color: #333;
  color: $card-color;
}
```

## Contributing

Please read the contribution guidelines before submitting pull requests.

## License

[Add your license information here]
