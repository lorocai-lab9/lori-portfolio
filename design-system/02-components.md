# Components

All CSS components, organized by scope. Where you see `.cs-*` it's shared
across all case-study pages. Where you see a project prefix (`.octo-*`,
`.mentor-*`, etc.) it lives only on that page.

---

## Layout primitives

### `.container`

Caps content width and adds horizontal gutters.

```html
<div class="container">…</div>
```

```css
max-width: var(--container);   /* 1200px */
padding: 0 var(--gutter);      /* 24px / 16px on mobile */
margin: 0 auto;
```

### `.section`

Standard section padding. Use as the outer wrapper of any block of content.

```html
<section class="section">
  <div class="container">…</div>
</section>
```

### `.eyebrow`

Small caps label sitting above a section title.

```html
<p class="eyebrow">Featured Work</p>
```

```css
font-size: 12px;
letter-spacing: 0.14em;
text-transform: uppercase;
color: var(--muted);
```

### `.section-title`

Large display headline for marketing sections.

```html
<h2 class="section-title">A few selected projects.</h2>
```

---

## Navigation

### `.site-header > .nav-pill`

Default sticky floating-pill navigation. Used on every page **except** the
About page (where it's hidden in favor of `.aboutos-menubar`).

The pill turns from white-glass to dark on scroll via `body.nav-scrolled`
(toggled in `script.js`).

### `.aboutos-menubar`

macOS-style top menu bar — only on `about.html`. Contains a row of menu
items + a live clock + a Resume link on the right. Hidden on mobile (the
floating pill comes back).

See [04-patterns.md](04-patterns.md#about-page-folder--window-pattern) for
the full About-page interaction.

---

## Buttons

### `.btn` (base)

```html
<a class="btn btn-primary">…</a>
<a class="btn btn-secondary">…</a>
<a class="btn btn-ghost">…</a>
<a class="btn btn-sm btn-primary">…</a>
```

Primary = dark fill on light bg. Secondary = outlined. Ghost = transparent.

All `.btn`s share the magnetic-cursor effect (see [04-patterns.md](04-patterns.md#magnetic-buttons))
and the click-ripple effect.

### `.btn-resume`

Special pill in the top-right of the nav: white capsule with a dark arrow
circle. The arrow translates 2px on hover.

### Pill button (About hero)

```html
<a class="pill-btn">Visit MentorUp ↗</a>
```

Black pill, white text, 14px font, rounded 999px. Used for inline CTAs
inside case studies.

---

## Project grid

### `.projects` + `.project`

Grid of project cards used on `index.html` and `designs.html`.

```html
<a href="/projects/octopus-ai.html" class="project" data-cursor="View →">
  <div class="project-cover" data-tone="sand"></div>
  <span class="project-tag">On-device AI</span>
  <h3>Project title</h3>
  <p>One-line description.</p>
  <span class="more">View project <span class="arrow">→</span></span>
</a>
```

The `data-cursor` attribute is read by the custom-cursor system and shows
"View →" inside the cursor ring on hover.

`data-tone` paints `.project-cover` with one of the tone variants (sand,
sage, terracotta, cream, slate). See [01-tokens.md](01-tokens.md#color--project-cover-tones).

---

## Case-study primitives (`.cs-*`)

These are shared across all project detail pages. They live in `styles.css`
under the section labeled `CASE STUDY · Premium product page system`.

| Component | Purpose |
| --- | --- |
| `.cs-page` | Body class — sets the case-study background and font family. |
| `.cs-hero` | Tall centered hero with sunset radial gradient. |
| `.cs-stage` | Cream section with `.cs-watermark` ghost text. |
| `.cs-watermark` | Huge faded background text behind a section. |
| `.cs-mockup`, `.cs-mockup-wide` | Generic device mockup placeholder. |
| `.cs-scope` + `.cs-gantt` | Scope-of-work info table with shifted bars. |
| `.cs-dark` | Dark inverse section. |
| `.cs-stats` + `.cs-stat-card` | 3-card grid for stats with `.big-number`. |
| `.cs-card` + `.cs-card-grid` | Cream rounded summary card with side description. |
| `.cs-tilted` + `.ttile` | 4 tilted cards for design phases. |
| `.cs-feature`, `.cs-feature.flip` | Two-column feature explanation (image + text). |
| `.cs-scatter` + `.cs-chip` | Chip collage with mockup centerpiece. |
| `.cs-breather` | Pure spacing section with a ghost watermark. |
| `.cs-display` | Large display headline mixin. |
| `.cs-eyebrow` | Case-study eyebrow variant (uppercase, accent color). |

These compose freely. The point of per-project namespacing is so a project
can add bespoke components *and* mix in `.cs-*` primitives where they fit.

---

## Per-project components

Each project page introduces components scoped to that project. Quick map:

### Octopus AI · `.octo-*`

| Component | What it does |
| --- | --- |
| `.octo-editorial` | MyNotes-style flowing editorial paragraph with mixed-color words. |
| `.octo-inline-*` | Inline UI mockup chips (stopwatch, card, pill, stat). |
| `.octo-overview` | Skyfly-style centered "Pick. Try. Adopt." display title. |
| `.octo-tablets` | 3 staggered tablet mockups. |
| `.octo-flow` + `.octo-flow-node[.bad]` | Problem flowchart with red dashed problem nodes. |
| `.octo-quote` | Testimonial card with circular avatar + green quote marks. |
| `.octo-pillar[.is-key]` | Three design-pillar cards (middle inverted dark). |
| `.octo-arch` + `.octo-arch-box[.is-key]` | 5-column system architecture diagram on dark. |
| `.octo-impact-card` (`.before` / `.arrow` / `.after`) | Before/after comparison cards. |

### MentorUp · `.mentor-*`

| Component | What it does |
| --- | --- |
| `.mentor-hero` + `.mentor-hero-art` + `.floating-card` | Warm sage hero with phone mockup + 2 floating chat cards. |
| `.mentor-path-card` | Mindly-style soft card with circular icon + heading + quote. |
| `.mentor-step` | Step-by-step journey card (hovers slide right). |
| `.mentor-insight` | Stat card with massive number + supporting text. |
| `.mentor-tone-demo` | The tone-shift signature interaction. See [04-patterns.md](04-patterns.md#mentorup-tone-shift-demo). |
| `.persona`, `.chat-bubble[.user/.mentor]` | Pieces inside the demo. |

### Smart Brook · `.brook-*`

| Component | What it does |
| --- | --- |
| `.brook-hero` + `.brook-meta` + `.brook-hero-corners` | Bold dark hero with 3-col header + massive title + corner labels. |
| `.brook-cluster-art` (with `.arc.outer/.mid/.inner/.glow`) | CSS-built abstract HMI cluster with conic-gradient fill. |
| `.brook-process` + `.brook-process-step[.is-key]` | Connected-dot process timeline. |
| `.brook-persona` (+ `.brook-persona-bio`, `.brook-persona-side`) | 3-col user persona block. |
| `.brook-annotated-stage` + `.brook-annotation[.tl/.tr/.bl/.br]` | Annotated diagram with thin pointer lines. |
| `.brook-screens-stage` + `.screen.s1`–`.s6` | Tilted 6-screen stack with hover-to-flat. |
| `.brook-challenge` | Two-column HMW + solutions list. |

### Espoirer · `.esp-*`

| Component | What it does |
| --- | --- |
| `.esp-phone` + `.esp-phone-screen` | Phone mockup with internal screen content. |
| `.esp-card` (with `.num-bg`, `.info`, `.pkg`) | Redesigned scannable delivery card. |
| `.esp-row-before` | Cluttered "before" row style. |
| `.esp-insight` | Centerpiece insight quote at clamp(36px, 6vw, 80px). |
| `.esp-comparison-grid` + `.esp-side[.before/.after]` + `.anno` | Before/after comparison with annotations. |
| `.esp-hierarchy` + `.esp-h-row` (`.level`, `.items`, `.item[.is-key]`) | Nested data hierarchy table. |
| `.esp-loc-card` | Localization comparison cards. |

### Nexa AI Tools · `.nexa-*`

| Component | What it does |
| --- | --- |
| `.nexa-hero` + `.nexa-hero-bar` | Purple hero with decorative search bar mockup. |
| `.nexa-principle` | Numbered principle entry in 2-col ladder. |
| `.nexa-demo` | The signature visible-understanding search demo. See [04-patterns.md](04-patterns.md#nexa-search-demo). |
| `.nexa-layout-track` + `li[.is-shipped]` | Horizontal scroll-snap carousel of layout explorations. |
| `.wireframe.w-*` | 12 CSS-built wireframe sketch variants. |

### About page · `.aboutos-*`

| Component | What it does |
| --- | --- |
| `.aboutos-menubar` | macOS-style menu bar (desktop only). |
| `.aboutos-folders` + `.aboutos-folder[.is-open]` | Folder grid with click-to-open behavior. |
| `.aboutos-window[.is-shown]` | macOS-style window panel with traffic-light header. |
| `.aboutos-trajectory-row` | Career stage rows in Background folder. |
| `.aboutos-skill-card` | Skill principle cards. |
| `.aboutos-now-row` | "Currently doing" row with status badge. |
| `.aboutos-rec` | Testimonial card with vibrant green hover gradient. |
| `.aboutos-recognition` | Award/feature row with year + description. |
| `.aboutos-reading` | Book/essay row with icon. |

### Designs page · `.peek-*`

| Component | What it does |
| --- | --- |
| `.peek-stage` | Cursor-following spotlight reveal section. |
| `.peek-tile` | Behind-the-work artifact tile. |

---

## Footer

### `.site-footer`

Bottom of every page. Contains:

- `.footer-top` — 4-column grid (brand, Pages, Projects, Connect)
- `.keywords` — pill row of brand keywords
- `.footer-bottom` — copyright + location

If you add a new page, **add it to the footer's "Pages" or "Projects" list
across all HTML files** (do a project-wide find/replace). The footer is
not yet templated.
