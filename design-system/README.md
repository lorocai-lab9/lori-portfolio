# Lori Cai · Portfolio Design System

The reference for everything visual and interactive in this codebase. Read this once,
then keep it open while you change anything system-level.

This isn't a published site — it's source-of-truth docs for engineers/designers
modifying the codebase.

---

## Philosophy

Three rules that the system was built around:

1. **Tokens over magic numbers.** Colors, radii, spacing, container width — all
   come from CSS custom properties (`:root`). Per-project pages override the
   accent palette via a `theme-*` body class, never via inline overrides.
2. **One namespace per project.** Every project page has its own component
   prefix (`.octo-*`, `.mentor-*`, `.esp-*`, `.brook-*`, `.nexa-*`) so styles
   can never leak across pages. Shared/case-study primitives use `.cs-*`.
3. **Composition, not template reuse.** Each project page composes shared
   primitives + its own bespoke components. A page is *not* the same template
   with different copy — it's a different page with shared design tokens.

If you find yourself adding a new global utility, ask: should this be scoped
to one page instead?

---

## Folder map

```
designer-portfolio/
├── index.html                 # Home (work-first)
├── about.html                 # About (macOS-style folders)
├── designs.html               # Project index
├── contact.html
├── styles.css                 # All styles — tokens, primitives, per-page
├── script.js                  # All interactions — cursor, reveals, demos
├── robot-arm.js               # Three.js hero widget (homepage only)
├── projects/
│   ├── octopus-ai.html        # Edge AI · grey monochrome theme
│   ├── nexa-ai-tools.html     # AI tool finder · purple theme
│   ├── smart-brook.html       # Autonomous HMI · dark theme
│   ├── mentorup.html          # Mentorship · warm cream
│   └── espoirer.html          # Driver app · clean white + JP restraint
├── research/
│   └── museum-of-flight.html  # Research · embedded Notion
├── assets/
│   └── robot-arm.glb          # 3D model for hero widget
└── design-system/             # ← you are here
    ├── README.md
    ├── 01-tokens.md
    ├── 02-components.md
    ├── 03-themes.md
    ├── 04-patterns.md
    └── 05-accessibility.md
```

---

## Documents

| File | Read when |
| --- | --- |
| [01-tokens.md](01-tokens.md) | Adding a color, spacing value, font size, radius. |
| [02-components.md](02-components.md) | Building or editing a UI component. |
| [03-themes.md](03-themes.md) | Adding a new project page or changing accent palette. |
| [04-patterns.md](04-patterns.md) | Adding scroll reveals, cursor states, ink underlines, etc. |
| [05-accessibility.md](05-accessibility.md) | Anything user-facing — checked before merge. |

---

## Naming conventions

| Prefix | Meaning | Example |
| --- | --- | --- |
| `.cs-*` | Shared case-study primitive (used across project pages) | `.cs-hero`, `.cs-stage`, `.cs-stat-card` |
| `.octo-*` | Octopus AI page — scoped to that page only | `.octo-editorial`, `.octo-pillar` |
| `.mentor-*` | MentorUp page | `.mentor-tone-demo`, `.mentor-step` |
| `.esp-*` | Espoirer page | `.esp-card`, `.esp-comparison` |
| `.brook-*` | Smart Brook page | `.brook-hero`, `.brook-cluster-art` |
| `.nexa-*` | Nexa AI Tools page | `.nexa-demo`, `.nexa-layouts` |
| `.aboutos-*` | About page (macOS desktop metaphor) | `.aboutos-folder`, `.aboutos-window` |
| `.peek-*` | Designs page peek-reveal section | `.peek-stage`, `.peek-tile` |
| `.ink` | Site-wide pen-underline pattern | — |
| `.cs-reveal` | Site-wide scroll-into-view reveal | — |
| `body.theme-*` | Per-page accent override | `theme-nexa`, `theme-octo`, `theme-brook` |

**Don't** introduce new global utility classes. **Do** scope new components
to the page that needs them, with a project-specific prefix.

---

## Adding a new project page

1. Duplicate an existing project's HTML (e.g. `projects/mentorup.html`) into
   `projects/<new-slug>.html`.
2. Decide if the page needs its own theme — if yes, add a new `body.theme-<slug>`
   override block in `styles.css` (see [03-themes.md](03-themes.md)).
3. Add custom components scoped to `.<slug>-*` in `styles.css` under a labeled
   section. Place after the last existing project's section.
4. Wire the page from:
   - `designs.html` (project grid card)
   - `index.html` (featured work card, if applicable)
   - `about.html`, `contact.html`, all other project pages (footer "Projects" list)
5. If the page needs an interactive demo, add the JS handler to `script.js` in
   a self-invoking IIFE following the pattern of existing demos
   (`mentor-tone-demo`, `nexa-demo`).

---

## Adding a new global pattern

Higher bar. Before adding anything to `:root` or to a global utility:

- Confirm at least 3 pages need it (otherwise scope it).
- Check it doesn't conflict with an existing token or pattern.
- Document it in the right `.md` file.
- Test reduced-motion + coarse-pointer + keyboard before shipping.

---

## Live preview

The site is plain static HTML/CSS/JS — no build step. To preview:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

---

## Ownership

Maintained by Lori Cai · loricai1017@gmail.com
