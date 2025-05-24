# SCSS Tools Directory

This directory contains SCSS utilities, functions, and mixins organized into logical groupings for better maintainability and developer experience.

## Directory Structure

```
tools/
├── __index.scss              # Main entry point that forwards all modules
├── _unit-conversion.scss     # Unit conversion functions
├── _layout.scss             # Layout-related functions and mixins
├── _breakpoints.scss        # Responsive media query mixins
├── _accessibility.scss      # Accessibility-focused mixins
├── _text.scss              # Text manipulation utilities
└── _css-variables.scss     # CSS custom property generators
```

## Usage

Import the tools namespace once in your SCSS file:

```scss
@use "../tools" as tools;
```

Then use any function or mixin with the `tools.` prefix:

```scss
// Unit conversion
$rem-value: tools.px-to-rem(16px);
$px-value: tools.rem-to-px(1.5rem);
$unitless: tools.strip-unit(24px);

// Layout utilities
$fluid: tools.fluid-space(1rem, 2rem, 320px, 1200px);
@include tools.aspect-ratio(16/9);
@include tools.clearfix;

// Responsive breakpoints
@include tools.breakpoint("md") {
  display: flex;
}

@include tools.breakpoint-down("lg") {
  display: block;
}

// Accessibility
@include tools.visually-hidden;
@include tools.focus-ring;

// Text utilities
@include tools.truncate-text;
@include tools.truncate-multiline(3);

// CSS variables (call once in base styles)
@include tools.generate-color-variables();
@include tools.generate-typography-variables();
@include tools.generate-spacing-variables();
@include tools.generate-breakpoint-variables();
@include tools.generate-button-variables();
```

## Module Details

### Unit Conversion (`_unit-conversion.scss`)

- `strip-unit($value)` - Remove units from a value
- `px-to-rem($px, $base-font-size)` - Convert pixels to rem
- `rem-to-px($rem, $base-font-size)` - Convert rem to pixels

### Layout (`_layout.scss`)

- `fluid-space($min, $max, $min-bp, $max-bp)` - Calculate fluid spacing with clamp()
- `aspect-ratio($ratio)` - Set aspect ratio
- `clearfix()` - Clear floated elements

### Breakpoints (`_breakpoints.scss`)

- `breakpoint($size)` - Min-width media query
- `breakpoint-down($size)` - Max-width media query

### Accessibility (`_accessibility.scss`)

- `visually-hidden()` - Hide element visually but keep for screen readers
- `focus-ring($color, $width, $offset)` - Add accessible focus styling

### Text (`_text.scss`)

- `truncate-text()` - Single-line text truncation with ellipsis
- `truncate-multiline($lines)` - Multi-line text truncation

### CSS Variables (`_css-variables.scss`)

- `generate-color-variables()` - Generate color CSS custom properties
- `generate-typography-variables()` - Generate typography CSS custom properties
- `generate-spacing-variables()` - Generate spacing CSS custom properties
- `generate-breakpoint-variables()` - Generate breakpoint CSS custom properties
- `generate-button-variables()` - Generate button CSS custom properties

## Best Practices

1. **Import Once**: Import the tools namespace once per file rather than importing individual modules
2. **Consistent Naming**: Always use the `tools.` prefix for clarity
3. **CSS Variables**: Call the `generate-*-variables()` mixins only once in your base styles
4. **Documentation**: Each function and mixin includes JSDoc-style comments with examples

## Migration from Old Structure

If you're migrating from the old consolidated `_functions.scss` and `_mixins.scss` files:

**Old:**

```scss
@use "../tools/functions" as functions;
@use "../tools/mixins" as mixins;

$rem: functions.px-to-rem(16px);
@include mixins.breakpoint("md") { ... }
```

**New:**

```scss
@use "../tools" as tools;

$rem: tools.px-to-rem(16px);
@include tools.breakpoint("md") { ... }
```
