# Simplified SMACSS Architecture

A streamlined SCSS architecture based on SMACSS principles with centralized configuration.

## Structure

```
/architecture/
├── main.scss              # Main entry file
├── config/                # Centralized configuration
│   ├── __index.scss       # Forwards all config files
│   ├── _colors.scss       # Color configuration
│   ├── _typography.scss   # Typography configuration
│   ├── _spacing.scss      # Spacing configuration
│   ├── _breakpoints.scss  # Responsive breakpoints
│   ├── _buttons.scss      # Button component configuration
│   └── _functions.scss    # Global utility functions
├── base/                  # Base styles
│   ├── __index.scss       # Initializes CSS variables & forwards files
│   ├── _reset.scss        # Reset/normalize
│   └── _typography.scss   # Typography styles
├── layouts/               # Layout styles
│   ├── __index.scss       # Forwards all layout files
│   ├── _container.scss    # Container styles
│   └── _grid.scss         # Simple grid system
├── components/            # Reusable UI components
│   ├── __index.scss       # Forwards all component files
│   └── _buttons.scss      # Button component
├── utilities/             # Utility classes
│   ├── __index.scss       # Forwards all utility files
│   └── _helpers.scss      # Helper utility classes
└── pages/                 # Page-specific styles
    └── __index.scss       # Forwards all page files
```

## Usage

### 1. Configure Design Tokens

All design configuration is centralized in the `/config` directory. Update these files to change the design system across your entire project:

- Colors: `_colors.scss`
- Typography: `_typography.scss`
- Spacing: `_spacing.scss`
- Breakpoints: `_breakpoints.scss`
- Component configs: `_buttons.scss`, etc.

### 2. Import in your project

```scss
@use "architecture/main";
```

### 3. Create components

Add new components by creating files in the appropriate directory and including them in the corresponding `__index.scss` file.

### 4. Add page-specific styles

For page-specific styles, create new files in the `pages/` directory and import them in `pages/__index.scss`.
