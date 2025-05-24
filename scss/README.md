# SMACSS SCSS Architecture

A scalable and modular SCSS architecture based on SMACSS methodology, designed for easy configuration swapping between different websites and projects.

## Architecture Overview

```
scss/
├── main.scss                    # Entry point - imports all modules
├── config.scss                  # 🎨 CONFIGURATION entry point
├── config/                      # 🎨 CONFIGURATION (modify per website)
│   ├── __index.scss             # Config module forwarding
│   ├── _colors.scss             # Color palette and variables
│   ├── _typography.scss         # Typography settings
│   ├── _spacing.scss            # Spacing and sizing
│   ├── _breakpoints.scss        # Responsive breakpoints
│   ├── _buttons.scss            # Button configurations
│   └── _functions.scss          # Utility functions (legacy reference)
├── tools/                       # 🔧 TOOLS (SCSS utilities)
│   ├── __index.scss             # Tools module forwarding
│   ├── _unit-conversion.scss    # Unit conversion functions
│   ├── _layout.scss             # Layout utilities and functions
│   ├── _breakpoints.scss        # Responsive media query mixins
│   ├── _accessibility.scss     # Accessibility mixins
│   ├── _text.scss               # Text manipulation utilities
│   └── _css-variables.scss      # CSS custom property generators
└── theme/                       # 🎭 THEME (reusable across websites)
    ├── base/                    # Base styles and resets
    ├── components/              # Reusable UI components
    ├── layouts/                 # Layout and grid systems
    ├── pages/                   # Page-specific styles
    └── utilities/               # Utility classes
```

## Key Concept: Config vs Theme vs Tools

### 📁 **Config Directory** (Website-Specific)

- Contains all the **design tokens** that change between websites
- Colors, typography, spacing, breakpoints, etc.
- **This is what you modify** for each new website/project
- Easy to swap out completely

### 🔧 **Tools Directory** (SCSS Utilities)

- Contains all **SCSS functions and mixins** for development
- Unit conversion, responsive breakpoints, accessibility helpers, etc.
- **Shared across all projects** - rarely needs modification
- Organized into logical modules for better maintainability

### 📁 **Theme Directory** (Reusable)

- Contains all the **components and styling logic**
- Buttons, cards, layouts, utilities, etc.
- **This stays consistent** across all websites
- Uses config variables and tools utilities to style components

## Usage for Different Websites

### Setup for Website A

```bash
# Copy the entire SCSS folder
cp -r scss/ website-a/scss/

# Modify only the config files
vim website-a/scss/config/_colors.scss      # Website A's brand colors
vim website-a/scss/config/_typography.scss  # Website A's fonts
vim website-a/scss/config/_spacing.scss     # Website A's spacing
```

### Setup for Website B

```bash
# Copy the entire SCSS folder
cp -r scss/ website-b/scss/

# Modify only the config files
vim website-b/scss/config/_colors.scss      # Website B's brand colors
vim website-b/scss/config/_typography.scss  # Website B's fonts
vim website-b/scss/config/_spacing.scss     # Website B's spacing
```

## Benefits

✅ **Easy Branding**: Change colors, fonts, spacing in one place  
✅ **Consistent Components**: Same button/card/layout logic everywhere  
✅ **Quick Setup**: Copy folder → modify config → done  
✅ **Maintainable**: Updates to theme logic benefit all websites  
✅ **Scalable**: Add new components once, use everywhere

## Getting Started

1. **Import the main file** in your build process:

   ```scss
   @import "scss/main.scss";
   ```

2. **Customize the config** for your project:

   - Edit `config/_colors.scss` with your brand colors
   - Edit `config/_typography.scss` with your fonts
   - Edit `config/_spacing.scss` with your spacing preferences

3. **Use the components** in your HTML:

   ```html
   <button class="btn btn--primary">Click me</button>
   <div class="card">...</div>
   ```

4. **Build your CSS** using your preferred build tool (Sass, Webpack, Vite, etc.)

## Adding New Components

When adding new components to the theme:

1. Create the component file in `theme/components/`
2. Import config variables: `@use "../../config" as config;`
3. Import tools if needed: `@use "../../tools" as tools;`
4. Use config variables and tools utilities instead of hard-coded values
5. Add the component to `theme/components/__index.scss`

Example component using both config and tools:

```scss
// theme/components/_my-component.scss
@use "../../config" as config;
@use "../../tools" as tools;

.my-component {
  color: config.color("primary");
  font-size: tools.px-to-rem(16px);

  @include tools.breakpoint("md") {
    font-size: tools.px-to-rem(18px);
  }

  @include tools.focus-ring;
}
```

This ensures the component will work with any configuration and has access to all utility functions.

## Tools Usage

The tools directory provides utility functions and mixins:

```scss
@use "tools" as tools;

// Unit conversion
$rem-value: tools.px-to-rem(16px);

// Responsive breakpoints
@include tools.breakpoint("md") { ... }

// Accessibility helpers
@include tools.visually-hidden;

// Layout utilities
@include tools.aspect-ratio(16/9);

// Text utilities
@include tools.truncate-text;
```

See `tools/README.md` for complete documentation.

---

**Author**: Chris Javier Oliveros  
**Version**: 2.0.0  
**License**: MIT
