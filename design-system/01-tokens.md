# Tokens

Every value that should be reused lives as a CSS custom property in
`:root` (in `styles.css`). Per-project pages override the **accent palette**
via a `body.theme-*` class — see [03-themes.md](03-themes.md).

---

## Color · base palette

```css
--bg:          #FAF9F6;   /* warm off-white page background */
--bg-alt:      #F2F2F2;   /* neutral light grey, used for chip backgrounds, soft cards */
--text:        #0B0B0B;   /* near-black body text */
--muted:       #666666;   /* secondary text, supporting copy */
--border:      #EEEEEE;   /* hairlines, card outlines */
--accent:      #68FF7E;   /* signature mint green */
--accent-soft: #DCFEE2;   /* very soft mint — backgrounds, soft fills */
```

These are the **defaults**. Per-project themes redefine `--accent`,
`--accent-soft`, `--cs-accent`, `--cs-accent-soft`, and the legacy
`--cs-periwinkle` aliases — but never touch `--bg`, `--text`, etc.

---

## Color · project-cover tones

Used for the `.project-cover[data-tone="..."]` pattern in the project grid.

```css
--sand:       #F2F2F2;   /* neutral light grey  · Octopus AI */
--sage:       #DCFEE2;   /* green-tinted        · MentorUp */
--terracotta: #DDDDDD;   /* warm grey           · Smart Brook */
--cream:      #F8F8F8;   /* off-white           · Espoirer */
--slate:      #0B0B0B;   /* deep black          · Nexa AI Tools */
```

If you add a new tone, also add an entry in `.project-cover[data-tone="..."]`
in `styles.css` so the cover paints.

---

## Color · case-study aliases

A second set of color tokens, prefixed `--cs-`, used by the case-study
template (`.cs-*` components). They mirror the base palette for
*consistency*, then per-project themes override them.

```css
--cs-cream:        #FAF9F6;   /* matches --bg */
--cs-cream-warm:   #F2F2F2;   /* matches --bg-alt */
--cs-ink:          #0B0B0B;   /* matches --text */
--cs-ink-soft:     #1A1A1A;
--cs-accent:       #68FF7E;   /* matches --accent */
--cs-accent-soft:  #DCFEE2;   /* matches --accent-soft */
--cs-watermark:    #EEEEEE;   /* ghost text on cream */
--cs-periwinkle:        var(--cs-accent);      /* legacy alias */
--cs-periwinkle-soft:   var(--cs-accent-soft); /* legacy alias */
```

The `periwinkle` aliases exist because earlier case-study HTML was authored
against the periwinkle name. Do not introduce more aliases — use `--cs-accent`.

---

## Color · semantic / status

A few hardcoded colors live inline (not as tokens) and should be standardized
later if they appear more:

| Color | Use | Example |
| --- | --- | --- |
| `#C2362F` | Problem / "before" state, error eyebrows | `.octo-problem .eyebrow`, `.esp-side.before .tag` |
| `#FEE4E4` | Problem background tint | `.octo-flow-node.bad`, `.esp-side.before .tag` |
| `#F87171` | Problem border (dashed) | `.octo-flow-node.bad` |

If/when these get used in a 4th place, promote to `--warn`, `--warn-soft`, etc.

---

## Layout

```css
--container: 1200px;   /* max content width */
--gutter:    24px;     /* horizontal padding inside .container */
```

Mobile reduces `--gutter` to `16px` at `max-width: 720px`.

```css
--radius-sm: 12px;
--radius:    18px;
--radius-lg: 24px;
```

Larger radii (28–36px) are used inline for pillars/cards/windows. Standardize
later if it becomes a 4th repeating value.

---

## Typography

The system uses **two families**:

- `'Inter'` — body, UI, default everywhere
- `'Plus Jakarta Sans'` — display + heavy display headlines (`.cs-display`, `.cs-hero h1`, etc.)
- `'Caveat'` — used only for the LC monogram (script feel)

Sizes are currently **inline `clamp()`** rather than tokens. Common patterns:

| Usage | Pattern |
| --- | --- |
| Hero `<h1>` | `clamp(44px, 7.5vw, 92px)` |
| Section title | `clamp(34px, 5vw, 56px)` |
| Display title | `clamp(48px, 8vw, 104px)` |
| Body | `16px` (default), `15px` (cards), `13px` (chips/eyebrows) |
| Eyebrow | `11–13px` with `letter-spacing: 0.18em` and `text-transform: uppercase` |

If you find yourself using the same size more than 3× in different places,
promote it to a `--text-*` token at the top of `:root`.

Letter-spacing convention:

| Type | Letter-spacing |
| --- | --- |
| Display headlines | `-0.025em` to `-0.04em` |
| Body | `0` (default) |
| Eyebrow caps | `0.16em` to `0.32em` |

---

## Spacing

Section padding follows two repeating patterns:

| Pattern | Use |
| --- | --- |
| `padding: 80px 0` | Compact section |
| `padding: 100–140px 0` | Standard section |
| `padding: 60px 0 100–120px` | Tighter top, breathing bottom (when section follows a hero) |

If a 4th repeating value emerges, promote to `--space-section-sm/md/lg` tokens.

---

## Motion

Standard timing/easing combinations used across the site:

| Token | Value | Use |
| --- | --- | --- |
| Quick UI | `0.18s cubic-bezier(.2,.7,.2,1)` | Button hovers, link transitions |
| Standard | `0.32s cubic-bezier(.2,.7,.2,1)` | Cards, panels, mode switches |
| Reveal | `0.9s cubic-bezier(.2,.7,.2,1)` | `.cs-reveal` scroll-in |
| Pen ink | `0.95s cubic-bezier(.6,.1,.35,1)` | `.ink` underline draw |

The same easing curve `cubic-bezier(.2, .7, .2, 1)` ("ease-out-expo-ish") is
the **default everywhere**. Use it unless you have a reason not to.

If you add a fifth distinct motion treatment, document it here and consider
promoting to a `--motion-*` token.

---

## Z-index

Reserved layers, lowest → highest:

| Layer | Z-index | Use |
| --- | --- | --- |
| Default | `0–1` | In-flow content |
| Reveal anchors | `1` | `.cs-watermark`, etc. |
| Sticky header (project pages) | `100` | `.site-header` |
| About menu bar | `200` | `.aboutos-menubar` (sits above sticky pill) |
| Cursor + fruit overlay | `9999–10000` | `.cursor-dot`, `.cursor-ring`, `.fruit-cursor` |

If you need a higher layer, document it here.

---

## Time-of-day tinting

The body gets a class set by `script.js` based on local time:

```css
:root { --hero-tint: var(--accent-soft); }
body.time-dawn  { --hero-tint: #FFE5C8; }
body.time-day   { --hero-tint: var(--accent-soft); }
body.time-dusk  { --hero-tint: #FFD0DD; }
body.time-night { --hero-tint: #D0DAFF; }
```

Used by `.banner-art` to subtly tint with time of day. Add new tints here if
needed.

---

## What is **not** a token (yet)

Things repeated in inline styles that are candidates for promotion:

- Box shadows (`0 30px 60px -24px rgba(0,0,0,0.18)` is the most common)
- Card padding (`32px`, `36px`, `28px` all used)
- Typography sizes (clamp values repeated in multiple project pages)

Promote when the 4th repetition appears.
