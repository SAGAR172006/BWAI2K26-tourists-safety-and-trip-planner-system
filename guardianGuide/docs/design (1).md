# design.md — GuardianGuide UI/UX Design System

## 1. Design Philosophy

GuardianGuide is used **outdoors, in unfamiliar places, often under stress.**
Every design decision must serve these three outdoor-use principles:

1. **High contrast at all times** — readable in direct sunlight
2. **Large tap targets** — minimum 44×44px for anything interactive
3. **Instant comprehension** — no learning curve. A tourist in panic must find SOS in under 2 seconds.

**Aesthetic direction:** Modern dark-primary UI with sharp green/red safety accents. Think "mission control" meets "travel journal." Not playful. Not corporate. Confident and precise.

---

## 2. Color System

### Core Palette (CSS Variables in `tailwind.config.ts`)

```css
/* Base */
--color-bg-primary:        #0A0A0F;   /* Near-black background */
--color-bg-secondary:      #111118;   /* Card/panel backgrounds */
--color-bg-elevated:       #1A1A24;   /* Elevated surfaces (modals) */
--color-border:            #2A2A3A;   /* Subtle borders */
--color-border-strong:     #3A3A50;   /* Active/hover borders */

/* Text */
--color-text-primary:      #F0F0F8;   /* Primary text (near-white) */
--color-text-secondary:    #8888A8;   /* Labels, captions */
--color-text-muted:        #4A4A6A;   /* Placeholder, disabled */

/* Brand Accent */
--color-accent:            #6C63FF;   /* Primary brand purple */
--color-accent-hover:      #7C73FF;
--color-accent-dim:        #6C63FF22; /* Transparent accent for backgrounds */

/* Safety Zones (CRITICAL — must be distinct in sunlight) */
--color-zone-green:        #22c55e;   /* Safe zone (score > 3.0) */
--color-zone-green-bg:     #22c55e18;
--color-zone-red:          #ef4444;   /* Danger zone (score < 2.0) */
--color-zone-red-bg:       #ef444418;
--color-zone-white:        #e2e8f0;   /* Neutral zone (2.0–3.0) */
--color-zone-white-bg:     #e2e8f010;

/* Status */
--color-success:           #10b981;
--color-warning:           #f59e0b;
--color-error:             #ef4444;
--color-info:              #3b82f6;

/* SOS Screen (completely different theme) */
--color-sos-bg:            #0D0000;   /* Deep red-black */
--color-sos-primary:       #FF1A1A;   /* Emergency red */
--color-sos-pulse:         #FF4444;   /* Pulsing SOS button */
--color-sos-text:          #FFE0E0;   /* Warm white text */
```

### Glassmorphism (Side Panel)
```css
background: rgba(17, 17, 24, 0.72);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.48);
```

---

## 3. Typography

### Font Stack
```css
/* Display font — used for large headings, destination names */
--font-display: 'Clash Display', 'Sora', sans-serif;

/* Body font — all body text, labels, UI elements */
--font-body: 'DM Sans', 'Inter', sans-serif;

/* Mono — coordinates, code, budget numbers */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

> Import from Google Fonts or Fontshare (free). Clash Display from fontshare.com.

### Type Scale
| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-display` | 56px / 3.5rem | 700 | Hero text: "Waiting for you to PLAN" |
| `text-heading-1` | 36px / 2.25rem | 600 | Page titles, destination name |
| `text-heading-2` | 24px / 1.5rem | 600 | Card titles, section headers |
| `text-heading-3` | 18px / 1.125rem | 600 | Widget headers |
| `text-body` | 16px / 1rem | 400 | Body text, descriptions |
| `text-body-sm` | 14px / 0.875rem | 400 | Labels, secondary info |
| `text-caption` | 12px / 0.75rem | 400 | Zone legend text, timestamps |
| `text-mono` | 13px / 0.8125rem | 400 | Coordinates, budget figures |

---

## 4. Spacing & Layout

### Grid System
- **Desktop:** 12-column grid, 1280px max-width, 24px gutters
- **Tablet:** 8-column grid, 768px–1279px
- **Mobile:** 4-column grid, full width, 16px gutters

### Key Layout Rules
- **Left half / Right half split:** Used in Planner screen and Active Home screen (desktop/tablet)
- **Map sticky position:** On Active Home, the mini-map is `position: sticky; top: 80px` on the right half, always visible while user scrolls left content
- **Top bar height:** 64px fixed. Always visible. `z-index: 50`.
- **Side panel width:** 320px. Slides in from right. `z-index: 100`.
- **Floating SOS button:** 64×64px circle. `position: fixed; bottom: 32px; right: 32px; z-index: 90`.

