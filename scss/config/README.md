# Configuration System

This directory contains all the design tokens and configuration files for your SCSS architecture. Each website/project should have its own version of this config directory.

## Structure

```
config/
├── README.md              # This file
├── _colors.scss           # Color palette and variables
├── _typography.scss       # Font families, sizes, weights, etc.
├── _spacing.scss          # Margins, paddings, gaps
├── _breakpoints.scss      # Responsive breakpoints
├── _buttons.scss          # Button-specific configurations
└── _functions.scss        # SCSS functions and mixins
../config.scss             # Main config entry point - imports all config modules
```

## How to Swap Configurations

### Method 1: Replace the entire config directory

1. Create a new config directory for your project (e.g., `config-website-a/`)
2. Copy this config directory structure
3. Modify the values in each file to match your design requirements
4. When switching projects, replace the entire `config/` directory

### Method 2: Use version control branches

1. Create different branches for different configurations
2. Keep your config changes in separate branches
3. Switch branches to switch configurations

### Method 3: Symbolic links (Advanced)

1. Keep multiple config directories: `config-default/`, `config-website-a/`, etc.
2. Use a symbolic link for the active config:
   ```bash
   ln -sf config-website-a config
   ```

## Configuration Files

### `_colors.scss`

Define your color palette, including:

- Primary, secondary, accent colors
- Neutral colors (grays, whites, blacks)
- Semantic colors (success, warning, error, info)
- Component-specific colors

### `_typography.scss`

Configure typography settings:

- Font families (primary, secondary, monospace)
- Font sizes and scales
- Font weights
- Line heights
- Letter spacing

### `_spacing.scss`

Set up spacing system:

- Base spacing unit
- Spacing scale (margins, paddings)
- Component-specific spacing

### `_breakpoints.scss`

Define responsive breakpoints:

- Mobile, tablet, desktop breakpoints
- Container max-widths
- Media query mixins

### `_buttons.scss`

Button configuration:

- Button sizes
- Button styles and variants
- Button states (hover, active, disabled)

### `_functions.scss`

Utility functions and mixins:

- Color manipulation functions
- Spacing functions
- Responsive mixins
- Helper functions

## Best Practices

1. **Keep configurations atomic**: Each file should focus on one aspect of the design
2. **Use semantic naming**: Name variables based on their purpose, not their appearance
3. **Document your values**: Add comments explaining design decisions
4. **Maintain consistency**: Use consistent naming conventions across all config files
5. **Version your configs**: Keep track of configuration changes for each project

## Example Usage

```scss
// In your components
@use "../config" as config;

.my-component {
  color: config.$primary-color;
  font-family: config.$font-family-primary;
  padding: config.$spacing-md;

  @include config.respond-to("tablet") {
    padding: config.$spacing-lg;
  }
}
```

## Project-Specific Configurations

When creating a new project configuration:

1. Copy the entire config directory
2. Rename it to something descriptive (e.g., `config-ecommerce`, `config-portfolio`)
3. Modify each file to match your project's design requirements
4. Replace the active config directory when switching projects
5. Document any project-specific configuration decisions

This approach allows you to maintain the same component and utility structure while completely changing the visual appearance through configuration swaps.
