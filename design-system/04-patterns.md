# Patterns

Recurring interactions and behaviors. All live in `script.js` and
`styles.css`. Each pattern degrades gracefully on touch devices and respects
`prefers-reduced-motion`.

---

## Pen underline (`.ink`)

Hand-drawn-feeling SVG underline that draws on scroll into view.

**Markup:**

```html
<span class="ink">key phrase</span>
```

**JS auto-injects** an SVG `<path>` into every `.ink` element when the page
loads, with one of three slightly-different paths (so underlines look
hand-drawn rather than identical).

**Animation:** the path uses `pathLength="1"` + `stroke-dasharray: 1` +
`stroke-dashoffset: 1`, transitioning to `0` when the `is-drawn` class is
added by an IntersectionObserver (threshold 0.55).

**Color:** `var(--ink-color)` falling back to `var(--accent)`. Override
`--ink-color` per-page in a theme if needed (Octopus does this — sets it
to medium grey to remain visible against black text).

**Reduced motion:** all underlines are pre-drawn (no animation).

---

## Scroll-into-view reveal (`.cs-reveal`)

Standard fade-up animation when an element enters the viewport.

```html
<h2 class="cs-reveal">…</h2>
<p class="cs-reveal cs-reveal-delay-1">…</p>
<p class="cs-reveal cs-reveal-delay-2">…</p>
<p class="cs-reveal cs-reveal-delay-3">…</p>
```

`-delay-1/-2/-3` add `0.08s / 0.16s / 0.24s` transition delays — use them
to stagger sibling elements within a section (eyebrow → headline →
paragraph → mockup).

Triggered by IntersectionObserver in `script.js` (threshold 0.12,
rootMargin `0px 0px -8% 0px`).

---

## Custom cursor

Two elements appended to `<body>` on `pointer: fine` devices:

- `.cursor-dot` — small white dot following the actual mouse (immediate)
- `.cursor-ring` — larger ring lerping toward the dot (smoothed)

Both use `mix-blend-mode: difference` so they invert against the page
background.

Add `data-cursor="View →"` to any element to show that text **inside the
ring** on hover. Used by project cards (see `data-cursor="View →"` in
`index.html` and `designs.html`).

For non-labeled interactive elements, the ring auto-grows to a green pill
on `:hover` over `<a>`, `<button>`, or `[data-cursor]`.

**Disabled** on `pointer: coarse` (touch devices).

---

## Magnetic buttons

All `.btn` elements pull slightly toward the cursor when hovered, then
release on mouseleave. Implemented in `script.js`. Pure CSS transform —
no layout shift.

**Disabled** with reduced motion.

---

## Click ripple

Click any `.btn` and a ripple expands from the click coordinate. Element
appended in JS, animates via `@keyframes ripple-out`, removed after `0.7s`.

**Disabled** with reduced motion.

---

## Rotating hero word (`.rotator`)

The home hero word ("alive · clear · human centered · yours") cycles every
2.4s. Each word fades up from below and the leaving word fades up and out.

JS: see the IIFE labeled "Rotating words in hero" in `script.js`.

**Reduced motion:** first word stays, no rotation.

---

## Now strip (homepage)

Marketing strip below the hero showing live state. Updates via
`data-counter-since` attributes (JS calculates days since the date).

---

## Cursor-following gradient

Two places use this pattern: `.banner-art` (homepage) and `.peek-stage`
(designs page). On mousemove, the `--mx` and `--my` CSS vars are updated
with the cursor's % position inside the element, and a `radial-gradient`
or `mask` follows.

**Disabled** on touch.

---

## Time-of-day tinting

`script.js` adds a `body.time-{dawn|day|dusk|night}` class on page load,
based on local hour. The class redefines `--hero-tint`, picked up by
`.banner-art` for a subtle warm/cool background shift.

---

## Spotlight reveal (designs page peek section)

The `.peek-stage` band uses a CSS `mask: radial-gradient(...)` centered on
the cursor position to reveal hidden artifacts only where the cursor is.
At rest, a small target icon + "Move to reveal" hint is shown.

See the `.peek-*` CSS section and the cursor handler in `script.js`.

**Disabled on touch:** mask removed, all artifacts visible.

---

## Robot arm hero widget

Three.js (loaded via importmap) drives a 3D robot arm + bowl + fruit
that renders inside `#arm-canvas` on the homepage hero. The arm picks up
fruit when you hover over the canvas region.

Code: `robot-arm.js` (separate file, loaded as ES module).

---

## Nexa search demo

The signature interactive on `projects/nexa-ai-tools.html`.

Markup gives a JSON `data-prompts="[…]"` to `.nexa-demo`. JS reads the
prompts, types out the active one character-by-character into the search
bar, then animates in 4 "system understanding" cards (Goal · Task · Situation
· Tools).

Click any `.suggestion` button to switch to a different prompt's data.
Auto-fires the first prompt on scroll-into-view.

---

## MentorUp tone-shift demo

The signature interactive on `projects/mentorup.html`.

Markup gives JSON `data-personas="[…]"` to `.mentor-tone-demo`. Each
entry has `q` (question), `a` (mentor reply), `tone`, `suggestion`.

JS toggles persona buttons, types out the user question + mentor reply,
then populates the Tone + Next-step suggestion meta cards.

Auto-fires persona 0 on scroll-into-view.

---

## About page · folder + window pattern

The macOS-style folder grid on `about.html`.

Each `.aboutos-folder` is a `<button>` with `data-folder="<slug>"`. Each
`.aboutos-window` has the matching `data-folder="<slug>"` attribute.

Click → `is-open` added to the folder, `is-shown` added to the matching
window, all others closed. Scroll smoothly down to the window.

Close via:
- The red traffic-light button
- Clicking the same folder again (toggle)
- Pressing `Escape`

The clock in the menu bar is live (updates every 30s) — set in the same
JS block.

---

## Adding a new pattern

Higher bar. Before adding:

1. Confirm at least 3 places will use it (otherwise scope it to one page).
2. Add the JS handler to `script.js` as a self-invoking IIFE that
   short-circuits if its target element isn't on the page (`if (!el) return;`).
3. Honor `reducedMotion` and `fineCursor` flags from the top of `script.js`
   if your pattern uses motion or pointer behavior.
4. Document the pattern in this file with: trigger, markup, JS hook,
   reduced-motion behavior.