### Spacing Scale (Tailwind)
Uses default Tailwind 4px base scale. Key values:
- Component padding: `p-4` (16px) for cards, `p-6` (24px) for panels
- Section gap: `gap-6` (24px) between major sections
- Inline gap: `gap-3` (12px) between sibling elements
- Border radius: `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for modals, `rounded-full` for buttons and avatars

---

## 5. Component Patterns

### Cards
All cards share a base structure:
```
bg-secondary + border border-border + rounded-xl + p-4 or p-6
```
Card variants:
- **List Card** (Must Visit/Avoid) — full width, item rows inside
- **Summary Card** (Budget, Spending) — metric-forward, large number display
- **Destination Card** (Slideshow) — image-heavy, fixed aspect ratio 4:3
- **Reservation Card** (Transport/Stay) — icon + key details, compact
- **Spot Item** — single row: icon + title + tick button + arrow button

### Buttons
```
Primary:   bg-accent text-white px-6 py-3 rounded-xl font-medium
Secondary: bg-transparent border border-border-strong text-text-primary
Danger:    bg-error/10 border border-error text-error
Ghost:     bg-transparent text-text-secondary hover:text-text-primary
Icon:      40×40px rounded-full bg-bg-elevated
Generate:  full-width bg-bg-elevated border border-border-strong py-4 text-text-primary
           (the dark "generate itinerary" button)
```

### Inputs
```
Base:      bg-bg-elevated border border-border rounded-xl px-4 py-3
Focus:     border-accent ring-1 ring-accent/30
Error:     border-error ring-1 ring-error/30
Disabled:  opacity-40 cursor-not-allowed
```

### Expanding Textarea (Planner Expectations)
- Starts at `min-height: 80px` (2 rows)
- Grows with content up to `max-height: 200px`
- At 500 chars: shows character counter in bottom-right (red when > 450)
- Implementation: `field-sizing: content` CSS or `onInput` height recalculation

---

## 6. Screen-by-Screen Design Specs

### A. Authentication Screens
- Full-screen centered layout (no top bar, no sidebar)
- Background: radial gradient from `#1A1A2E` to `#0A0A0F`
- Logo centered at top, card below it (`max-width: 420px`)
- Step indicator at top of card (4 dots, filled = completed)
- Phone input: flag emoji + country code dropdown on left, number on right
- OTP input: 6 individual square boxes, auto-focus next on input

### B. Home — Idle State
- Full viewport hero layout
- Top bar fixed at top
- Center: `SearchBar` component — large, pill shape, `min-width: 480px`
- Below search: destination slideshow fills remaining viewport height
- Slideshow layout: card on left (40% width), text on right (60% width)
- Text: destination name in `text-heading-1 font-display`, summary in `text-body text-text-secondary`
- Animation: card and text exit left, new ones enter from right. 0.5s delay on text.
- Below fold: "Waiting for you to PLAN" in `text-display font-display` + feature grid

### C. Home — Active State (Trip in Progress)
- Top bar + directory system visible
- **Desktop/Tablet:** Two-column layout
  - Left (55%): Scrollable content — Reservations, Must Visit, Must Avoid, Visited
  - Right (45%): Sticky SafetyMiniMap + Zone Legend
- "+ Manual" button: positioned at top-right of reservations section
- List card header: card name top-left + "->" arrow button top-right
- List item: `flex justify-between items-center` — title left, tick+arrow right

### D. Destination Overview Page
- Multi-grid image layout: 1 large image left (60%) + 2 stacked images right (40%)
- All images: AI-generated via Stable Diffusion (stored in Supabase storage)
- Below grid: full-width summary text in `text-body`
- Bottom of page: two floating buttons
  - `<-- Back` (left, ghost button)
  - `continue -->` (right, dark filled button with accent border)
- Small static Leaflet map: `width: 280px; height: 180px` — border view only, no zones

