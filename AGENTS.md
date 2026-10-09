# AGENTS.md

Operating guide for AI agents working in **SMASCSS** — a variable-driven,
per-page-optimized SCSS system. [`README.md`](README.md) is the canonical spec;
this file is the short version plus the rules that are easy to get wrong.

---

## The one-paragraph mental model

Design values live as CSS custom properties emitted inline in `:root` and ship in
`main.css` — the always-loaded baseline: **design tokens** (palette + scales) +
reset + global element defaults + layout primitives + utility helpers, and
**nothing component-level**. The tokens are **REQUIRED**: every reusable piece
reads `var(--color-*)` / `var(--ui-*)` directly with no literal fallback, so
`main.css` must load everywhere. Each *page* then ships its own bundle
(`scoped/pages/<name>.scss` → `<page>.css`) that `@use`s only the primitives and
composed blocks it renders. There is **no CSS `@layer`** — precedence is by
source/link order: `main.css` links first, the page bundle links after and wins,
and unlayered host CSS always wins last. The same source drops into Astro, a
WordPress block, or Elementor with just `main.css` loaded alongside the piece.

---

## Hard rules (do not violate)

1. **Do not design, configure, or "fix" build tooling.** The user has their own
   external compiler. It auto-globs every non-partial `.scss` into a matching
   `.css` with **flat output** (basename only) under `assets/css/` as
   `*.min.css`. Never add a bundler, a build script, a `package.json` build
   step, or a config for globbing. It already exists and is out of scope.
2. **Compiling manually is only for verifying the preview.** Use
   `npx sass <entry> <out>` to check your work renders; it is not the project's
   build. Output is by **basename**, so entry basenames must be globally unique
   across the whole tree (a second `main.scss` anywhere would clobber the root
   entry). Current entries: `src/main.scss` → `main.css`, and each
   `src/scoped/pages/<name>.scss` → `<name>.css`.
3. **No CSS `@layer` — order is everything.** There is no `_layers.scss`. Cascade
   precedence comes from (a) `@forward` order inside the `_index` files —
   `global/_index.scss` forwards **base → layouts → helpers**, helpers last so
   utilities win; `global/base/_index.scss` forwards reset first, then tokens,
   then element defaults — and (b) `<link>`/`@use` order: `main.css` before the
   page bundle. Don't reintroduce `@layer` without the user asking.
4. **Never restate structural CSS in a variant.** Variants (`[data-variant]`,
   `[data-size]`, `[data-tone]`, `[data-pad]`) may *only* reassign `--_*`
   private vars. See the recipe below.
5. **Keep `README.md`, `library.html`, and this file in sync** with any
   structural change (new folder/tier, moved file, renamed token). The README
   is the contract; a structural change that leaves it stale is incomplete.
6. **Don't trust screenshots for exact colors, sizes, or spacing.** Verify
   computed styles with `preview_inspect` / `preview_eval`. JPEG artifacts have
   caused false "wrong color" conclusions here before.

---

## Folder → tier map (1:1)

| Folder | Ships in | What lives there |
|--------|----------|------------------|
| `abstracts/` | *nothing* (Sass tools) | `_breakpoints.scss` — responsive mixins (`mobile-up` … `desktop-xl-down`, `responsive-prop`, `reduced-motion`/`dark-mode`/`retina`); `_sizing.scss` — the `$space` map that emits `--ui-space-*` and is read by the helpers. Emit no CSS on their own (bar the sizing tokens). `@use`'d where needed. |
| `global/base/` | `main.css` | design **tokens** as inline `:root` blocks — `_colors` (palette, case-preserved `--color-<Name>`), `_radius`, `_shadows`, `_transitions`, plus `_typography` (font/size/weight/line-height tokens) — **and** the element defaults that read them: `_reset`, `_root`, `_typography`, `_media`. `_index` forwards reset → tokens → elements. |
| `global/layouts/` | `main.css` | layout primitives: `container`, `stack`, `cluster`, `grid`, `center`. |
| `global/helpers/` | `main.css` | utility classes: `_margin`, `_padding` (from the `$space` scale, `!important`). Forwarded **last** so they win. |
| `scoped/primitives/` | per page (`@use` each) | **opt-in** pieces: `button, .btn`, `form`, `input`, `textarea`, `table`, `.ui-card`. |
| `scoped/components/` | per page (`@use` each) | composed reusable blocks: `.hero`. |
| `scoped/pages/` | it *is* the page → `<page>.css` | one flat entry per page; `@use`s its primitives/components, then page-specific tweaks. |

