# CLAUDE.md

The operational guide for AI agents in this repo is **[AGENTS.md](AGENTS.md)** —
read it first. It is the single source of truth so the two files never drift.

The full architecture spec is **[README.md](README.md)**.

## The five things to never get wrong

1. **Don't touch build tooling.** An external compiler auto-globs non-partial
   `.scss` → flat `.css` (basename only) under `assets/css/`. Manual `npx sass`
   is only for verifying the preview, never the project's build.
2. **Cascade order is canonical** in [`src/_layers.scss`](src/_layers.scss):
   `variables, reset, base, layout, primitive, component, page, override`. Every
   entry `@use "_layers";` first.
3. **Folder maps 1:1 to layer.** `base/` = global element defaults (reset,
   `:root`, typography, media); `primitives/` = opt-in `@layer primitive`
   (`button, .btn`, form, input, textarea, table, `.ui-card`), no `_index`;
   `components/` = `@layer component` blocks; pages `@use` only what they render.
   Exception: `abstracts/` is pure Sass tools (`responsive` mixins) — no layer,
   emits no CSS, `@use`'d only where a media query is needed.
4. **Variants only reassign `--_*` private vars** — never restate structural CSS.
   Each themeable property reads `--_x: var(--ui-token, #literal)`.
5. **Keep README.md, AGENTS.md, and library.html in sync** with any structural
   change, and verify computed styles (not screenshots) in the preview.