### E. Trip Planner Screen
- **Desktop/Tablet:** Two-column layout
  - Left (45%): Input panel (sticky, doesn't scroll)
  - Right (55%): Output window (scrollable after generation)
- Input stacking order (top to bottom): FROM → TO → DURATION → BUDGET → EXPECTATIONS → GENERATE BUTTON
- FROM and TO: side-by-side on same row with a swap icon between them
- DURATION: full width, calendar pops up below on click
- BUDGET: currency selector (dropdown with flag + code) + number input side-by-side
- Budget strike states:
  - Strike 1: yellow warning banner below input: "Minimum suggested: {amount}"
  - Strike 2: input disabled, red banner: "Budget too low. Please enter at least {amount}."
- Output panel: same visual language as Claude's output — dark bg, text streams in
- Loading: 3 dots pulsing animation for minimum 15 seconds
- Alternative itineraries: below main result, slightly dimmed, pencil icon on each

### F. Itinerary Screen
- **Desktop/Tablet:** Two-column layout
  - Left (50%): Budget card + Spending card + Reservations
  - Right (50%): To-Do list from itinerary
- Budget card: large number in `text-heading-1 font-mono text-accent`
- Spending card: shows total spent vs budget as a progress bar
- To-Do items: numbered list, each with location name, estimated cost, hashtag badges

### G. SOS Screen
**Completely different theme — not shared with rest of app.**
- Background: `--color-sos-bg` (deep red-black)
- All text: `--color-sos-text`
- Emergency directory: cards with service name + number — large tap target
- Contact button: full-width, pulsing red, `--color-sos-pulse`
- Typography: heavier weights, slightly larger size for stress-readability

### H. User Profile Screen
- No top directory bar (trip-agnostic)
- **Desktop/Tablet:**
  - Left (35%): Large circular avatar + upload overlay
  - Right (65%): All form fields + vault + emergency contacts
- Avatar: `width: 160px; height: 160px; border-radius: 50%` with camera icon overlay on hover
- Emergency contact cards: 3 slots, each with name/phone/email + delete button
- Vault textarea: monospace font, dark bg, slightly different border (like a terminal)

---

## 7. Animation Specifications

### Destination Slideshow
```
Card exit:  translateX(-100%) + opacity 0, duration 400ms, ease-in
Card enter: translateX(100%) → translateX(0) + opacity 1, duration 400ms, ease-out
Text delay: 500ms after card starts entering
Text exit:  translateY(-20px) + opacity 0, duration 300ms
Text enter: translateY(20px) → translateY(0) + opacity 1, duration 300ms
Auto-advance: every 4 seconds
```

### Side Panel
```
Enter: translateX(100%) → translateX(0), duration 300ms, spring easing
Exit:  translateX(0) → translateX(100%), duration 250ms, ease-in
Backdrop blur: opacity 0 → 1, duration 300ms
```

### AI Loading Animation ("...")
```
Three dots, each 12px circle, color --color-accent
Animation: scale 1 → 1.5 → 1, staggered 150ms between dots
Duration: 600ms per cycle, infinite loop
Minimum display: 15 seconds (even if AI responds faster)
```

### SOS Pulse Button
```
Box shadow: 0 0 0 0 rgba(255,26,26,0.7) → 0 0 0 24px rgba(255,26,26,0)
Duration: 1.5s infinite
```

---

## 8. Responsive Breakpoints

```css
/* Mobile first */
default:  0px+     (single column, full width)
sm:       640px+   (still single column, wider spacing)
md:       768px+   (tablet — two columns enabled)
lg:       1024px+  (desktop — full layout)
xl:       1280px+  (wide desktop — max-width container)
```

**Key responsive behavior changes:**
- Active Home map: sticky right column (lg+) → top of page (mobile)
- Planner inputs: left column (lg+) → full width top section (mobile)
- Side panel: fixed overlay (all sizes)
- SOS button: bottom-right fixed (all sizes)

---

## 9. Accessibility

- All interactive elements: `focus-visible` ring with `--color-accent` outline
- Color alone never used to convey information — zone colors always paired with text label
- Minimum contrast ratio: 4.5:1 for all text (WCAG AA)
- All images: `alt` attributes required
- Forms: all inputs have visible `<label>` elements (not just placeholders)
- Keyboard navigation: full tab order for all forms and navigation

---

## 10. Iconography

**Library:** Lucide React (open source, MIT license, tree-shakeable)

Key icons used:
| Usage | Lucide Icon |
|---|---|
| Must Visit tick | `CheckCircle` |
| Navigate to Google Maps | `ExternalLink` |
| Expand list card | `ArrowRight` |
| Edit itinerary | `Pencil` |
| Back button | `ChevronLeft` |
| Continue button | `ChevronRight` |
| Side panel menu | `AlignJustify` (3 bars) |
| User profile | `CircleUser` |
| SOS / Emergency | `AlertTriangle` |
| Add expense | `Plus` |
| Delete | `Trash2` |
| Flight | `Plane` |
| Train | `Train` |
| Bus | `Bus` |
| Hotel | `Hotel` |
| Budget | `Wallet` |
| Location pin | `MapPin` |
| Calendar | `CalendarDays` |
