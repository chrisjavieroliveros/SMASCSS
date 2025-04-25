# SMASCSS - Scalable and Modular Architecture for SCSS

SMASCSS is a thoughtful SCSS architecture designed to create maintainable, scalable, and organized stylesheets. It combines principles from SMACSS (Scalable and Modular Architecture for CSS) with the power of SCSS to deliver a robust system for styling modern web applications.

## Table of Contents

- [Core Principles](#core-principles)
- [Folder Structure](#folder-structure)
- [Usage Guide](#usage-guide)
- [Abstracts Layer](#abstracts-layer)
- [Base Layer](#base-layer)
- [Layout Layer](#layout-layer)
- [Components Layer](#components-layer)
- [Pages Layer](#pages-layer)
- [Best Practices](#best-practices)

## Core Principles

SMASCSS is built on several foundational principles:

1. **Modularity** - Each style block serves a single purpose and can be reused throughout the project
2. **Scalability** - The architecture scales from small projects to enterprise applications
3. **Maintainability** - Code is organized in a way that makes future changes straightforward
4. **Readability** - Naming conventions and organization make the codebase easy to understand
5. **Performance** - The structure encourages efficient CSS output

## Folder Structure

```
scss/
├── abstracts/           # Utilities with no direct output
│   ├── __index.scss     # Forwards all abstract modules
│   ├── _colors.scss     # Color variables and functions
│   ├── _fonts.scss      # Typography variables and mixins
│   ├── _functions.scss  # SCSS functions
│   ├── _mixins.scss     # SCSS mixins
│   ├── _responsive.scss # Breakpoint handling
│   └── _spacing.scss    # Spacing system
│
├── base/                # Base styles and resets
│   ├── __index.scss     # Forwards all base styles
│   ├── _reset.scss      # Element reset styles
│   ├── _root.scss       # :root variables (CSS custom properties)
│   ├── _typography.scss # Text styling fundamentals
│   ├── _lists.scss      # List styling
│   ├── _buttons.scss    # Button element styling
│   └── _forms.scss      # Form element styling
│
├── components/          # Reusable UI components
│   └── __index.scss     # Forwards all component modules
│
├── layouts/             # Layout and structure components
│   ├── __index.scss     # Forwards all layout modules
│   ├── _grid.scss       # Grid system
│   └── _wrapper.scss    # Container wrappers
│
├── pages/               # Page-specific styles
│   └── __index.scss     # Forwards all page-specific styles
│
└── main.scss            # Main file that imports all partials
```

## Usage Guide

The architecture follows a methodology where styles are imported in a specific order to ensure proper cascading:

1. **Abstracts** - Imported first, but don't generate CSS on their own
2. **Base** - Fundamental styles applied to HTML elements
3. **Layouts** - Major layout components defining the structure
4. **Components** - Reusable UI components
5. **Pages** - Page-specific overrides when necessary

Import the main stylesheet in your project to get access to all styles:

```scss
@use "path/to/scss/main";
```

## Abstracts Layer

The abstracts layer contains tools and helpers used across the project with no direct CSS output:

- **Colors** - A comprehensive color system with semantic naming and helper functions
- **Spacing** - A consistent spacing scale for margins, paddings, and gaps
- **Responsive** - Breakpoint definitions and media query mixins
- **Fonts** - Typography settings including font families, sizes, and weights
- **Functions** - Utility functions for various calculations
- **Mixins** - Reusable style patterns

Example usage:

```scss
.element {
  color: getColor(Primary);
  margin-bottom: spacing(4);

  @include responsive.breakpoint("md") {
    margin-bottom: spacing(6);
  }
}
```

## Base Layer

The base layer defines the foundation styles that are applied directly to HTML elements:

- **Reset** - Normalizes browser inconsistencies
- **Root** - Sets up CSS custom properties (variables)
- **Typography** - Basic text styling and heading hierarchies
- **Lists** - Default styling for list elements
- **Buttons** - Core button styling
- **Forms** - Basic form element styling

These styles act as a foundation and can be extended or overridden by more specific styles.

## Layout Layer

The layout layer contains major structural components:

- **Grid** - A flexible grid system with responsive classes
- **Wrapper** - Container components for content width control

Example usage:

```html
<div class="global-wrapper">
  <div class="grid grid--md-2 grid--lg-4">
    <div>Content block 1</div>
    <div>Content block 2</div>
    <div>Content block 3</div>
    <div>Content block 4</div>
  </div>
</div>
```

## Components Layer

The components layer contains reusable UI components that make up the interface:

- Individual components like cards, alerts, modals, etc.
- Each component is independent and can be used anywhere

## Pages Layer

The pages layer contains page-specific styles that are unique to individual pages:

- Should be used sparingly, as most styles should be abstracted to components
- Contains exceptions and specific overrides needed for unique page layouts

## Best Practices

1. **Follow the naming convention** - Use consistent BEM-style naming: `.block__element--modifier`
2. **Keep selectors flat** - Avoid deep nesting to improve CSS specificity management
3. **Create new components** - When a pattern repeats, abstract it to a component
4. **Use the abstracts tools** - Leverage the provided functions and mixins for consistency
5. **Comment your code** - Add comments for any complex logic or non-obvious styling
6. **Mobile-first approach** - Start with mobile styles and use breakpoint mixins to scale up
7. **Maintain the structure** - Place new files in their appropriate folders
8. **Use forward patterns** - Make sure to update the `__index.scss` files when adding new partials

---

This architecture is designed to grow with your project. Feel free to extend it with additional components, layouts, or abstract utilities as needed.
