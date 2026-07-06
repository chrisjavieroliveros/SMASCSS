# SMASCSS

> A config-driven, per-page-optimized SCSS system whose **primitives** are
> portable enough to drop into an Astro component, a WordPress block, or an
> Elementor widget — with **zero** of the rest of the system loaded.

**Two component tiers.** `primitives/` holds the portable, self-sufficient
`.ui-*` atoms (button, input, textarea, card) — the "drop anywhere" set.
`components/` holds composed, reusable blocks assembled from primitives + layout
(e.g. `.hero`). Both are authored in `@layer components`; page-specific *tweaks*
to either live in the `page` layer, inside the page bundle that uses them.

This is the contract: *what the system guarantees* and *how to author against
it*. The `src/` tree is the implementation; [§12](#12-migration-map) records the
migration from the original `configs/` + `library/` layout (now removed).

**Lineage.** The taxonomy — `variables · base · layout · primitives · components ·
pages · themes` — is a deliberate blend: **SMACSS** (base / layout / module / theme
buckets), **Atomic Design** (primitives = atoms, components = molecules), **Every
Layout** (the `stack` / `cluster` / `center` / `grid` layout primitives), and
**ITCSS** (the specificity-ordered `@layer` cascade). Names are chosen to match
those references so the system reads as familiar, not bespoke.

---

## 1. Goals

1. **`main.css` is super-globals only.** The always-loaded baseline is reset +
   base element styling + layout primitives. No components live here.
2. **Pages ship only what they use.** Each page compiles its own bundle that
   `@use`s only the components it actually renders. No global component bloat.
3. **A portable `primitives/`.** Every primitive renders correctly *bare* (no
   tokens, no theme) and *upgrades automatically* when the design system is
   present. One source powers the architecture and every external host.
4. **Predictable cascade under hostile hosts.** WordPress/Elementor styles
   coexist without specificity wars.

---

## 2. Decisions

The load-bearing decisions, settled. The last four are recommended defaults —
flip any of them and this doc updates.

| # | Decision | Choice |
|---|----------|--------|
| 1 | Per-page CSS strategy | **Manual composition** — each page has an entry that `@use`s only what it needs. No purge/scan step. |
| 2 | Component portability contract | **Self-sufficient + token hooks** — renders bare via fallbacks, upgrades when tokens exist. |
| 3 | Specificity / embedding | **CSS `@layer` cascade layers.** |
| 4 | Distribution | **SCSS source partials**, `@use`'d directly by whoever compiles; per-component compiled CSS produced on demand (§9). |
| 5 | Variables layer | **Separate `variables.css`, loaded first.** Shippable on its own. |
| 6 | Universal chrome (header/footer) | **No shared bundle — everything is per-page.** One mental model. |
| 7 | Variant API | **Data-attributes** (`[data-variant]`, `[data-size]`, `[data-tone]`). |
| 8 | Build tool | **External** — the compiler is out of scope; it auto-globs non-partial `.scss`. |
| 9 | Component defaults | **Self-contained via private `--_*` vars** defaulting to global tokens with hard fallbacks. |
| 10 | Utilities | **None** — layout primitives + component vars only. |
| 11 | Theming | **Separate theme stylesheets**, swapped at runtime. |
| 12 | Entry discovery | **Auto-glob** — any non-`_` `.scss` compiles to a matching `.css`; folders are free to reorganize. |
| D1 | Class prefix | *(default)* `.ui-` for classes, `--_*` for private vars, `--ui-*` for tokens. |
| D2 | Component v1 catalog | *(default)* `button`, `input`, `textarea`, `card`. |
| D3 | Variant vocabulary | *(default)* `data-variant` (shape) · `data-size` · `data-tone` (semantic color). |
| D4 | Standalone drop-ins | *(default)* ship **layered**; add an unlayered build only for a host that clobbers a component. |

---

## 3. The cascade model

One global `@layer` order, declared identically at the top of **every** entry
file via a shared partial. Because the order is declared consistently, it holds
across separately-compiled stylesheets.

```scss
// src/_layers.scss
@layer reset, variables, base, layout, components, page, overrides;
```

Layer purpose and why the order is what it is:

| Layer | Owner | Contains |
|-------|-------|----------|
| `reset` | `main.css` | Normalize / reset. Lowest priority so everything overrides it. |
| `variables` | `variables.css`, theme files | `:root { --ui-* }`. A theme loaded *later* redefines these in the **same** layer and wins by source order — no separate theme layer needed. Components re-resolve automatically because they read variables through `var()`. |
| `base` | `main.css` | Semantic element defaults (typography, forms, tables, media). |
| `layout` | `main.css` | Layout primitives (stack, cluster, grid, container, center). |
| `components` | `primitives/`, `components/` | `.ui-*` primitives and composed blocks (`.hero`). Sits above base/layout so components win over generic element styling. |
| `page` | page bundles | Page-specific styling and tweaks. Above `components`, so a page can adjust a primitive or block with no `!important`. |
| `overrides` | anywhere | Deliberate last-word escape hatch. |

**The embedding guarantee:** any CSS *outside* all layers — a WordPress theme,
an Elementor global style — automatically beats *everything* inside layers.
That is the "stays overridable" property. Layers only order *our own* cascade;
the host always keeps the final say unless it, too, opts into a layer.

---

## 4. Directory structure

```
src/
  _layers.scss                 // @layer order — @use'd first in every entry
  main.scss                    // → main.css   ("super globals": reset + base + layout, no components)

  variables/                   // → variables.css   (loaded first, everywhere; shippable alone)
    variables.scss             //   ENTRY: emits :root { --ui-* } inside @layer variables
    _emit.scss                 //   custom-property emitter
    _colors.scss
    _typography.scss
    _spacing.scss
    _shape.scss
    _sizing.scss
    _effects.scss

  base/                        // @layer reset + base — bare element defaults (bundled into main.css)
    _reset.scss  _root.scss  _typography.scss  _media.scss  _form.scss  _table.scss

  layout/                      // @layer layout — layout primitives (bundled into main.css)
    _container.scss  _stack.scss  _cluster.scss  _grid.scss  _center.scss  _index.scss

  primitives/                  // ATOMS — the portable library, partials only, @layer components
    _index.scss                //   @forward every primitive (whole-library / SCSS consumers)
    _button.scss               //   primitives are @use'd directly by whoever compiles
    _input.scss
    _textarea.scss
    _card.scss

  components/                  // MOLECULES — composed, reusable blocks, partials only, @layer components
    _index.scss                //   @forward every block (whole-library / SCSS consumers)
    _hero.scss                 //   e.g. .hero, assembled from primitives + layout

  pages/                       // one flat entry per page (manual composition, per-page)
    home.scss                  //   ENTRY → home.css: @use only the primitives/components it needs

  themes/                      // → theme-<name>.css  (separate, swappable at runtime)
    theme-midnight.scss        //   ENTRY → theme-midnight.css

library.html                   // standalone styleguide preview (never compiled)
```

**Entry vs partial:** files without a leading underscore are entries and
compile to a same-named `.css`; `_name.scss` files are partials and never emit
on their own. The external compiler globs entries, so *adding a page or a
standalone component is just dropping a file* — no build config to edit.

**Flat output.** The compiler emits by **basename only** — every entry lands
directly in the output dir (e.g. `assets/css/`) as `<basename>.css`, regardless
of which `src/` subfolder it lives in. `src/themes/theme-midnight.scss` →
`assets/css/theme-midnight.css`; there is **no** `themes/` output subfolder. Two
consequences:

- **Entry basenames must be globally unique.** A `pages/main.scss` would clobber
  the root `main.scss` in the output. Keep every entry's basename distinct across
  the whole tree.
- **The `theme-` filename prefix is the namespacing** a subfolder would otherwise
  provide — it's why theme entries are named `theme-<name>.scss`, not `<name>.scss`.

> ⚠️ A folder named `_legacy/` does **not** stop its inner `main.scss` (no
> leading underscore) from being globbed and compiled. `_legacy/` is removed;
> its history lives in git.

---

## 5. Runtime load order

```html
<link rel="stylesheet" href="/css/variables.css">       <!-- 1. design variables (global) -->
<link rel="stylesheet" href="/css/main.css">            <!-- 2. reset + base + layout (global) -->
<link rel="stylesheet" href="/css/theme-midnight.css">  <!-- 3. optional theme override -->
<link rel="stylesheet" href="/css/home.css">            <!-- 4. THIS page's components + styles -->
```

Steps 1–3 are the same on every page and cache once. Step 4 is unique per page
and carries only that page's components. Theme is optional and swappable.

---

## 6. Variables (`variables.css`)

Variables are primitive design values (a.k.a. design tokens) emitted as CSS custom
properties. This is the **only** file an external host needs to adopt your brand —
it can be shipped entirely on its own.

```scss
// src/variables/variables.scss
@use "../_layers";                 // establishes @layer order
@use "emit";
@use "colors";
@use "typography";
@use "spacing";
@use "shape";
@use "sizing";
@use "effects";

@layer variables {
  :root {
    color-scheme: light;

    @include emit.prefixed("color", colors.$colors);          // --color-primary-500 …
    @include emit.custom("color", colors.$semantic-colors);   // --ui-color-primary …
    @include emit.custom("font-size", typography.$font-size-tokens);
    @include emit.custom("space", spacing.$space-tokens);
    @include emit.custom("radius", shape.$radius-tokens);
    @include emit.custom("shadow", effects.$shadow-tokens);
    // …every variable map
  }
}
```

Conventions:
- **Semantic variables** (`--ui-color-primary`, `--ui-color-surface`) are what
  components read. They express intent, not raw values.
- **Scale variables** (`--ui-space-3`, `--ui-radius-sm`) are the primitive steps.
- Keep the palette ramp exposed too (`--color-primary-500`) for escape hatches.

---

## 7. Baseline (`main.css`)

`main.scss` (at the `src/` root) is the "super globals" entry. It composes reset,
base element styling, and layout primitives — and **nothing component-level**.

```scss
// src/main.scss
@use "_layers";

// @layer reset
@use "base/reset";
// @layer base
@use "base/root";
@use "base/typography";
@use "base/media";
@use "base/form";
@use "base/table";
// @layer layout
@use "layout/index";
```

Each partial wraps its rules in the correct layer, e.g.:

```scss
// src/base/_reset.scss
@layer reset { /* … */ }

// src/base/_typography.scss
@layer base { body { font-family: var(--ui-font-family-base, system-ui); } }

// src/layout/_stack.scss
@layer layout {
  .stack { display: flex; flex-direction: column; gap: var(--ui-space-4, 1rem); }
}
```

Layout primitives are the deliberate replacement for a utility layer (decision
#10). The starting set: `container`, `stack`, `cluster`, `grid`, `center`.

---

## 8. Primitives — the authoring pattern

This is the heart of the system. Every primitive follows one recipe that
delivers self-sufficiency, token upgrade, data-attribute variants, and layer
placement simultaneously. Composed `components/` blocks assemble these primitives
in the same `@layer components`; page-specific tweaks to them live in the `page` layer.

### 8.1 Reference implementation

```scss
// src/primitives/_button.scss
@layer components {
  .ui-button {
    // Private vars: hard fallback ← global token. This chain is what makes the
    // component render bare AND adopt the design system when it's present.
    --_bg:       var(--ui-color-primary, #c33329);
    --_fg:       var(--ui-color-primary-contrast, #fff);
    --_bg-hover: var(--ui-color-primary-strong, #a52a2a);
    --_pad:      var(--ui-space-3, .8rem) var(--ui-space-4, 1.1rem);
    --_radius:   var(--ui-radius-sm, 8px);
    --_border:   transparent;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-space-2, .55rem);
    padding: var(--_pad);
    border: var(--ui-border-width-1, 1px) solid var(--_border);
    border-radius: var(--_radius);
    background: var(--_bg);
    color: var(--_fg);
    font-weight: var(--ui-font-weight-strong, 700);
    line-height: 1;
    cursor: pointer;
    text-decoration: none;
    transition: background var(--ui-transition-fast, 160ms ease);

    &:hover { background: var(--_bg-hover); }

    // Variants: data-attributes REASSIGN private vars, never restate properties.
    &[data-variant="outline"] {
      --_bg: transparent;
      --_fg: var(--ui-color-primary, #c33329);
      --_border: currentColor;
    }
    &[data-variant="ghost"] { --_bg: transparent; --_fg: currentColor; }

    &[data-size="sm"] { --_pad: var(--ui-space-2, .5rem) var(--ui-space-3, .8rem); }
    &[data-size="lg"] { --_pad: var(--ui-space-4, 1rem) var(--ui-space-5, 1.4rem); }

    &[data-tone="danger"]  { --_bg: var(--ui-color-danger, #b91c1c);  --_bg-hover: var(--ui-color-danger-shade, #941616); }
    &[data-tone="success"] { --_bg: var(--ui-color-success, #4caa55); }

    &:disabled,
    &[aria-disabled="true"] { opacity: .55; cursor: not-allowed; pointer-events: none; }
  }
}
```

```html
<button class="ui-button" data-variant="outline" data-size="sm">Save</button>
<button class="ui-button" data-tone="danger">Delete</button>
```

### 8.2 The rules every component follows

1. **Wrap in `@layer components`.**
2. **Every themeable property reads a private `--_*` var.** The `--_*` var
   defaults to a semantic token, which itself has a hard literal fallback:
   `--_bg: var(--ui-color-primary, #c33329);`
3. **Variants only reassign `--_*` vars.** No variant restates layout/structure.
   This keeps variant CSS tiny and impossible to desync from the base.
4. **Self-contained.** A component references only tokens and its own private
   vars — never another component or a global recipe file.
5. **Data-attribute API** (decision #7): `data-variant`, `data-size`,
   `data-tone`. Booleans use presence (`[data-loading]`).

### 8.3 The four override levels (no specificity fights)

```
inline style="--_bg: …"      // one instance
  ↑ [data-*] variant          // a variant class of instances
    ↑ --ui-* token / theme     // the whole design system
      ↑ baked #literal fallback // bare, nothing loaded
```

---

## 9. Distribution

Primitives ship as **source partials** (`primitives/_button.scss`). Whoever compiles
`@use`s them directly:

- Your pages: `@use "../primitives/button"` (see §10).
- Astro / Vite / `@wordpress/scripts`: `@use "primitives/button"`, or `@use "primitives/index"`
  for the whole library, and let the bundler tree-shake.

`@use` is a source-time mechanism, so this covers every consumer that runs Sass.

**A pre-built `.css` per component is an on-demand build, not a standing folder.**
A host that only accepts a finished file (paste into Elementor, enqueue a plain
stylesheet) needs a compiled artifact — but a partial isn't a compile target and
lacks the `@layer` statement. When that need arises, add a one-off entry:

```scss
// e.g. build/button.scss   → button.css   (create only when a host needs a file)
@use "../src/_layers";
@use "../src/primitives/button";
```

Keep such entries out of `primitives/` — a partial `_button.scss` and an entry
`button.scss` in the *same* folder make `@use "primitives/button"` an ambiguous import
that Sass rejects. Put them in a separate build/output location.

**Layered by design (decision D4):** a compiled component carries `@layer
components`, so a host theme can still override it. If a specific host clobbers a
component, emit an unlayered build for *that* component rather than delayering
everything.

---

## 10. Page composition

Each page is a single flat entry named after the page (so it emits `<name>.css`).
The entry is a manifest — it pulls the layer order, the exact primitives the page
uses, and any composed blocks it renders.

```scss
// src/pages/home.scss   → home.css
@use "../_layers";

// Only the primitives this page renders:
@use "../primitives/button";
@use "../primitives/card";

// Composed blocks this page renders:
@use "../components/hero";

// Page-specific tweaks live in the `page` layer (above `components`) and ship
// only in home.css:
@layer page {
  .hero .ui-button { --_radius: 999px; }   // pill buttons in the hero, home only
}
```

```scss
// src/components/_hero.scss  — reusable block, @layer components
@layer components {
  .hero { display: grid; gap: var(--ui-space-6, 2rem); }
  .hero__actions { display: flex; flex-wrap: wrap; gap: var(--ui-space-3, .75rem); }
}
```

> Name the entry `home.scss`, not `index.scss` — the compiler emits a `.css`
> matching the entry's basename, and you want `home.css`.

Trade-off, accepted per decision #6: a primitive used on five pages appears in
five page bundles. In exchange every page downloads *only* its own components,
and there is no scanning step that can guess wrong.

---

## 11. Theming

Themes are separate compiled stylesheets (decision #11) that redefine semantic
variables in the `variables` layer. Loaded after `variables.css`, they win by
source order; components adopt them for free because they read variables through
`var()`.

```scss
// src/themes/theme-midnight.scss   → theme-midnight.css
@use "../_layers";

@layer variables {
  :root {
    color-scheme: dark;
    --ui-color-background: #0c0e12;
    --ui-color-surface:    #15171c;
    --ui-color-text:       #e7e9ee;
    --ui-color-primary:    #d94f4b;
    // …only the semantic variables that change
  }
}
```

Swap at runtime by swapping the `<link>` (or toggling `disabled`). No component
CSS changes; no rebuild.

> If you later want automatic light/dark, scope a theme's `:root` block under
> `@media (prefers-color-scheme: dark)` — the layer model doesn't change.

---

## 12. Migration map

| Today | Becomes | Note |
|-------|---------|------|
| `configs/tokens/*` | `src/variables/*` | Wrap emission in `@layer variables`. |
| `configs/helpers/_custom-properties.scss` | `src/variables/_emit.scss` | Renamed. |
| `configs/recipes/*` | **deleted** | Component defaults move *into* each component as `--_*` vars. Biggest change; it is what makes components portable. |
| `configs/defaults/*` + `library/base/*` | `src/base/*` | Merges the two places base styling currently lives. |
| `library/layout/*` | `src/layout/*` | + new primitives (stack, cluster, grid, center). |
| `library/components/_*-core.scss` | `src/primitives/_<name>.scss` | Refactor to the §8 pattern; `@use`'d directly by whoever compiles. |
| `configs/config.scss` | `src/variables/variables.scss` | Variables entry replaces the config aggregator. |
| `configs/themes/midnight.scss` | `src/themes/theme-midnight.scss` | Wrap in `@layer variables`. |
| `library/main.scss` | `src/main.scss` | Adds `@use "_layers"`. |
| `_legacy/` | **deleted** | Preserved in git history. |
| `index.html`, `midnight.html` | `library.html` | Consolidated into one standalone styleguide; never compiled. |

---

## 13. Playbooks

### Add a primitive
1. `src/primitives/_<name>.scss` — author to the §8 pattern.
2. Add `@forward "<name>";` to `src/primitives/_index.scss`.
3. Use it in a page via `@use "../primitives/<name>";`.
4. Only if an external host needs a pre-built file: add a one-off entry (§9).

### Add a composed block
1. `src/components/_<name>.scss` — assemble primitives + layout; wrap in `@layer components`.
2. Add `@forward "<name>";` to `src/components/_index.scss`.
3. Use it in a page via `@use "../components/<name>";`. Page-specific tweaks go in
   that page's own `@layer page` block.

### Add a page
1. `src/pages/<name>.scss` — `@use "../_layers";` then `@use` the primitives/components it needs.
2. Done — the compiler globs the new flat entry automatically.

### Add a variable
1. Add to the relevant map in `src/variables/_*.scss`.
2. It emits automatically via `_emit.scss`. Reference it as `var(--ui-…, fallback)`.

### Add a theme
1. `src/themes/theme-<name>.scss` — `@use "../_layers";` then `@layer variables { :root { … } }`
   with only the semantic variables that change.

---

## 14. Conventions reference

| Thing | Convention | Example |
|-------|-----------|---------|
| Global variable | `--ui-<group>-<name>` | `--ui-color-primary`, `--ui-space-3` |
| Palette ramp | `--color-<name>-<step>` | `--color-primary-500` |
| Component private var | `--_<role>` | `--_bg`, `--_pad` |
| Primitive class | `.ui-<name>` | `.ui-button` |
| Composed block class | `.<block>` / `.<block>__<part>` | `.hero`, `.hero__actions` |
| Variant / state | `data-<axis>="<value>"` | `data-variant="outline"` |
| Layout primitive | `.<name>` (unprefixed) | `.stack`, `.grid` |
| Cascade layers | `reset, variables, base, layout, components, page, overrides` | |

---

## 15. Naming note

`SMASCSS` currently ships a checked-in `assets/css/main.min.css` as demo output.
Under this architecture the compiler emits, at minimum:
`variables.css`, `main.css`, `theme-<name>.css`, and one `<page>.css` per page
(primitives and composed blocks ship inside the page bundles that `@use` them, not
as standalone files). Output is **flat** — one `<basename>.css` per entry directly
under `assets/css/`, no subfolders (see §4), so entry basenames stay globally unique.
