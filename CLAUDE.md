# CLAUDE.md

The operational guide for AI agents in this repo is **[AGENTS.md](AGENTS.md)** —
read it first. It is the single source of truth so the two files never drift.

The full architecture spec is **[README.md](README.md)**.

## The five things to never get wrong

1. **Don't touch build tooling.** An external compiler auto-globs non-partial
   `.scss` → flat `.css` (basename only) under `assets/css/`. Manual `npx sass`
   is only for verifying the preview, never the project's build.
2. **No CSS `@layer` — cascade is by source/link order.** `main.css` (the
   globals) is linked first; each page bundle (`<page>.css`) is linked after, so
   it wins; unlayered host CSS always wins last. Inside the build, order is set
   by `@forward` order in the `_index` files (`global/`: base → layouts →
   helpers, helpers last so utilities win) and by `@use` order in a page bundle.
   The design **tokens are REQUIRED** and now ship in `main.css` (there is no
   separate `variables.css`): consumers read `var(--ui-token)` / `var(--color-*)`
   with no literal fallback, so `main.css` must load on every page.
3. **Folder maps 1:1 to tier** (mirrors the Partners microsite):
   - `abstracts/` = pure Sass tools, emit ~no CSS — `_breakpoints.scss`
     (responsive mixins + `responsive-prop` + `reduced-motion`/`dark-mode`/
     `retina`) and `_sizing.scss` (the `$space` map → `--ui-space-*`, read by the
     helpers). `@use`'d only where needed.
   - `global/` = everything that ships site-wide in `main.css`, via
     `global/_index.scss` (`@forward "base"; "layouts"; "helpers";`):
     `base/` = design tokens (inline `:root`: colors, radius, shadows,
     transitions, typography) + reset + element defaults; `layouts/` = structural
     wrappers (container, stack, cluster, grid, center); `helpers/` = utility
     classes (margin, padding — `!important`), forwarded LAST.
   - `scoped/` = per-page opt-in — `primitives/` (`button, .btn`, form, input,
     textarea, table, `.ui-card`), `components/` (composed blocks), `pages/`
     (the entries → `<page>.css`). A page `@use`s only what it renders.
4. **Tokens are inline `:root` blocks; variants only reassign `--_*` private
   vars** — never restate structural CSS. Tokens live where their concern does
   (`global/base/_colors.scss` etc.; spacing in `abstracts/_sizing.scss`), each
   emitted by a plain `:root { @each … }` — no central emitter. Each themeable
   property reads `--_x: var(--ui-token)` (tokens are required, so no literal
   fallback; an optional override hook may chain: `var(--ui-hook, var(--ui-token))`).
   Behavioral CSS-keyword defaults (`0`, `currentColor`, `underline`) and a
   trivial `1px` hairline may stay inline.
5. **Keep README.md, AGENTS.md, and library.html in sync** with any structural
   change, and verify computed styles (not screenshots) in the preview.
