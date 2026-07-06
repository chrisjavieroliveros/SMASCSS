# SMASCSS

> A config-driven, per-page-optimized SCSS system whose **primitives** are
> portable enough to drop into an Astro component, a WordPress block, or an
> Elementor widget — with **zero** of the rest of the system loaded.

**Where things live.** `base/` holds the *truly global* element defaults every page
gets via `main.css` — reset, `:root`, typography, and media. `primitives/`
holds *opt-in* pieces a page pulls in only when it needs them: the element-scoped
controls (`button, .btn`, `form`, `input, .input`, `textarea, .textarea`, `table`)
plus the self-sufficient `.ui-card`. All of them share one dedicated **`@layer primitive`**
(between `layout` and `component`), so the folder maps 1:1 to the layer. There is no
`primitives/_index` — a page `@use`s each piece directly, so nothing unused compiles
in. `components/` holds composed, reusable blocks (e.g. `.hero`, `@layer component`).
Page-specific *tweaks* live in the `page` layer, inside the page bundle that uses them.
`abstracts/` is the odd one out — pure Sass *tools* (the `responsive` mixins) that
emit no CSS and belong to no layer; a file `@use`s them only when it needs a media query.

This is the contract: *what the system guarantees* and *how to author against
it*. The `src/` tree is the implementation; [§12](#12-migration-map) records the
migration from the original `configs/` + `library/` layout (now removed).

**Lineage.** The taxonomy — `config · base · layout · primitives · components ·
pages` — is a deliberate blend: **SMACSS** (base / layout / module / theme
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
3. **A portable `primitives/`.** Every primitive is self-sufficient: drop it into
   any host alongside `config.css` (one small tokens file) and it renders and
   themes correctly with **zero** of the rest of the system loaded. One source
   powers the architecture and every external host.
4. **Predictable cascade under hostile hosts.** WordPress/Elementor styles
   coexist without specificity wars.

---

## 2. Decisions

The load-bearing decisions, settled. The last four are recommended defaults —
flip any of them and this doc updates.

| # | Decision | Choice |
|---|----------|--------|
| 1 | Per-page CSS strategy | **Manual composition** — each page has an entry that `@use`s only what it needs. No purge/scan step. |
| 2 | Component portability contract | **Config-driven + token hooks** — components read required `config.css` tokens directly; no baked literal fallbacks. Ship the piece alongside `config.css`. |
| 3 | Specificity / embedding | **CSS `@layer` cascade layers.** |
| 4 | Distribution | **SCSS source partials**, `@use`'d directly by whoever compiles; per-component compiled CSS produced on demand (§9). |
| 5 | Config layer | **Separate `config.css`, loaded first and REQUIRED.** Shippable on its own. |
| 6 | Universal chrome (header/footer) | **No shared bundle — everything is per-page.** One mental model. |
| 7 | Variant API | **Data-attributes** (`[data-variant]`, `[data-size]`, `[data-tone]`). |
| 8 | Build tool | **External** — the compiler is out of scope; it auto-globs non-partial `.scss`. |
| 9 | Component defaults | **Self-contained via private `--_*` vars** that read the required global config tokens. |
| 10 | Utilities | **None** — layout primitives + component vars only. |
| 11 | Theming | **Rebrand by editing the palette** in `config/_colors.scss` (or overriding `--color-*` in a later `:root`); no runtime theme stylesheets. |
| 12 | Entry discovery | **Auto-glob** — any non-`_` `.scss` compiles to a matching `.css`; folders are free to reorganize. |
| D1 | Class prefix | *(default)* `.ui-` for classes, `--_*` for private vars, `--ui-*` for tokens. |
| D2 | Component v1 catalog | *(default)* all opt-in `primitives/`: `button`, `form`, `input`, `textarea`, `table`, `card`. Nothing component-level ships in `main.css`. |
| D3 | Variant vocabulary | *(default)* `data-variant` (shape) · `data-size` · `data-tone` (semantic color). |
| D4 | Standalone drop-ins | *(default)* ship **layered**; add an unlayered build only for a host that clobbers a component. |

---

## 3. The cascade model

One global `@layer` order, declared identically at the top of **every** entry
file via a shared partial. Because the order is declared consistently, it holds
across separately-compiled stylesheets.

```scss
// src/_layers.scss
@layer config, reset, base, layout, primitive, component, page, override;
```

Layer purpose and why the order is what it is:

| Layer | Owner | Contains |
|-------|-------|----------|
| `config` | `config.css` | `:root { --color-* / --ui-* }`. First, so it's the foundation everything else reads. Nothing else declares these properties, so its position is inert at render time. A later `:root` (in a page or override) can still redeclare a token and win by source order, and components re-resolve automatically because they read tokens through `var()`. |
| `reset` | `main.css` | Normalize / reset. Near the bottom so element defaults override it. |
| `base` | `main.css` | Global semantic element defaults (`:root`, typography, media). Shipped everywhere. |
| `layout` | `main.css` | Layout primitives (stack, cluster, grid, container, center). |
| `primitive` | `primitives/` | Everything in `primitives/`, unified in one layer: opt-in element controls (`button, .btn`, `form`, `input`, `textarea`, `table`) and the `.ui-card` component. A page `@use`s only what it renders. |
| `component` | `components/` | Composed, reusable blocks (`.hero`). Sits above `primitive` so a block can adjust a primitive it composes. |
| `page` | page bundles | Page-specific styling and tweaks. Above `component`, so a page can adjust a primitive, block, or element with no `!important`. |
| `override` | anywhere | Deliberate last-word escape hatch. |

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

  abstracts/                   // TOOLS — pure Sass (mixins/functions), emit NO CSS, not a layer
    _responsive.scss           //   device-named responsive mixins (mobile-up … desktop-xl-down) + responsive-prop
    _emit.scss                 //   token emitter — turns config maps into --ui-* custom properties

  config/                      // → config.css   (loaded first, everywhere, REQUIRED; shippable alone)
    config.scss                //   ENTRY: assembles the maps + emits :root { --ui-* } inside @layer config
    _colors.scss               //   brand palette (emitted case-preserved as --color-<Name>)   ← the value files you EDIT
    _typography.scss           //   fonts, sizes, weights, line-heights
    _spacing.scss              //   the space scale
    _radius.scss               //   corner rounding
    _borders.scss              //   border widths
    _shadows.scss              //   elevation
    _motion.scss               //   transitions
    _sizing.scss               //   container / layout widths

  base/                        // @layer reset + base — TRULY GLOBAL defaults (bundled into main.css)
    _index.scss                //   @forward every base partial (main.scss @uses this)
    _reset.scss  _root.scss  _typography.scss  _media.scss

  layouts/                     // @layer layout — layout primitives (bundled into main.css)
    _container.scss  _stack.scss  _cluster.scss  _grid.scss  _center.scss  _index.scss

  primitives/                  // OPT-IN pieces, all @layer primitive — @use per page (no _index)
    _button.scss               //   button, .btn
    _form.scss                 //   label / select / fieldset / legend
    _input.scss                //   input, .input
    _textarea.scss             //   textarea, .textarea
    _table.scss                //   table + cells
    _card.scss                 //   .ui-card

  components/                  // MOLECULES — composed, reusable blocks, partials only, @layer component
    _hero.scss                 //   e.g. .hero, assembled from primitives + layout (@use per page)

  pages/                       // one flat entry per page (manual composition, per-page)
    home.scss                  //   ENTRY → home.css: @use only the primitives/components it needs

library.html                   // standalone styleguide preview (never compiled)
```

**Entry vs partial:** files without a leading underscore are entries and
compile to a same-named `.css`; `_name.scss` files are partials and never emit
on their own. The external compiler globs entries, so *adding a page or a
standalone component is just dropping a file* — no build config to edit.

**Flat output.** The compiler emits by **basename only** — every entry lands
directly in the output dir (e.g. `assets/css/`) as `<basename>.css`, regardless
of which `src/` subfolder it lives in. `src/pages/home.scss` →
`assets/css/home.css`; there is **no** `pages/` output subfolder. Consequence:

- **Entry basenames must be globally unique.** A `pages/main.scss` would clobber
  the root `main.scss` in the output. Keep every entry's basename distinct across
  the whole tree — a subfolder gives no namespacing at output time.

> ⚠️ A folder named `_legacy/` does **not** stop its inner `main.scss` (no
> leading underscore) from being globbed and compiled. `_legacy/` is removed;
> its history lives in git.

---

## 5. Runtime load order

```html
<link rel="stylesheet" href="/css/config.css">          <!-- 1. design tokens (global, REQUIRED) -->
<link rel="stylesheet" href="/css/main.css">            <!-- 2. reset + base + layout (global) -->
<link rel="stylesheet" href="/css/home.css">            <!-- 3. THIS page's components + styles -->
```

Steps 1–2 are the same on every page and cache once. Step 3 is unique per page
and carries only that page's components. Step 1 (`config.css`) is **required** —
it holds every design value the rest of the system reads.

---

## 6. Config (`config.css`)

Config is the primitive design values (a.k.a. design tokens) emitted as CSS custom
properties. It is the **single source of truth** for every design value the system
reads, and the **only** file an external host needs to adopt your brand — it can be
shipped entirely on its own. It is **required**: load it first, on every page.

```scss
// src/config/config.scss
@use "../_layers";                 // establishes @layer order
@use "../abstracts/emit";          // the emitter is a Sass tool, kept out of config/
@use "colors";
@use "typography";
@use "spacing";
@use "radius";
@use "borders";
@use "shadows";
@use "motion";
@use "sizing";

@layer config {
  :root {
    color-scheme: light;

    @include emit.prefixed("color", colors.$colors, false);   // --color-Primary … (false = preserve case)
    @include emit.custom("font-size", typography.$font-size-tokens);
    @include emit.custom("space", spacing.$space-tokens);
    @include emit.custom("radius", radius.$radius-tokens);
    @include emit.custom("shadow", shadows.$shadow-tokens);
    // …every token map
  }
}
```

Conventions:
- **Color is the raw palette**, emitted **case-preserved** as `--color-<Name>`
  (e.g. `--color-Primary`, `--color-Primary-Shade`, `--color-Secondary-500`),
  and read **directly** by components — there is no semantic color layer.
- **Scale tokens** (`--ui-space-3`, `--ui-radius-sm`) are the primitive steps.
- **Heading & display type scales** live here too, folded into the font-size and
  line-height maps: `--ui-font-size-h1 … -h6` (heading steps),
  `--ui-font-size-display-1 … -3` (display steps), and `--ui-line-height-display`.
  `base/typography` reads these rather than hardcoding sizes.
- The full palette ramp is exposed (`--color-Primary-500`) for direct use.

Config owns all design values (color, space, size, radius, font, shadow,
border-width); consumers read them with **no literal fallback**. Only structural
or behavioral CSS-keyword defaults (`margin: 0`, `currentColor`, `underline`) stay
inline — those are not tokens and config does not own them.

---

## 7. Baseline (`main.css`)

`main.scss` (at the `src/` root) is the "super globals" entry. It composes reset,
base element styling, and layout primitives — and **nothing component-level**.

```scss
// src/main.scss
@use "_layers";

// @layer reset + base — base/_index.scss @forwards every base partial
@use "base/index" as base;
// @layer layout
@use "layouts/index" as layouts;
```

> **Namespace the two `index` modules.** Sass names a module after its last path
> segment, so `base/index` and `layouts/index` both default to `index` and collide.
> Alias them (`as base`, `as layout`). They emit CSS for side effects only — main
> references no members — so the names are arbitrary, just distinct.

Each partial wraps its rules in the correct layer, e.g.:

```scss
// src/base/_reset.scss
@layer reset { /* … */ }

// src/base/_typography.scss
@layer base { body { font-family: var(--ui-font-family-base); } }

// src/layouts/_stack.scss
@layer layout {
  .stack { display: flex; flex-direction: column; gap: var(--ui-space-4); }
}
```

Layout primitives are the deliberate replacement for a utility layer (decision
#10). The starting set: `container`, `stack`, `cluster`, `grid`, `center`.

**Responsiveness is intrinsic-first.** These primitives reflow *without* media
queries — `.grid` uses `auto-fit` + `minmax(min(100%, var(--grid-min)), 1fr)`,
`.container` uses `min()`, and type can `clamp()`. Reach for a breakpoint only
when a layout genuinely can't reflow on its own (a nav that swaps, a stepped type
scale). When you do, the tool is `abstracts/_responsive.scss` — pure Sass mixins
that emit no CSS until used:

```scss
@use "../abstracts/responsive" as *;

.hero__title {
  font-size: 1.6rem;                        // mobile-first default
  @include desktop-up { font-size: 2.15rem; }  // ≥ 1024px
}
.sidebar { @include desktop-down { display: none; } }  // < 1024px
```

The mixins are **device-named** and use WordPress-standard px breakpoints —
deliberate, since the system embeds inside WordPress / Elementor:
`mobile 600px · tablet 782px · desktop 1024px · desktop-lg 1200px · desktop-xl
1440px`, each with an `-up` (min-width, mobile-first) and `-down` (max-width)
form. There's also `responsive-prop($property, $prefix)` for tier-driven custom
properties, and `reduced-motion` / `dark-mode` / `retina` query wrappers. This is
a *tool*, not a layer: it lives outside the `@layer` cascade and is `@use`'d only
where a media query is needed.

---

## 8. Primitives — the authoring pattern

This is the heart of the system. Every primitive follows one recipe that
delivers self-sufficiency, token upgrade, data-attribute variants, and layer
placement simultaneously. Composed `components/` blocks assemble these primitives
following the **same** recipe, differing only in their layer (`@layer component`);
page-specific tweaks to either live in the `page` layer.

### 8.1 Reference implementation

`.ui-card` is the canonical primitive — a self-sufficient surface with named
slots. (The other primitives are element-scoped controls: `button, .btn`,
`form`, `input`, `textarea`, `table`. They follow the same private-var recipe,
just with a bare element selector instead of a `.ui-<name>` class.)

```scss
// src/primitives/_card.scss
@layer primitive {
  .ui-card {
    // Private vars read the required config token — no literal fallback. This is
    // what lets the primitive adopt the design system (config.css must be loaded).
    --_bg:     var(--color-White);
    --_fg:     var(--color-Black);
    --_border: var(--color-Light-300);
    --_radius: var(--ui-radius-lg);
    --_pad:    var(--ui-space-5);
    --_gap:    var(--ui-space-4);
    --_shadow: var(--ui-shadow-1);

    display: grid;
    gap: var(--_gap);
    padding: var(--_pad);
    border: var(--ui-border-width-1) solid var(--_border);
    border-radius: var(--_radius);
    background: var(--_bg);
    color: var(--_fg);
    box-shadow: var(--_shadow);

    > * { margin: 0; }

    // Variants: data-attributes REASSIGN private vars, never restate properties.
    &[data-variant="flat"]  { --_shadow: none; }
    &[data-variant="muted"] { --_bg: var(--color-Light-50); }

    &[data-pad="sm"] { --_pad: var(--ui-space-4); }
    &[data-pad="lg"] { --_pad: var(--ui-space-6); }
  }

  // Named slots — self-contained, still token-driven.
  .ui-card__eyebrow { color: var(--color-Secondary); text-transform: uppercase; }
  .ui-card__title   { font-family: var(--ui-font-family-heading, var(--ui-font-family-base)); }
  .ui-card__body    { color: var(--color-Dark-200); }
  .ui-card__actions { display: flex; flex-wrap: wrap; gap: var(--ui-space-2); }
}
```

```html
<article class="ui-card" data-variant="muted" data-pad="lg">
  <p class="ui-card__eyebrow">Plan</p>
  <h3 class="ui-card__title">Pro</h3>
  <p class="ui-card__body">Everything in the system, per page.</p>
  <div class="ui-card__actions"><button class="btn">Choose</button></div>
</article>
```

### 8.2 The rules every primitive follows

1. **Wrap in `@layer primitive`** (a composed block in `components/` wraps in
   `@layer component` instead — that is the only difference).
2. **Every themeable property reads a private `--_*` var.** The `--_*` var reads
   a config token — a palette color (`--color-*`) or a scale token (`--ui-*`),
   guaranteed by the required `config.css` — no literal fallback:
   `--_bg: var(--color-White);`
3. **Variants only reassign `--_*` vars.** No variant restates layout/structure.
   This keeps variant CSS tiny and impossible to desync from the base.
4. **Self-contained.** A primitive references only tokens and its own private
   vars — never another primitive or a global recipe file.
5. **Data-attribute API** (decision #7): `data-variant`, `data-size`,
   `data-tone`, `data-pad`. Booleans use presence (`[data-loading]`).

### 8.3 The four override levels (no specificity fights)

```
inline style="--_bg: …"      // one instance
  ↑ [data-*] variant          // a variant class of instances
    ↑ config token (--color-* / --ui-*)  // the whole design system (required base)
```

---

## 9. Distribution

Primitives ship as **source partials** (`primitives/_card.scss`). Whoever compiles
`@use`s them directly:

- Your pages: `@use "../primitives/card"` (see §10).
- Astro / Vite / `@wordpress/scripts`: `@use "primitives/card"` (and any other pieces
  the component needs). There is no whole-library index — pull each primitive directly.

`@use` is a source-time mechanism, so this covers every consumer that runs Sass.

**A pre-built `.css` per primitive is an on-demand build, not a standing folder.**
A host that only accepts a finished file (paste into Elementor, enqueue a plain
stylesheet) needs a compiled artifact — but a partial isn't a compile target and
lacks the `@layer` statement. When that need arises, add a one-off entry:

```scss
// e.g. build/card.scss   → card.css   (create only when a host needs a file)
@use "../src/_layers";
@use "../src/primitives/card";
```

Keep such entries out of `primitives/` — a partial `_card.scss` and an entry
`card.scss` in the *same* folder make `@use "primitives/card"` an ambiguous import
that Sass rejects. Put them in a separate build/output location.

**Layered by design (decision D4):** a compiled primitive carries its `@layer`
statement (`@layer primitive`), so a host theme can still override it. If a specific
host clobbers a piece, emit an unlayered build for *that* piece rather than
delayering everything.

---

## 10. Page composition

Each page is a single flat entry named after the page (so it emits `<name>.css`).
The entry is a manifest — it pulls the layer order, the exact primitives the page
uses, and any composed blocks it renders.

```scss
// src/pages/home.scss   → home.css
@use "../_layers";

// Only the OPT-IN primitives this page renders — nothing beyond reset/base/layout
// is global, so the page lists every control it uses:
@use "../primitives/button";
@use "../primitives/card";

// Composed blocks this page renders:
@use "../components/hero";

// Page-specific tweaks live in the `page` layer (above `component`) and ship
// only in home.css:
@layer page {
  .hero .btn { --_radius: 999px; }   // pill buttons in the hero, home only
}
```

```scss
// src/components/_hero.scss  — reusable block, @layer component
@layer component {
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

## 11. Rebranding

There is no separate theme stylesheet and no runtime theme-swapping. Rebrand by
editing the hex values in `config/_colors.scss` — every component follows for
free because they read `var(--color-*)` directly (config emits the palette
case-preserved as `--color-<Name>`).

For a **scoped** override — a section, a page, a `prefers-color-scheme` block —
redeclare the `--color-*` vars you want to change in a later `:root`/scope; it
wins by source order and components re-resolve automatically:

```css
:root { --color-Primary: #d94f4b; }        /* whole-document rebrand override */

@media (prefers-color-scheme: dark) {
  :root { --color-White: #15171c; --color-Black: #e7e9ee; }
}
```

No component CSS changes; no rebuild beyond recompiling `config.css` when you
edit the palette source.

---

## 12. Migration map

| Today | Becomes | Note |
|-------|---------|------|
| `configs/tokens/*` | `src/config/*` | Wrap emission in `@layer config`. |
| `configs/helpers/_custom-properties.scss` | `src/abstracts/_emit.scss` | Renamed; lives in `abstracts/` — it's a Sass tool, not a config value. |
| `configs/recipes/*` | **deleted** | Component defaults move *into* each component as `--_*` vars. Biggest change; it is what makes components portable. |
| `configs/defaults/*` + `library/base/*` | `src/base/*` | Merges the two places base styling currently lives. |
| `library/layout/*` | `src/layouts/*` | + new primitives (stack, cluster, grid, center). |
| `library/components/_*-core.scss` | `src/primitives/_<name>.scss` | Refactor to the §8 pattern; `@use`'d directly by whoever compiles. |
| `configs/config.scss` | `src/config/config.scss` | Config entry (`config.scss`) replaces the old aggregator. |
| `configs/themes/midnight.scss` | **removed** | Runtime theme stylesheets are gone; rebrand by editing the palette in `config/_colors.scss` (§11). |
| `library/main.scss` | `src/main.scss` | Adds `@use "_layers"`. |
| `_legacy/` | **deleted** | Preserved in git history. |
| `index.html`, `midnight.html` | `library.html` | Consolidated into one standalone styleguide; never compiled. |

---

## 13. Playbooks

### Add a primitive
1. `src/primitives/_<name>.scss` — wrap in `@layer primitive` (every `primitives/`
   file shares that one layer, whether it's a `.ui-<name>` class like `card` or an
   element-scoped control like `form`/`input`/`table`).
2. Use it in a page via `@use "../primitives/<name>";` — there's no `primitives/_index`;
   each page pulls exactly what it renders.
3. Only if an external host needs a pre-built file: add a one-off entry (§9).

### Add a composed block
1. `src/components/_<name>.scss` — assemble primitives + layout; wrap in `@layer component`.
2. Use it in a page via `@use "../components/<name>";`. Page-specific tweaks go in
   that page's own `@layer page` block. (There's no `components/_index` — like
   primitives, each page pulls the blocks it renders directly.)

### Add a page
1. `src/pages/<name>.scss` — `@use "../_layers";` then `@use` the primitives/components it needs.
2. Done — the compiler globs the new flat entry automatically.

### Add a config token
1. Add to the relevant map in `src/config/_*.scss`.
2. It emits automatically via `abstracts/_emit.scss`. Reference it as `var(--ui-…)` — config
   is required, so no literal fallback (an optional override hook may chain to the
   token: `var(--ui-hook, var(--ui-…))`).

### Rebrand
1. Edit the hexes in `src/config/_colors.scss` — every component follows because
   it reads `var(--color-*)` directly. Recompile `config.css`.
2. For a scoped/dark override instead: redeclare the `--color-*` vars in a later
   `:root`/scope (§11); no component CSS changes.

### Go responsive (breakpoints)
1. Try the intrinsic primitives first — `--grid-min`, `min()`, `clamp()` usually
   remove the need for a media query entirely (§7).
2. If you still need one: `@use "../abstracts/responsive" as *;` then wrap rules
   in `@include desktop-up { … }` / `mobile-down` / etc. (device-named, mobile-first).
3. Need a new breakpoint? Add a `$bp-<name>` var + its `-up`/`-down` mixins to
   `abstracts/_responsive.scss`.

---

## 14. Conventions reference

| Thing | Convention | Example |
|-------|-----------|---------|
| Global token | `--ui-<group>-<name>` | `--ui-space-3`, `--ui-radius-sm` |
| Palette color | `--color-<Name>` (case-preserved; read directly) | `--color-Primary`, `--color-Secondary-500` |
| Component private var | `--_<role>` | `--_bg`, `--_pad` |
| Element-scoped primitive | bare selector `+ .<name>` | `button, .btn`, `input, .input` |
| Class primitive | `.ui-<name>` (+ `.ui-<name>__<slot>`) | `.ui-card`, `.ui-card__title` |
| Composed block class | `.<block>` / `.<block>__<part>` | `.hero`, `.hero__actions` |
| Variant / state | `data-<axis>="<value>"` | `data-variant="outline"` |
| Layout primitive | `.<name>` (unprefixed) | `.stack`, `.grid` |
| Responsive mixin | `<device>-up` / `<device>-down` | `@include desktop-up { … }` |
| Cascade layers | `config, reset, base, layout, primitive, component, page, override` | |

---

## 15. Naming note

`SMASCSS` currently ships a checked-in `assets/css/main.min.css` as demo output.
Under this architecture the compiler emits, at minimum:
`config.css`, `main.css`, and one `<page>.css` per page
(primitives and composed blocks ship inside the page bundles that `@use` them, not
as standalone files). Output is **flat** — one `<basename>.css` per entry directly
under `assets/css/`, no subfolders (see §4), so entry basenames stay globally unique.
