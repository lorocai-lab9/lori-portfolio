# Themes

Each project page can have its own accent palette. Themes are body-level
overrides — they swap the accent token without touching component code.
A theme **never** redefines `--text`, `--bg`, layout tokens, or motion.

---

## How a theme works

A theme override is a single CSS block keyed on a `body.theme-*` class:

```css
body.theme-nexa {
  --accent:        #7C5CFF;
  --accent-soft:   #E5E0FF;
  --cs-accent:        #7C5CFF;
  --cs-accent-soft:   #E5E0FF;
  --cs-periwinkle:        #7C5CFF;
  --cs-periwinkle-soft:   #E5E0FF;
}
```

This cascades through every component that uses `var(--accent)` /
`var(--cs-accent)` — eyebrows, pen-underline ink, stat numbers, chips,
etc. — without you having to edit a single component.

To apply, add the class to the page's `<body>`:

```html
<body class="cs-page theme-nexa">
```

---

## Existing themes

### Default · green (no theme class)

Used by: `index.html`, `designs.html`, `about.html`, `contact.html`,
`mentorup.html`, `espoirer.html`, `research/museum-of-flight.html`.

```
--accent:      #68FF7E
--accent-soft: #DCFEE2
```

The mint green that ties the whole portfolio together.

---

### `theme-nexa` · purple

Used by: `projects/nexa-ai-tools.html`.

```
--accent: #7C5CFF (vibrant periwinkle violet)
--accent-soft: #E5E0FF
```

Matches the original Nexa product brand color. Replace the hex if/when you
have the exact product purple. **No per-component overrides needed** —
all `.nexa-*` and `.cs-*` components inherit cleanly.

---

### `theme-octo` · greyscale monochrome

Used by: `projects/octopus-ai.html`.

```
--accent:      #0B0B0B   (same as --text)
--accent-soft: #EBEBEB   (light grey)
--ink-color:   #888      (medium grey for pen underlines)
```

Note this theme also defines `--ink-color` because in greyscale, the pen
underlines need to be a **distinct** medium grey from the text — otherwise
they'd disappear. This is the only theme that overrides `--ink-color`.

The Octopus theme also adds **per-element overrides** for places where
green and dark were doing different jobs and would collapse to the same
hex in greyscale (e.g. `.octo-inline-pill`, `.octo-arch-box.is-key`,
`.octo-pillar.is-key h4 .dot`). See the `body.theme-octo` block in
`styles.css` for the full list. These are scoped *inside* the theme so
they only apply when the theme is active.

---

### `theme-brook` · dark with green

Used by: `projects/smart-brook.html`.

```
--background: #0A0A0A (body, via the .brook-* sections)
--accent:    inherited green
```

This theme is *less* about the accent and more about the page background:
`body.theme-brook` sets the whole page to dark, then most `.brook-*`
sections render on top of `#0A0A0A` with white text. The green accent
stays — it pops harder against the dark.

---

## Adding a new theme

1. Define the theme override block in `styles.css` near the other
   `body.theme-*` blocks (after the Nexa theme, alphabetically grouped):

   ```css
   body.theme-<slug> {
     --accent:        #YOURHEX;
     --accent-soft:   #YOURHEX;
     --cs-accent:        #YOURHEX;
     --cs-accent-soft:   #YOURHEX;
     --cs-periwinkle:        #YOURHEX;
     --cs-periwinkle-soft:   #YOURHEX;
   }
   ```

2. **Always override all 6** accent vars at once — the `--accent` /
   `--cs-accent` / `--cs-periwinkle` triple exists so legacy + current
   components both pick up the change.

3. Apply the class to the `<body>` of the page:

   ```html
   <body class="cs-page theme-<slug>">
   ```

4. Walk through the page in a browser. Look for places where green/black
   contrasted before but now collide. Add **per-element overrides inside
   the theme block** for those:

   ```css
   body.theme-<slug> .some-component {
     /* fix collision */
   }
   ```

   Keep these per-element overrides *inside* the theme block so they're
   self-contained and easy to find later.

5. If the theme also needs a different page background, set it on the body:

   ```css
   body.theme-<slug> {
     background: #YOURBG;
     /* + accent overrides */
   }
   ```

6. Document the theme in this file under "Existing themes" (with hex
   values + which page uses it).

---

## Anti-patterns

- ❌ Inline `style="color: #..."` instead of using the accent variable.
- ❌ Hardcoded green hex inside a `.octo-*` component when the page is
  meant to be greyscale (will leak through theme override).
- ❌ Defining a new theme without auditing every page section first.
- ❌ Using a theme to override `--text`, `--bg`, or layout tokens.
  If the page truly needs a different base palette, talk about it first
  — that's a *system* change, not a *theme*.
