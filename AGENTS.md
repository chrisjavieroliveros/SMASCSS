# AGENTS.md

Operating guide for AI agents working in **SMASCSS** — a config-driven,
per-page-optimized SCSS system. [`README.md`](README.md) is the canonical spec;
this file is the short version plus the rules that are easy to get wrong.

---

## The one-paragraph mental model

Design values live as CSS custom properties in `variables.css` (loaded first,
everywhere). `main.css` is the always-loaded baseline: reset + global element
defaults + layout primitives, and **nothing component-level**. Each *page* ships
its own bundle that `@use`s only the primitives and composed blocks it renders.
Precedence across these separately-compiled files is held by one shared
`@layer` order. Every reusable piece renders correctly bare and upgrades
automatically when tokens are present, so the same source drops into Astro, a
WordPress block, or Elementor with zero of the rest of the system loaded.

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
   across the whole tree (a `pages/main.scss` would clobber the root
   `main.scss`).
3. **Every entry `@use "_layers";` first**, so the cascade order is declared
   before any rules. The canonical order lives in [`src/_layers.scss`](src/_layers.scss):

   ```scss
   @layer variables, reset, base, layout, primitive, component, page, override;
   ```

   Do not reorder or rename layers without the user asking — precedence across
   the whole system depends on it.
4. **Never restate structural CSS in a variant.** Variants (`[data-variant]`,
   `[data-size]`, `[data-tone]`, `[data-pad]`) may *only* reassign `--_*`
   private vars. See the recipe below.
5. **Keep `README.md`, `library.html`, and this file in sync** with any
   structural change (new folder/layer, moved file, renamed layer). The README
   is the contract; a structural change that leaves it stale is incomplete.
6. **Don't trust screenshots for exact colors, sizes, or spacing.** Verify
   computed styles with `preview_inspect` / `preview_eval`. JPEG artifacts have
   caused false "wrong color" conclusions here before.

---

## Folder → layer map (1:1)

| Folder | Layer | What lives there | Loaded |
|--------|-------|------------------|--------|
| `variables/` | `variables` | `:root { --ui-* }` design tokens; entry → `variables.css` | globally, first |
| `base/` | `reset` + `base` | reset, `:root`, typography, media | globally (in `main.css`) |
| `layouts/` | `layout` | layout primitives: `container`, `stack`, `cluster`, `grid`, `center` | globally (in `main.css`) |
| `primitives/` | `primitive` | **opt-in** pieces: `button, .btn`, `form`, `input`, `textarea`, `table`, `.ui-card` | per page (`@use` each) |
| `components/` | `component` | composed reusable blocks: `.hero` | per page (`@use` each) |
| `pages/` | `page` | one flat entry per page; page-specific tweaks | it *is* the page |
| `themes/` | `variables` | semantic-var overrides; entry → `theme-<name>.css` | optional, swapped at runtime |
| `abstracts/` | **none** | pure Sass tools — `responsive` mixins (`mobile-up` … `desktop-xl-down`, `responsive-prop`); **emit no CSS** | `@use`'d only where a media query is needed |

Notes:
- Nothing component-level ships in `main.css`. Every control — including
  `button, .btn` — is an **opt-in `primitives/` file**, so a page `@use`s each
  one it renders (an element-scoped primitive just uses a bare selector instead
  of a `.ui-<name>` class).
- `primitives/` has **no `_index`** — a page pulls each piece directly, so
  nothing unused compiles in. `components/` likewise has no `_index`.
- Entry vs partial: `name.scss` compiles to `name.css`; `_name.scss` never
  emits on its own.

---

## The private-var recipe (every primitive & component)

Three-tier chain makes a piece render bare *and* adopt the design system:

```scss
// src/primitives/_card.scss
@layer primitive {              // primitives → `primitive`; components → `component`
  .ui-card {
    --_bg:     var(--ui-color-surface, #ffffff);   // private ← semantic token ← literal fallback
    --_radius: var(--ui-radius-lg, 1.5rem);

    background: var(--_bg);      // every themeable property reads a --_* var
    border-radius: var(--_radius);

    &[data-variant="muted"] { --_bg: var(--ui-color-surface-muted, #f3f3f3); }  // variants ONLY reassign --_*
    &[data-pad="lg"]        { --_pad: var(--ui-space-6, 2rem); }
  }
}
```

Override precedence, low → high: baked `#literal` → `--ui-*` token / theme →
`[data-*]` variant → inline `style="--_bg: …"`.

---

## Common tasks (copy the existing pattern)

- **Add a primitive** → `src/primitives/_<name>.scss` in `@layer primitive`;
  `@use "../primitives/<name>"` from each page that renders it.
- **Add a composed block** → `src/components/_<name>.scss` in `@layer component`;
  `@use "../components/<name>"` from pages that render it.
- **Add a page** → `src/pages/<name>.scss`: `@use "../_layers";` then `@use` the
  primitives/components it needs; page tweaks in `@layer page`.
- **Add a variable** → add to the map in `src/variables/_*.scss`; it emits
  automatically via `_emit.scss`. Reference as `var(--ui-…, fallback)`.
- **Add a theme** → `src/themes/theme-<name>.scss`: `@use "../_layers";` then
  `@layer variables { :root { … } }` with only the semantic vars that change.
- **Go responsive** → try intrinsic first (`--grid-min`, `min()`, `clamp()`).
  Only if that can't reflow: `@use "../abstracts/responsive" as *;` then
  `@include desktop-up { … }` / `mobile-down` / etc. Device-named, WordPress px
  breakpoints (mobile 600 · tablet 782 · desktop 1024 · lg 1200 · xl 1440),
  mobile-first (`-up` = min-width). Don't hardcode raw `@media (min-width: …)`.

---

## Gotchas that have bitten before

- **`index` namespace collision.** `@use "base/index"` and `@use "layouts/index"`
  both derive the namespace `index` and collide. Alias them:
  `@use "base/index" as base; @use "layouts/index" as layouts;`.
- **`@forward` emits CSS** (side effects) exactly like `@use` — an `_index.scss`
  that only `@forward`s still pulls every partial's output.
- **Ambiguous import.** A partial `_card.scss` and an entry `card.scss` in the
  *same* folder make `@use "primitives/card"` ambiguous and Sass errors. Keep
  on-demand compiled entries out of `primitives/`.
- **Preview staleness.** Cache-busting a `<link>` reloads CSS but not the HTML
  DOM. To test new markup, full-reload (`location.reload()`), then re-eval in a
  *separate* call (reloading in the same eval throws "target navigated").
- **The embedding guarantee.** Any CSS *outside* all layers (a host theme) beats
  everything inside layers. That is intentional — it's why the system "stays
  overridable." Don't wrap host-facing escape hatches in a layer.

---

## Verify before claiming done

Preview is a static server of the repo root (`npx serve`). After a change that's
visible in the browser: recompile the affected entry with `npx sass`, reload the
preview, and confirm computed styles with `preview_inspect`/`preview_eval` — not
a screenshot. If tests or a step were skipped, say so.
