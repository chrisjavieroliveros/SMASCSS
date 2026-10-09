# SMASCSS

> A variable-driven, per-page-optimized SCSS system whose **primitives** are
> portable enough to drop into an Astro component, a WordPress block, or an
> Elementor widget — with **nothing but `main.css`** loaded alongside.

**Where things live.** The tree has three tiers that map 1:1 to folders:
`abstracts/` is pure Sass *tools* (the `breakpoints` responsive mixins + the
`sizing` scale) that emit no CSS of their own; `global/` is everything that ships
site-wide in `main.css` — `base/` (design **tokens** as inline `:root` blocks +
reset + element defaults), `layouts/` (structural wrappers), and `helpers/`
(utility classes); `scoped/` is the **opt-in** half a page pulls in only when it
needs it — `primitives/` (the element-scoped controls `button, .btn`, `form`,
`input, .input`, `textarea, .textarea`, `table`, plus the self-sufficient
`.ui-card`), `components/` (composed blocks like `.hero`), and `pages/` (one flat
entry per page). There is no `_index` in `scoped/primitives` or
`scoped/components` — a page `@use`s each piece directly, so nothing unused
compiles in.

This is the contract: *what the system guarantees* and *how to author against
it*. The `src/` tree is the implementation; [§12](#12-structure-map) records the
current folder layout (adopted from the sibling **Partners microsite**).

**Lineage.** The taxonomy — `tokens · base · layout · helpers · primitives ·
components · pages` — is a deliberate blend: **SMACSS** (base / layout / module /
theme buckets), **Atomic Design** (primitives = atoms, components = molecules),
and **Every Layout** (the `stack` / `cluster` / `center` / `grid` layout
primitives). The `global/` vs `scoped/` split mirrors how an Astro project ships
one global stylesheet plus per-component styles — here reproduced without Astro,
as a multi-entry flat-CSS build. Names are chosen to read as familiar, not
bespoke.

---

## 1. Goals

1. **`main.css` is super-globals only.** The always-loaded baseline is the design
   tokens + reset + base element styling + layout primitives + utility helpers.
   No components live here.
2. **Pages ship only what they use.** Each page compiles its own bundle that
   `@use`s only the components it actually renders. No global component bloat.
3. **A portable `scoped/primitives/`.** Every primitive is self-sufficient: drop
   it into any host alongside `main.css` (which carries the tokens) and it renders
   and themes correctly with **zero** of the rest of the system loaded. One source
   powers the architecture and every external host.
4. **Predictable cascade under hostile hosts.** WordPress/Elementor styles coexist
   without specificity wars — the system stays low-specificity and is linked
   before host CSS, so a host always keeps the final say.

---

## 2. Decisions

The load-bearing decisions, settled. The last four are recommended defaults —
flip any of them and this doc updates.

| # | Decision | Choice |
|---|----------|--------|
| 1 | Per-page CSS strategy | **Manual composition** — each page has an entry that `@use`s only what it needs. No purge/scan step. |
| 2 | Component portability contract | **Variable-driven + token hooks** — components read required tokens (shipped in `main.css`) directly; no baked literal fallbacks. Ship the piece alongside `main.css`. |
| 3 | Specificity / embedding | **No cascade layers — source/link order + low specificity.** `main.css` links first, page bundle after, host CSS last (and wins). |
| 4 | Distribution | **SCSS source partials**, `@use`'d directly by whoever compiles; per-component compiled CSS produced on demand (§9). |
| 5 | Tokens | **Inline `:root` blocks, shipped in `main.css`, REQUIRED.** No separate `variables.css`. |
| 6 | Universal chrome (header/footer) | **No shared bundle — everything is per-page.** One mental model. |
| 7 | Variant API | **Data-attributes** (`[data-variant]`, `[data-size]`, `[data-tone]`). |
| 8 | Build tool | **External** — the compiler is out of scope; it auto-globs non-partial `.scss`. |
| 9 | Component defaults | **Self-contained via private `--_*` vars** that read the required global design tokens. |
| 10 | Utilities | **Layout primitives + margin/padding helpers** (the `helpers/` tier), plus component vars. |
| 11 | Theming | **Rebrand by editing the palette** in `global/base/_colors.scss` (or overriding `--color-*` in a later `:root`); no runtime theme stylesheets. |
| 12 | Entry discovery | **Auto-glob** — any non-`_` `.scss` compiles to a matching `.css`; folders are free to reorganize. |
| D1 | Class prefix | *(default)* `.ui-` for classes, `--_*` for private vars, `--ui-*` / `--color-*` for tokens. |
| D2 | Component v1 catalog | *(default)* all opt-in `scoped/primitives/`: `button`, `form`, `input`, `textarea`, `table`, `card`. Nothing component-level ships in `main.css`. |
| D3 | Variant vocabulary | *(default)* `data-variant` (shape) · `data-size` · `data-tone` (semantic color). |
| D4 | Standalone drop-ins | *(default)* ship a compiled piece as plain rules; it stays overridable because the system is low-specificity and host CSS links last. |

---

## 3. The cascade model

There are **no CSS cascade layers**. Precedence is ordinary CSS: source order and
specificity, arranged so the right thing wins without `!important`.

Two levers set the order:

1. **`@forward` order inside the `_index` files** — the build concatenates
   partials in the order they're forwarded. `global/_index.scss` forwards
   **base → layouts → helpers**, and `global/base/_index.scss` forwards
   **reset → tokens → element defaults**. So a reset rule is emitted before the
   element default that should beat it, and utility helpers are emitted last so a
   `.mt-4` beats a component's own margin.
2. **`<link>` / `@use` order at runtime** — `main.css` is linked first; each page
   bundle (`<page>.css`) is linked after, so a page rule beats a global one; and
   any **host** CSS linked after the page bundle wins last.

| Tier | Owner | Contains | Emitted |
|------|-------|----------|---------|
| tokens | `main.css` | `:root { --color-* / --ui-* }` — palette + space/radius/shadow/transition/type scales. First, so everything reads them. Custom-prop values resolve at use time, so declaration order is inert; a later `:root` can still redeclare a token and win by source order. | early in `base/` |
| reset | `main.css` | Normalize / reset. First in `base/` so element defaults override it. | `base/_reset` |
| base | `main.css` | Global semantic element defaults (`:root`, typography, media). | `base/` |
| layout | `main.css` | Layout primitives (stack, cluster, grid, container, center). | `layouts/` |
| helpers | `main.css` | Utility classes (margin, padding — `!important`). Last, so utilities win. | `helpers/` |
| primitives | page bundle | `scoped/primitives/` — opt-in controls + `.ui-card`. A page `@use`s only what it renders. | `<page>.css` |
| components | page bundle | Composed blocks (`.hero`). | `<page>.css` |
| page tweaks | page bundle | Page-specific styling. Emitted after the page's primitives/components, so it wins. | `<page>.css` |

**The embedding guarantee:** because the system is low-specificity and `main.css`
+ the page bundle are linked *before* the host's own CSS, a WordPress theme or
Elementor global style linked afterward beats the system by ordinary source order.
That is the "stays overridable" property — no layers required. Keep selectors
low-specificity so a host never has to fight.

---

## 4. Directory structure

```
src/
  main.scss                    // → main.css  (tokens + reset + base + layout + helpers; no components)

  abstracts/                   // TOOLS — pure Sass, emit ~no CSS, not shipped on their own
    _breakpoints.scss          //   device-named responsive mixins (mobile-up … desktop-xl-down) + responsive-prop
    _sizing.scss               //   the $space scale → --ui-space-* (a Sass map the helpers also read)

  global/                      // ships site-wide in main.css, via global/_index.scss (base → layouts → helpers)
    _index.scss                //   @forward "base"; @forward "layouts"; @forward "helpers";

    base/                      // design tokens + reset + element defaults
      _index.scss              //   @forward reset → tokens (colors,radius,shadows,transitions) → root,typography,media
      _colors.scss             //   brand palette (inline :root, case-preserved --color-<Name>)  ← the file you EDIT
      _radius.scss  _shadows.scss  _transitions.scss   //   scale tokens (inline :root)
      _reset.scss  _root.scss  _media.scss
      _typography.scss         //   font/size/weight/line-height tokens (inline :root) + the element styling that reads them

    layouts/                   // layout primitives
      _container.scss  _stack.scss  _cluster.scss  _grid.scss  _center.scss  _index.scss

    helpers/                   // utility classes (forwarded LAST so they win)
      _margin.scss  _padding.scss  _index.scss

  scoped/                      // OPT-IN — a page @uses only what it renders (no _index in primitives/components)
    primitives/
      _button.scss  _form.scss  _input.scss  _textarea.scss  _table.scss  _card.scss
    components/
      _hero.scss               //   e.g. .hero, assembled from primitives + layout (@use per page)
    pages/
      home.scss                //   ENTRY → home.css
      library.scss             //   ENTRY → library.css (the worked example behind library.html)

library.html                   // standalone styleguide preview (never compiled)
```

**Entry vs partial:** files without a leading underscore are entries and compile
to a same-named `.css`; `_name.scss` files are partials and never emit on their
own. The external compiler globs entries, so *adding a page is just dropping a
file* — no build config to edit.

**Flat output.** The compiler emits by **basename only** — every entry lands
directly in the output dir (e.g. `assets/css/`) as `<basename>.css`, regardless of
which `src/` subfolder it lives in. `src/scoped/pages/home.scss` →
`assets/css/home.css`; there is **no** `pages/` output subfolder. Consequence:

- **Entry basenames must be globally unique.** A second `main.scss` anywhere would
  clobber the root entry. Keep every entry's basename distinct across the tree — a
  subfolder gives no namespacing at output time.

---

## 5. Runtime load order

```html
<link rel="stylesheet" href="/css/main.css">            <!-- 1. tokens + reset + base + layout + helpers (global, REQUIRED) -->
<link rel="stylesheet" href="/css/home.css">            <!-- 2. THIS page's primitives + components + styles -->
```

Step 1 is the same on every page and caches once; it holds the palette plus the
space/radius/shadow/transition/type scales, so it is **required** — nothing renders
correctly until it loads. Step 2 is unique per page and carries only that page's
components. `main.css` must link **before** the page bundle so page rules win by
source order.

---

## 6. Tokens (shipped in `main.css`)

Tokens are the primitive design values, emitted as CSS custom properties. They are
the **single source of truth** for the palette and scales the system reads, and the
values an external host adopts to take on your brand. They are **required**: they
ship in `main.css`, which loads first on every page.

**Each token file emits its own `:root` block** — there is no central emitter.
Every `global/base/_*.scss` value file (and `abstracts/_sizing.scss`) holds a Sass
map and a plain `:root { @each … }` that turns it into custom properties:

```scss
// src/global/base/_radius.scss — the self-emitting pattern every token file follows
$radius: (sm: 8px, md: 14px, lg: 24px);   // px

:root {
  @each $name, $value in $radius {
    --ui-radius-#{$name}: #{$value};
  }
}
```

```scss
// src/abstracts/_sizing.scss — spacing is the one scale that lives in abstracts,
// because the margin/padding helpers read the $space map at build time too.
$space: (1: 0.25rem, 2: 0.5rem, 3: 0.75rem, 4: 1rem, 5: 1.5rem, 6: 2rem, 7: 3rem);

:root {
  @each $step, $value in $space { --ui-space-#{$step}: #{$value}; }
}
```

Conventions:
- **Color is the raw palette**, emitted **case-preserved** as `--color-<Name>`
  (e.g. `--color-Primary`, `--color-Primary-Shade`, `--color-Secondary-500`), and
  read **directly** by components — there is no semantic color layer. Lives in
  `global/base/_colors.scss`.
- **Scale tokens** (`--ui-space-3`, `--ui-radius-sm`, `--ui-shadow-1`) are the
  primitive steps. Radius is authored in **px**; spacing lives in `abstracts/_sizing`.
- **Reusable easings.** `global/base/_transitions.scss` emits
  `--ui-ease-power1 … -power4` — cubic-bezier approximations of GSAP's Power
  (Quad→Cubic→Quart→Quint) ease-out curves — usable anywhere a timing function is
  needed, plus `--ui-transition-fast`.
- **Typography tokens live with the styling.** Fonts, sizes, weights, and
  line-heights — including the heading (`--ui-font-size-h1 … -h6`) and display
  (`--ui-font-size-display-1 … -3`) scales — are defined in
  `global/base/_typography.scss`, right next to the element rules that read them.
- The full palette ramp is exposed (`--color-Primary-500`) for direct use.

Consumers read tokens with **no literal fallback**. Only structural or behavioral
CSS-keyword defaults (`margin: 0`, `currentColor`, `underline`) and trivial
constants (a `1px` hairline) stay inline — those are not tokens.

---

## 7. Baseline (`main.css`)

`main.scss` (at the `src/` root) is the "super globals" entry. It pulls the spacing
scale and the `global/` bundle — tokens, reset, base element styling, layout
primitives, and utility helpers — and **nothing component-level**.

```scss
// src/main.scss
@use "abstracts/sizing";   // --ui-space-* tokens ship in main.css
@use "global";             // base → layouts → helpers  (global/_index.scss)
```

```scss
// src/global/_index.scss
@forward "base";      // tokens + reset + element defaults
@forward "layouts";   // structural wrappers
@forward "helpers";   // utility classes — LAST, so they win
```

Each partial is plain CSS — no `@layer` wrapper. Cascade order comes from the
`@forward` sequence above (and the `<link>` order at runtime). Example:

```scss
// src/global/base/_reset.scss  — first, so element defaults beat it
* { margin: 0; }

// src/global/layouts/_stack.scss
.stack { display: grid; gap: var(--stack-gap, var(--ui-space-4)); }
```

Layout primitives + the margin/padding helpers are the deliberate utility surface
(decision #10). The layout set: `container`, `stack`, `cluster`, `grid`, `center`.

**Responsiveness is intrinsic-first.** These primitives reflow *without* media
queries — `.grid` uses `auto-fit` + `minmax(min(100%, var(--grid-min)), 1fr)`,
`.container` uses `min()`, and type can `clamp()`. Reach for a breakpoint only when
a layout genuinely can't reflow on its own. When you do, the tool is
`abstracts/_breakpoints.scss` — pure Sass mixins that emit no CSS until used:

```scss
@use "../../abstracts/breakpoints" as *;

.hero__title {
  font-size: 1.6rem;                           // mobile-first default
  @include desktop-up { font-size: 2.15rem; }  // ≥ 1024px
}
.sidebar { @include desktop-down { display: none; } }  // < 1024px
```

The mixins are **device-named** and use WordPress-standard px breakpoints —
deliberate, since the system embeds inside WordPress / Elementor:
`mobile 600px · tablet 782px · desktop 1024px · desktop-lg 1200px · desktop-xl
1440px`, each with an `-up` (min-width, mobile-first) and `-down` (max-width) form.
There's also `responsive-prop($property, $prefix)` for tier-driven custom
properties, and `reduced-motion` / `dark-mode` / `retina` query wrappers. This is a
*tool*: it's `@use`'d only where a media query is needed.

---

## 8. Primitives — the authoring pattern

This is the heart of the system. Every primitive follows one recipe that delivers
self-sufficiency, token upgrade, and data-attribute variants simultaneously.
Composed `scoped/components/` blocks assemble these primitives following the
**same** recipe; page-specific tweaks to either live as plain rules in the page
bundle, emitted after the piece so they win.

### 8.1 Reference implementation

`.ui-card` is the canonical primitive — a self-sufficient surface with named slots.
(The other primitives are element-scoped controls: `button, .btn`, `form`, `input`,
`textarea`, `table`. They follow the same private-var recipe, just with a bare
element selector instead of a `.ui-<name>` class.)

```scss
// src/scoped/primitives/_card.scss   (plain rules — no @layer)
.ui-card {
  // Private vars read the required design token — no literal fallback. This is
  // what lets the primitive adopt the design system (main.css must be loaded).
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
  border: 1px solid var(--_border);
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

1. **Plain rules, no `@layer`.** A primitive and a composed block differ only in
   folder (`scoped/primitives/` vs `scoped/components/`) and selector granularity.
2. **Every themeable property reads a private `--_*` var.** The `--_*` var reads a
   design token — a palette color (`--color-*`) or a scale token (`--ui-*`),
   guaranteed by the required tokens in `main.css` — no literal fallback:
   `--_bg: var(--color-White);`
3. **Variants only reassign `--_*` vars.** No variant restates layout/structure.
   This keeps variant CSS tiny and impossible to desync from the base.
4. **Self-contained.** A primitive references only tokens and its own private vars —
   never another primitive or a global recipe file.
5. **Data-attribute API** (decision #7): `data-variant`, `data-size`, `data-tone`,
   `data-pad`. Booleans use presence (`[data-loading]`).

### 8.3 The override levels (no specificity fights)

```
inline style="--_bg: …"      // one instance
  ↑ [data-*] variant          // a variant class of instances
    ↑ token (--color-* / --ui-*)  // the whole design system (required, in main.css)
```

---

## 9. Distribution

Primitives ship as **source partials** (`scoped/primitives/_card.scss`). Whoever
compiles `@use`s them directly:

- Your pages: `@use "../primitives/card"` (see §10).
- Astro / Vite / `@wordpress/scripts`: `@use "primitives/card"` (and any other
  pieces the component needs). There is no whole-library index — pull each primitive
  directly.

`@use` is a source-time mechanism, so this covers every consumer that runs Sass.

**A pre-built `.css` per primitive is an on-demand build, not a standing folder.**
A host that only accepts a finished file (paste into Elementor, enqueue a plain
stylesheet) needs a compiled artifact. When that need arises, add a one-off entry:

```scss
// e.g. build/card.scss   → card.css   (create only when a host needs a file)
@use "../src/scoped/primitives/card";
```

Keep such entries out of `scoped/primitives/` — a partial `_card.scss` and an entry
`card.scss` in the *same* folder make `@use "primitives/card"` an ambiguous import
that Sass rejects. Put them in a separate build/output location.

**Stays overridable by design (decision D4):** a compiled primitive is
low-specificity plain CSS, so a host theme linked afterward overrides it by source
order. Load `main.css` (the tokens) alongside the piece so it themes correctly.

---

## 10. Page composition

Each page is a single flat entry named after the page (so it emits `<name>.css`).
The entry is a manifest — it `@use`s the exact primitives the page uses and any
composed blocks it renders, then adds page-specific tweaks below.

```scss
// src/scoped/pages/home.scss   → home.css
// main.css (loaded alongside in the <head>) carries tokens + globals; this
// bundle carries only what is unique to THIS page, and wins by link order.

// Only the OPT-IN primitives this page renders:
@use "../primitives/button";
@use "../primitives/card";

// Composed blocks this page renders:
@use "../components/hero";

// Page-specific tweaks — plain rules, ship only in home.css:
.hero .btn { --_radius: 999px; }   // pill buttons in the hero, home only
```

```scss
// src/scoped/components/_hero.scss  — reusable block, plain rules
.hero { display: grid; gap: var(--ui-space-6); }
.hero__actions { display: flex; flex-wrap: wrap; gap: var(--ui-space-3); }
```

> Name the entry `home.scss`, not `index.scss` — the compiler emits a `.css`
> matching the entry's basename, and you want `home.css`.

Trade-off, accepted per decision #6: a primitive used on five pages appears in five
page bundles. In exchange every page downloads *only* its own components, and there
is no scanning step that can guess wrong.

---

## 11. Rebranding

There is no separate theme stylesheet and no runtime theme-swapping. Rebrand by
editing the hex values in `global/base/_colors.scss` — every component follows for
free because they read `var(--color-*)` directly (that file emits the palette
case-preserved as `--color-<Name>`).

For a **scoped** override — a section, a page, a `prefers-color-scheme` block —
redeclare the `--color-*` vars you want to change in a later `:root`/scope; it wins
by source order and components re-resolve automatically:

```css
:root { --color-Primary: #d94f4b; }        /* whole-document rebrand override */

@media (prefers-color-scheme: dark) {
  :root { --color-White: #15171c; --color-Black: #e7e9ee; }
}
```

No component CSS changes; no rebuild beyond recompiling `main.css` when you edit the
palette source.

---

## 12. Structure map

The current layout mirrors the sibling **Partners microsite** (`global/` +
`scoped/` tiers, `abstracts/` tools), reproduced here without Astro as a
multi-entry flat-CSS build. It replaces the earlier `@layer`-based layout
(`src/_layers.scss`, a separate `variables/` folder + `variables.css`, and an
`emit` mixer):

| Earlier layout | Now | Note |
|----------------|-----|------|
| `src/_layers.scss` (`@layer` order) | **removed** | No cascade layers; order comes from `@forward` + `<link>` sequence (§3). |
| `src/variables/*` + `variables.css` | `src/global/base/_*.scss` + `abstracts/_sizing.scss` | Tokens are inline `:root` blocks, shipped in `main.css`; spacing lives in `abstracts/`. No separate `variables.css`. |
| `src/abstracts/_emit.scss` | **removed** | Each token file emits its own `:root { @each … }`; no central emitter. |
| `src/abstracts/_responsive.scss` | `src/abstracts/_breakpoints.scss` | Renamed; same mixins. |
| `src/base/*` | `src/global/base/*` | + the token files (`_colors`, `_radius`, `_shadows`, `_transitions`) moved in from `variables/`. |
| `src/layouts/*` | `src/global/layouts/*` | Unchanged content. |
| *(new)* | `src/global/helpers/*` | Margin/padding utility classes on the `$space` scale. |
| `src/primitives/*` | `src/scoped/primitives/*` | `@layer primitive` wrapper dropped. |
| `src/components/*` | `src/scoped/components/*` | `@layer component` wrapper dropped. |
| `src/pages/*` | `src/scoped/pages/*` | `@use "../_layers"` and `@layer page` dropped. |

---

## 13. Playbooks

### Add a primitive
1. `src/scoped/primitives/_<name>.scss` — plain rules (no `@layer`), whether it's a
   `.ui-<name>` class like `card` or an element-scoped control like `form`/`input`.
2. Use it in a page via `@use "../primitives/<name>";` — there's no
   `scoped/primitives/_index`; each page pulls exactly what it renders.
3. Only if an external host needs a pre-built file: add a one-off entry (§9).

### Add a composed block
1. `src/scoped/components/_<name>.scss` — assemble primitives + layout, plain rules.
2. Use it in a page via `@use "../components/<name>";`. Page-specific tweaks go as
   plain rules in that page bundle. (No `scoped/components/_index` — pull directly.)

### Add a page
1. `src/scoped/pages/<name>.scss` — `@use` the primitives/components it needs, then
   page tweaks as plain rules.
2. Done — the compiler globs the new flat entry automatically.

### Add a design token
1. Colors/radius/shadows/transitions/typography → the matching
   `src/global/base/_*.scss` (extend its Sass map or `:root`); spacing →
   `src/abstracts/_sizing.scss` (`$space`).
2. It emits automatically via that file's own `:root { @each … }`. Reference it as
   `var(--ui-…)` / `var(--color-…)` — tokens are required, so no literal fallback
   (an optional override hook may chain: `var(--ui-hook, var(--ui-…))`).

### Rebrand
1. Edit the hexes in `src/global/base/_colors.scss` — every component follows
   because it reads `var(--color-*)` directly. Recompile `main.css`.
2. For a scoped/dark override instead: redeclare the `--color-*` vars in a later
   `:root`/scope (§11); no component CSS changes.

### Go responsive (breakpoints)
1. Try the intrinsic primitives first — `--grid-min`, `min()`, `clamp()` usually
   remove the need for a media query entirely (§7).
2. If you still need one: `@use "../../abstracts/breakpoints" as *;` then wrap rules
   in `@include desktop-up { … }` / `mobile-down` / etc. (device-named, mobile-first).
3. Need a new breakpoint? Add a `$bp-<name>` var + its `-up`/`-down` mixins to
   `abstracts/_breakpoints.scss`.

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
| Utility helper | `.<prop><side>-<step>` | `.mt-4`, `.px-2`, `.mx-auto` |
| Variant / state | `data-<axis>="<value>"` | `data-variant="outline"` |
| Layout primitive | `.<name>` (unprefixed) | `.stack`, `.grid` |
| Responsive mixin | `<device>-up` / `<device>-down` | `@include desktop-up { … }` |

---

## 15. Naming note

`SMASCSS` ships a checked-in `assets/css/main.min.css` as demo output. Under this
architecture the compiler emits, at minimum: `main.css` (tokens + globals) and one
`<page>.css` per page (primitives and composed blocks ship inside the page bundles
that `@use` them, not as standalone files). Output is **flat** — one
`<basename>.css` per entry directly under `assets/css/`, no subfolders (see §4), so
entry basenames stay globally unique.
