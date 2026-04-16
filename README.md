# SMASCSS

SMASCSS is being rebuilt as a config-driven UI CSS library.

The authored SCSS is split into two responsibilities:

- `/configs` defines the design system contract: tokens, semantic defaults, recipes, and themes.
- `/library` defines the implementation: global element styles, layout styles, and isolated component styles.

The checked-in CSS under `assets/css/` is still demo output until a Sass build step is added.

## Architecture

### `configs/`

- `configs/config.scss`
  The single config entrypoint. Compile this into your global config CSS.
- `configs/tokens/`
  Primitive design values and the token emitter.
- `configs/defaults/`
  Semantic HTML defaults for root, typography, media, forms, and tables.
- `configs/recipes/`
  Variable recipes for layout and component behavior.
- `configs/themes/`
  Optional override layers that swap the feel of the system without changing selectors.
- `configs/helpers/`
  Sass-only helpers used by the config pipeline.

### `library/`

- `library/main.scss`
  Global-only stylesheet. It includes reset, semantic base styles, and shared layout.
- `library/components/_*-core.scss`
  Component implementation partials. Keep component styles isolated here without coupling them to `main.scss`.

## Editing Surface

Adjust these files when branding or configuring a project:

1. `configs/tokens/_*.scss`
2. `configs/defaults/_*.scss`
3. `configs/recipes/**/*.scss`
4. `configs/themes/*.scss`

Adjust these files when changing the implementation itself:

1. `library/base/_*.scss`
2. `library/layout/_*.scss`
3. `library/components/_*-core.scss`

## Loading Model

Runtime load order should be:

1. `config.css`
2. Optional theme override such as `themes/midnight.css`
3. `main.css`
4. Any page-level component CSS you choose to compile and load later

That keeps the design system centralized while leaving component delivery flexible.

## Notes

- Public semantic APIs in v1 are `.ui-button`, `.ui-input`, `.ui-textarea`, and `.ui-card`.
- The full legacy palette is exposed as CSS variables like `var(--color-primary-500)`.
- `legacy/` remains as reference only.
