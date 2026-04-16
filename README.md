# SMASCSS

SMASCSS is now being rebuilt as a config-driven UI CSS library.

SCSS is the authored source. The source is now split into `/library` and `/configs`.

- `/library` contains the actual base, layout, and component CSS rules.
- `/configs` contains the mirrored primitive and recipe files that drive `/library`.

The checked-in CSS files at the repo root are still the current browser-consumable outputs for the demos until a Sass build step is added.

## Step 0 Contract

- `/library/**/*.scss` contains the emitted style rules, organized as `base`, `layout`, and `components`.
- `/configs/**/*.scss` contains the authored configuration for primitives, recipes, and themes.
- `configs/config.scss` is the config entrypoint and composes the authored config files.
- `library/main.scss` is the library entrypoint and composes the emitted style rules.
- `config.css` mirrors the config layer for browser loading.
- `core.css` mirrors the foundation layer and provides reset, typography, layout primitives, and shared helpers only.
- `components/*.css` mirror the component layer and are isolated entrypoints.
- Public semantic APIs in v1 are `.ui-button`, `.ui-input`, `.ui-textarea`, and `.ui-card`.
- `legacy/` contains the previous SCSS implementation for reference only.

## Files

- `library/`: authored source split into `base/`, `layout/`, and `components/`
- `configs/`: authored config tree with public entrypoints plus `abstracts/`, `helpers/`, and recipe folders for `base/`, `layout/`, and `themes/`
- `configs/_tokens.scss`: primitive emitter entrypoint that turns the abstract config maps into shared `:root` custom properties
- `configs/abstracts/_*.scss`: primitive config maps for color, type, spacing, shape, effects, and sizing
- `configs/helpers/_custom-properties.scss`: helper mixin for emitting custom properties
- `config.css`: default design system and component recipes
- `themes/midnight.css`: example swap-in theme override
- `core.css`: foundations only
- `components/button.css`: button bundle
- `components/input.css`: input and textarea bundle
- `components/card.css`: card bundle
- `index.html`: default theme demo
- `midnight.html`: alternate theme demo with identical markup contract

## Loading Model

Source files to edit:

1. `configs/abstracts/_*.scss`
2. `configs/base/_*.scss`
3. `configs/layout/_*.scss`
4. `configs/themes/*.scss`
5. `library/base/_*.scss`
6. `library/layout/_*.scss`
7. `library/components/_*.scss`

Browser load order:

1. `config.css`
2. Optional theme override such as `themes/midnight.css`
3. `core.css`
4. Any component bundles you need

This keeps the configuration boundary simple and allows consumers to lazy-load only the component CSS they use.