Notes:
- `global/_index.scss` (`@forward "base"; "layouts"; "helpers";`) is the single
  entry `main.scss` pulls; `main.scss` also `@use`s `abstracts/sizing` so the
  `--ui-space-*` tokens ship in `main.css`.
- Nothing component-level ships in `main.css`. Every control — including
  `button, .btn` — is an **opt-in `scoped/primitives/` file**, so a page `@use`s
  each one it renders (an element-scoped primitive just uses a bare selector
  instead of a `.ui-<name>` class).
- `scoped/primitives/` and `scoped/components/` have **no `_index`** — a page
  pulls each piece directly, so nothing unused compiles in.
- Entry vs partial: `name.scss` compiles to `name.css`; `_name.scss` never
  emits on its own.

---

## The private-var recipe (every primitive & component)

A private var reads the required design token, so a piece adopts the design
system (load `main.css` alongside it):

```scss
// src/scoped/primitives/_card.scss   (no @layer — plain rules)
.ui-card {
  --_bg:     var(--color-White);        // private ← required design token (no literal fallback)
  --_radius: var(--ui-radius-lg);

  background: var(--_bg);      // every themeable property reads a --_* var
  border-radius: var(--_radius);

  &[data-variant="muted"] { --_bg: var(--color-Light-50); }  // variants ONLY reassign --_*
  &[data-pad="lg"]        { --_pad: var(--ui-space-6); }
}
```

Override precedence, low → high: design token (`--color-*` / `--ui-*`) →
`[data-*]` variant → inline `style="--_bg: …"`.

---

## Common tasks (copy the existing pattern)

- **Add a primitive** → `src/scoped/primitives/_<name>.scss` (plain rules, no
  `@layer`); `@use "../primitives/<name>"` from each page that renders it.
- **Add a composed block** → `src/scoped/components/_<name>.scss`;
  `@use "../components/<name>"` from pages that render it.
- **Add a page** → `src/scoped/pages/<name>.scss`: `@use` the
  primitives/components it needs, then page tweaks as plain rules below.
- **Add a design token** → colors/radius/shadows/transitions/typography go in the
  matching `src/global/base/_*.scss` (add to its Sass map or `:root` block);
  spacing goes in `src/abstracts/_sizing.scss` (`$space`). Each file emits its own
  tokens via a plain `:root { @each … }` — there is no central emitter. Reference
  as `var(--ui-…)` / `var(--color-…)` (tokens required; no literal fallback).
- **Rebrand** → edit the hexes in `src/global/base/_colors.scss` (colors emit
  case-preserved as `--color-<Name>`; every component follows because it reads
  `var(--color-*)` directly). For a scoped/dark override, redeclare the
  `--color-*` vars in a later `:root`/scope. No runtime theme stylesheets.
- **Go responsive** → try intrinsic first (`--grid-min`, `min()`, `clamp()`).
  Only if that can't reflow: `@use "../../abstracts/breakpoints" as *;` then
  `@include desktop-up { … }` / `mobile-down` / etc. Device-named, WordPress px
  breakpoints (mobile 600 · tablet 782 · desktop 1024 · lg 1200 · xl 1440),
  mobile-first (`-up` = min-width). Don't hardcode raw `@media (min-width: …)`.

---

## Gotchas that have bitten before

- **`index` namespace collision.** `@use`ing two `_index` partials (e.g.
  `base/index` and `layouts/index`) derives the namespace `index` twice and
  collides. Prefer a single `@use "global"`, or alias: `@use "…" as base`.
  `@forward` (used inside the `_index` files) has no namespace, so it's immune.
- **`@forward` emits CSS** (side effects) exactly like `@use` — an `_index.scss`
  that only `@forward`s still pulls every partial's output.
- **Ambiguous import.** A partial `_card.scss` and an entry `card.scss` in the
  *same* folder make `@use "primitives/card"` ambiguous and Sass errors. Keep
  on-demand compiled entries out of `scoped/primitives/`.
- **Preview staleness.** Cache-busting a `<link>` reloads CSS but not the HTML
  DOM. To test new markup, full-reload (`location.reload()`), then re-eval in a
  *separate* call (reloading in the same eval throws "target navigated").
- **Order is the guarantee now.** With no `@layer`, precedence is source/link
  order + specificity. `main.css` must link **before** a page bundle, and a host
  theme linked **after** overrides the system. Keep utility helpers forwarded
  last, and don't rely on a layer to reorder anything.

---

## Verify before claiming done

Preview is a static server of the repo root (`npx serve`). After a change that's
visible in the browser: recompile the affected entry with `npx sass`, reload the
preview, and confirm computed styles with `preview_inspect`/`preview_eval` — not
a screenshot. If tests or a step were skipped, say so.
