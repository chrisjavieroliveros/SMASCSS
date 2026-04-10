# SMASCSS

SMASCSS is now being rebuilt as a config-driven UI CSS library.

SCSS is the authored source. The source is now split into `/library` and `/config`.

- `/library` contains the actual component and foundation CSS rules.
- `/config` contains the mirrored token and recipe files that drive `/library`.

The checked-in CSS files at the repo root are still the current browser-consumable outputs for the demos until a Sass build step is added.

## Step 0 Contract

- `/library/**/*.scss` contains the emitted style rules.
- `/config/**/*.scss` contains mirrored config for tokens and component recipes.
- `config/config.scss` is the config entrypoint and composes the mirrored config files.
- `library/library.scss` is the library entrypoint and composes the emitted style rules.
- `config.css` mirrors the config layer for browser loading.
- `core.css` mirrors the foundation layer and provides reset, typography, layout primitives, and shared helpers only.
- `components/*.css` mirror the component layer and are isolated entrypoints.
- Public semantic APIs in v1 are `.ui-button`, `.ui-input`, `.ui-textarea`, and `.ui-card`.
- `legacy/` contains the previous SCSS implementation for reference only.

## Files

- `library/`: authored library rules
- `config/`: authored config tree that mirrors the library structure
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

1. `config/tokens.scss`
2. `config/base/*.scss`
3. `config/themes/*.scss`
4. `library/foundations/core.scss`
5. `library/base/*.scss`

Browser load order:

1. `config.css`
2. Optional theme override such as `themes/midnight.css`
3. `core.css`
4. Any component bundles you need

This keeps the configuration boundary simple and allows consumers to lazy-load only the component CSS they use.
