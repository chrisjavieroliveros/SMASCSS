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
- `configs/`: authored config tree with primitive files at the root plus recipe folders for `base/`, `layout/`, and `themes/`
- `configs/_tokens.scss`: primitive emitter that turns the root config files into the shared `:root` custom properties
- `configs/_colors.scss`, `configs/_typography.scss`, `configs/_spacing.scss`, `configs/_shape.scss`, `configs/_effects.scss`, `configs/_sizing.scss`: primitive config files
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

1. `configs/_*.scss`
2. `configs/layout/_*.scss`
3. `configs/base/_*.scss`
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
