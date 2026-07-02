# SMASCSS Architecture

> The plan for a config-driven, per-page-optimized SCSS system whose **core**
> components are portable enough to drop into an Astro component, a WordPress
> block, or an Elementor widget — with **zero** of the rest of the system loaded.

This document is the contract. It describes *what the system guarantees* and
*how to author against it*, not a snapshot of the current files. See
[Migration map](#12-migration-map) for how today's `configs/` + `library/`
folders fold into it.

---

## 1. Goals

1. **`main.css` is super-globals only.** The always-loaded baseline is reset +
   base element styling + layout primitives. No components live here.
2. **Pages ship only what they use.** Each page compiles its own bundle that
   `@use`s only the components it actually renders. No global component bloat.
3. **A portable `core/`.** Every core component renders correctly *bare* (no
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
| 2 | Core portability contract | **Self-sufficient + token hooks** — renders bare via fallbacks, upgrades when tokens exist. |
| 3 | Specificity / embedding | **CSS `@layer` cascade layers.** |
| 4 | Distribution | **Both** — SCSS source *and* per-component compiled CSS. |
| 5 | Token layer | **Separate `tokens.css`, loaded first.** Shippable on its own. |
| 6 | Universal chrome (header/footer) | **No shared bundle — everything is per-page.** One mental model. |
| 7 | Variant API | **Data-attributes** (`[data-variant]`, `[data-size]`, `[data-tone]`). |
| 8 | Build tool | **External** — the compiler is out of scope; it auto-globs non-partial `.scss`. |
| 9 | Component defaults | **Self-contained via private `--_*` vars** defaulting to global tokens with hard fallbacks. |
| 10 | Utilities | **None** — layout primitives + component vars only. |
| 11 | Theming | **Separate theme stylesheets**, swapped at runtime. |
| 12 | Entry discovery | **Auto-glob** — any non-`_` `.scss` compiles to a matching `.css`; folders are free to reorganize. |
| D1 | Class prefix | *(default)* `.ui-` for classes, `--_*` for private vars, `--ui-*` for tokens. |
| D2 | Core v1 catalog | *(default)* `button`, `input`, `textarea`, `card`. |
| D3 | Variant vocabulary | *(default)* `data-variant` (shape) · `data-size` · `data-tone` (semantic color). |
| D4 | Standalone drop-ins | *(default)* ship **layered**; add an unlayered build only for a host that clobbers a component. |

---

## 3. The cascade model

One global `@layer` order, declared identically at the top of **every** entry
file via a shared partial. Because the order is declared consistently, it holds
across separately-compiled stylesheets.

```scss
// src/_layers.scss
@layer reset, tokens, base, layout, components, page, overrides;
```

Layer purpose and why the order is what it is:

| Layer | Owner | Contains |
|-------|-------|----------|
| `reset` | `main.css` | Normalize / reset. Lowest priority so everything overrides it. |
| `tokens` | `tokens.css`, theme files | `:root { --ui-* }`. A theme loaded *later* redefines these in the **same** layer and wins by source order — no separate theme layer needed. Components re-resolve automatically because they read tokens through `var()`. |
| `base` | `main.css` | Semantic element defaults (typography, forms, tables, media). |
| `layout` | `main.css` | Layout primitives (stack, cluster, grid, container, center). |
| `components` | `core/` | `.ui-*` components. Sits above base/layout so components win over generic element styling. |
| `page` | page bundles | Page-specific styling. Above `components`, so a page can adjust a component with no `!important`. |
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

  tokens/                      // → tokens.css   (loaded first, everywhere; shippable alone)
    tokens.scss                //   ENTRY: emits :root { --ui-* } inside @layer tokens
    _emit.scss                 //   custom-property emitter (today's helpers/_custom-properties)
    _colors.scss
    _typography.scss
    _spacing.scss
    _shape.scss
    _sizing.scss
    _effects.scss

  global/                      // → main.css     ("super globals only")
    main.scss                  //   ENTRY
    base/
      _reset.scss  _root.scss  _typography.scss  _media.scss  _form.scss  _table.scss
    layout/
      _container.scss  _stack.scss  _cluster.scss  _grid.scss  _center.scss  _index.scss

  core/                        // the PORTABLE library
    _index.scss                //   @forward every component (whole-library / SCSS consumers)
    _button.scss               //   component partials live directly in core/
    _input.scss
    _textarea.scss
    _card.scss
    dist/                      //   standalone compiled drop-ins
      button.scss              //   ENTRY → core/dist/button.css
      input.scss  textarea.scss  card.scss

  themes/                      // → themes/<name>.css  (separate, swappable at runtime)
    midnight.scss              //   ENTRY

  pages/                       // → <name>.css  (manual composition, per-page)
    home.scss                  //   ENTRY: @use only the core components + page partials it needs
    _home-hero.scss            //   page-only styles live as partials
    about.scss

preview/                       // demo HTML (never compiled)
  index.html  midnight.html
```

**Entry vs partial:** files without a leading underscore are entries and
compile to a same-named `.css`; `_name.scss` files are partials and never emit
on their own. The external compiler globs entries, so *adding a page or a
standalone component is just dropping a file* — no build config to edit.

> ⚠️ A folder named `_legacy/` does **not** stop its inner `main.scss` (no
> leading underscore) from being globbed and compiled. `_legacy/` is removed;
> its history lives in git.

---

## 5. Runtime load order

```html
<link rel="stylesheet" href="/css/tokens.css">          <!-- 1. design tokens (global) -->
<link rel="stylesheet" href="/css/main.css">            <!-- 2. reset + base + layout (global) -->
<link rel="stylesheet" href="/css/themes/midnight.css"> <!-- 3. optional theme override -->
<link rel="stylesheet" href="/css/home.css">            <!-- 4. THIS page's components + styles -->
```

Steps 1–3 are the same on every page and cache once. Step 4 is unique per page
and carries only that page's components. Theme is optional and swappable.

---

## 6. Tokens (`tokens.css`)

Tokens are primitive design values emitted as CSS custom properties. This is the
**only** file an external host needs to adopt your brand — it can be shipped
entirely on its own.

```scss
// src/tokens/tokens.scss
@use "../_layers";                 // establishes @layer order
@use "emit";
@use "colors";
@use "typography";
@use "spacing";
@use "shape";
@use "sizing";
@use "effects";

@layer tokens {
  :root {
    color-scheme: light;

    @include emit.prefixed("color", colors.$colors);          // --color-primary-500 …
    @include emit.custom("color", colors.$semantic-colors);   // --ui-color-primary …
    @include emit.custom("font-size", typography.$font-size-tokens);
    @include emit.custom("space", spacing.$space-tokens);
    @include emit.custom("radius", shape.$radius-tokens);
    @include emit.custom("shadow", effects.$shadow-tokens);
    // …every token map
  }
}
```

Conventions:
- **Semantic tokens** (`--ui-color-primary`, `--ui-color-surface`) are what
  components read. They express intent, not raw values.
- **Scale tokens** (`--ui-space-3`, `--ui-radius-sm`) are the primitive steps.
- Keep the palette ramp exposed too (`--color-primary-500`) for escape hatches.

---

## 7. Global baseline (`main.css`)

`main.scss` is the "super globals" entry. It composes reset, base element
styling, and layout primitives — and **nothing component-level**.

```scss
// src/global/main.scss
@use "../_layers";

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
// src/global/base/_reset.scss
@layer reset { /* … */ }

// src/global/base/_typography.scss
@layer base { body { font-family: var(--ui-font-family-base, system-ui); } }

// src/global/layout/_stack.scss
@layer layout {
  .stack { display: flex; flex-direction: column; gap: var(--ui-space-4, 1rem); }
}
```

Layout primitives are the deliberate replacement for a utility layer (decision
#10). The starting set: `container`, `stack`, `cluster`, `grid`, `center`.

---

## 8. Core components — the authoring pattern

This is the heart of the system. Every core component follows one recipe that
delivers self-sufficiency, token upgrade, data-attribute variants, and layer
placement simultaneously.

### 8.1 Reference implementation

```scss
// src/core/_button.scss
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

## 9. Standalone distribution

Each component partial lives directly in `core/` (`core/_button.scss`); its
standalone entry lives in `core/dist/`. They're kept apart on purpose: a partial
`_button.scss` and an entry `button.scss` in the *same* folder make
`@use "core/button"` an ambiguous import and Sass errors. With this split,
`@use "core/button"` unambiguously resolves to the partial.

```scss
// src/core/dist/button.scss   → core/dist/button.css
@use "../../_layers";
@use "../button";
```

`core/dist/button.css` is fully drop-in: fallbacks make it render with nothing
else present; loading `tokens.css` (or a theme) alongside upgrades it to brand.

SCSS-based consumers (Astro/Vite) instead `@use "core/button"` — or
`@use "core/index"` for the whole library — and let their bundler tree-shake.

**Layered by default (decision D4):** drop-ins carry `@layer components`, so a
host theme can still override them. If a specific host clobbers a component,
add an unlayered build for *that* component rather than delayering everything.

---

## 10. Page composition

A page entry is a manifest: it pulls the global layer order, the exact core
components the page uses, and the page's own partials.

```scss
// src/pages/home.scss   → home.css
@use "../_layers";

// Only what this page renders:
@use "../core/button";
@use "../core/card";

// Page-specific styling, in the `page` layer so it can tweak components:
@use "home-hero";        // _home-hero.scss
```

```scss
// src/pages/_home-hero.scss
@layer page {
  .home-hero { display: grid; gap: var(--ui-space-6, 2rem); }
  .home-hero .ui-button { --_radius: 999px; }   // page-local component tweak
}
```

Trade-off, accepted per decision #6: a component used on five pages appears in
five page bundles. In exchange every page downloads *only* its own components,
and there is no scanning step that can guess wrong.

---

## 11. Theming

Themes are separate compiled stylesheets (decision #11) that redefine semantic
tokens in the `tokens` layer. Loaded after `tokens.css`, they win by source
order; components adopt them for free because they read tokens through `var()`.

```scss
// src/themes/midnight.scss   → themes/midnight.css
@use "../_layers";

@layer tokens {
  :root {
    color-scheme: dark;
    --ui-color-background: #0c0e12;
    --ui-color-surface:    #15171c;
    --ui-color-text:       #e7e9ee;
    --ui-color-primary:    #d94f4b;
    // …only the semantic tokens that change
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
| `configs/tokens/*` | `src/tokens/*` | Wrap emission in `@layer tokens`. |
| `configs/helpers/_custom-properties.scss` | `src/tokens/_emit.scss` | Renamed. |
| `configs/recipes/*` | **deleted** | Component defaults move *into* each component as `--_*` vars. Biggest change; it is what makes components portable. |
| `configs/defaults/*` + `library/base/*` | `src/global/base/*` | Merges the two places base styling currently lives. |
| `library/layout/*` | `src/global/layout/*` | + new primitives (stack, cluster, grid, center). |
| `library/components/_*-core.scss` | `src/core/_<name>.scss` (+ `dist/<name>.scss` entry) | Refactor to the §8 pattern. |
| `configs/config.scss` | `src/tokens/tokens.scss` | Token entry replaces the config aggregator. |
| `configs/themes/midnight.scss` | `src/themes/midnight.scss` | Wrap in `@layer tokens`. |
| `library/main.scss` | `src/global/main.scss` | Adds `@use "../_layers"`. |
| `_legacy/` | **deleted** | Preserved in git history. |
| `index.html`, `midnight.html` | `preview/` | Kept as demos; never compiled. |

---

## 13. Playbooks

### Add a component
1. `src/core/_<name>.scss` — author to the §8 pattern.
2. `src/core/dist/<name>.scss` — `@use "../../_layers"; @use "../<name>";`.
3. Add `@forward "<name>";` to `src/core/_index.scss`.
4. Use it in a page via `@use "../core/<name>";`.

### Add a page
1. `src/pages/<name>.scss` — `@use "../_layers";` then `@use` the components it needs.
2. Page-only styles → `src/pages/_<name>-*.scss` in `@layer page`.
3. Done — the compiler globs the new entry automatically.

### Add a token
1. Add to the relevant map in `src/tokens/_*.scss`.
2. It emits automatically via `_emit.scss`. Reference it as `var(--ui-…, fallback)`.

### Add a theme
1. `src/themes/<name>.scss` — `@use "../_layers";` then `@layer tokens { :root { … } }`
   with only the semantic tokens that change.

---

## 14. Conventions reference

| Thing | Convention | Example |
|-------|-----------|---------|
| Global token | `--ui-<group>-<name>` | `--ui-color-primary`, `--ui-space-3` |
| Palette ramp | `--color-<name>-<step>` | `--color-primary-500` |
| Component private var | `--_<role>` | `--_bg`, `--_pad` |
| Component class | `.ui-<name>` | `.ui-button` |
| Variant / state | `data-<axis>="<value>"` | `data-variant="outline"` |
| Layout primitive | `.<name>` (unprefixed) | `.stack`, `.grid` |
| Cascade layers | `reset, tokens, base, layout, components, page, overrides` | |

---

## 15. Naming note

`SMASCSS` currently ships a checked-in `assets/css/main.min.css` as demo output.
Under this architecture the compiler emits, at minimum:
`tokens.css`, `main.css`, `themes/*.css`, `core/*.css`, and one `*.css` per page.
Output layout is the compiler's concern; a mirror of `src/` under `assets/css/`
keeps paths predictable.
