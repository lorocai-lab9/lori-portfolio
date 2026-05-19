# Accessibility

Notes and patterns to keep the site accessible. Every change should be
reviewed against this checklist before merging.

---

## Reduced motion

The site respects `prefers-reduced-motion: reduce` everywhere it matters.

`script.js` reads the preference once at load:

```js
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Then short-circuits motion patterns:

| Pattern | Reduced-motion behavior |
| --- | --- |
| Pen underline (`.ink`) | Pre-drawn (no animation) |
| Magnetic buttons | Disabled — buttons stay static |
| Click ripple | Disabled |
| Rotator words | First word stays, no rotation |
| Custom cursor ring | No transition, jumps directly |
| Now-strip pulse | No pulse animation |
| Typewriter (`.tw-char`) | All characters visible immediately |
| Scroll reveal (`.cs-reveal`) | Currently still animates (slow fade); consider promoting to instant |

CSS-side, `@media (prefers-reduced-motion: reduce)` is used to disable
specific transitions. Add the same media query to any new motion you write.

---

## Pointer fallbacks

`script.js` reads pointer capability:

```js
const fineCursor = matchMedia('(pointer: fine)').matches;
```

Mouse-only patterns disabled on touch:

| Pattern | Touch behavior |
| --- | --- |
| Custom cursor (`.cursor-dot`, `.cursor-ring`) | Hidden, regular cursor returns |
| Cursor-following gradients (`.banner-art`, `.peek-stage`) | Static — no follow |
| Magnetic buttons | Disabled |
| Spotlight reveal (`.peek-grid`) | Mask removed — all artifacts visible |
| Fruit cursor (homepage hero) | Hidden |
| Robot arm widget | Disabled (the `.arm-stage` is hidden under 1024px viewport) |

---

## Color contrast

Body text (`#0B0B0B` on `#FAF9F6`) is 18.7:1 — passes AAA.

Muted text (`#666666` on `#FAF9F6`) is 5.8:1 — passes AA for normal text.

Accent green (`#68FF7E`) is **decorative only** — never used as standalone
body text. Used for:
- Eyebrow caps (paired with darker context)
- Big stat numbers (display sizes >40px count as Large Text under WCAG —
  passes AA at 3:1 against cream backgrounds)
- Hover state highlights
- Pen underlines (decorative)
- Backgrounds (with dark text on top)

Per-project themes: when adding a new theme, **check accent contrast**
against light AND dark backgrounds before shipping. The greyscale
`theme-octo` is the easiest to break — verify pen underlines remain
visible.

---

## Keyboard navigation

| Page | Keyboard pattern |
| --- | --- |
| All | Standard `Tab` order through `<a>`, `<button>`, form fields |
| About | `Escape` closes any open folder window |
| About | Enter/Space on a folder button opens it (native `<button>` behavior) |
| All `.btn` | Native click + Enter/Space |

**Focus states** are currently relying on browser defaults. Add explicit
`:focus-visible` styles if you remove the default outline anywhere.

---

## ARIA labels

Patterns we use:

- `aria-label` on icon-only buttons (`.nav-toggle`, `.aboutos-folder`)
- `aria-hidden="true"` on decorative SVGs and visual-only elements
  (e.g., `.brook-cluster-art`, the floating quote cards in MentorUp hero,
  the SVG inside `.ink`)
- `role="region"` + `aria-label` on each `.aboutos-window` so screen readers
  announce them as named landmarks when opened
- `aria-live="polite"` on the chat output of demos (`.mentor-chat`,
  `.nexa-demo-cards`) so updates are announced without interrupting

When adding a new component:

- Decorative? `aria-hidden="true"`.
- Interactive without visible text? `aria-label="…"`.
- Updates dynamically? `aria-live="polite"` (or `assertive` for errors).

---

## Semantic HTML

Use the right element. Quick reference:

| Use | Element |
| --- | --- |
| Section heading | `<h2>` (or `<h1>` in hero only) |
| Stat label / eyebrow | `<p class="eyebrow">` (not `<h*>`) |
| Quote | `<blockquote>` with `<cite>` |
| Navigation | `<nav>` |
| Page section | `<section>` |
| Interactive surface (no link) | `<button type="button">` |
| Internal link | `<a href="…">` |

Anti-patterns:

- ❌ `<div onclick>` — use `<button>`
- ❌ `<div class="h2">` styled to look like a heading — use `<h2>`
- ❌ Heading tags chosen by visual size rather than document outline

---

## Iframe accessibility

The research page (`research/museum-of-flight.html`) embeds Notion via
an iframe with:

```html
<iframe
  src="…"
  title="Museum of Flight UX Research — full Notion document"
  allowfullscreen
  loading="lazy"></iframe>
```

The `title` attribute is required for screen reader navigation. Always
include it on iframes.

---

## Forms (none yet)

If you add a form:

- Every `<input>` needs an associated `<label>` (use `for` + `id`, not
  placeholder-only)
- Inputs in error state need `aria-invalid="true"` + a linked `aria-describedby`
- Submit buttons describe what they do (`Send message` not `Submit`)

---

## Pre-merge checklist

Before pushing changes:

- [ ] Tab through the page — focus visible everywhere
- [ ] Open the page with motion reduced (DevTools → Rendering → Emulate)
- [ ] Open the page on mobile (DevTools device toolbar)
- [ ] Run Lighthouse — aim for accessibility score ≥ 95
- [ ] No new color contrast warnings
- [ ] Any new icons/SVGs have `aria-hidden` or `aria-label`
