# CLAUDE.md

The operational guide for AI agents in this repo is **[AGENTS.md](AGENTS.md)** —
read it first. It is the single source of truth so the two files never drift.

The full architecture spec is **[README.md](README.md)**.

## The five things to never get wrong

1. **Don't touch build tooling.** An external compiler auto-globs non-partial
   `.scss` → flat `.css` (basename only) under `assets/css/`. Manual `npx sass`
   is only for verifying the preview, never the project's build.
2. **Cascade order is canonical** in [`src/_layers.scss`](src/_layers.scss):
   `config, reset, base, layout, primitive, component, page, override`. Every
   entry `@use "_layers";` first. `config/` (the design tokens, → `config.css`)
   loads first and is **REQUIRED** — consumers read `var(--ui-token)` with no
   literal fallback, so nothing renders correctly until config is present.
3. **Folder maps 1:1 to layer.** `base/` = global element defaults (reset,
   `:root`, typography, media); `primitives/` = opt-in `@layer primitive`
   (`button, .btn`, form, input, textarea, table, `.ui-card`), no `_index`;
   `components/` = `@layer component` blocks; pages `@use` only what they render.
   Exception: `abstracts/` is pure Sass tools (`responsive` mixins + the `emit`
   token emitter) — no layer,
   emits no CSS, `@use`'d only where a media query is needed.
4. **Variants only reassign `--_*` private vars** — never restate structural CSS.
   Each themeable property reads `--_x: var(--ui-token)` (config is required, so
   no literal fallback; an optional override hook may chain to the token:
   `var(--ui-hook, var(--ui-token))`). Behavioral CSS-keyword defaults (`0`,
   `currentColor`, `underline`) may stay inline — config doesn't own those.
5. **Keep README.md, AGENTS.md, and library.html in sync** with any structural
   change, and verify computed styles (not screenshots) in the preview.
