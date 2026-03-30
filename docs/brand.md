# EPOCH Brand Guide

A technical reference for engineering and design decisions across the Epoch project.

**Visual reference:** See [color-palette.html](./color-palette.html) for live color swatches, font samples, and VFD effect demos.

---

## IDENTITY

### Core Definition

**Name:** EPOCH

**Tagline:** Lunar Timekeeping

**What Epoch is:** Epoch builds open-source precision timing infrastructure for lunar and cislunar missions. A scrappy open-source project that aspires to be a serious infrastructure provider. Core values: open standards, cooperative infrastructure, thoughtful example-setting under the Open Lunar Foundation umbrella. Epoch maintains its own distinct visual identity separate from Open Lunar's purple/teal gradient aesthetic.

**Origin story:** "What if there was a clock anyone could read easily? Like a sundial in a town square." The project grew from an Open Lunar Foundation / MoonDAO research fellowship in 2023 investigating whether a lunar time standard could be a public common.

### Logo

The primary mark is a wordmark: **EPOCH** in a light-weight geometric sans-serif, all caps, with generous letter-spacing. The O is replaced by a crescent moon eclipse mark. This is the decided, in-use logo.

**Reference file:** `docs/epoch_logo.png`

#### Wordmark construction

- **Typeface:** Light-weight geometric sans-serif. Thin, even strokes — not bold, not condensed. Futura Light or equivalent; Space Grotesk at a lighter weight is an acceptable substitute.
- **Case:** All caps, no exceptions.
- **Letter-spacing:** Wide — approximately 0.35em between characters. The letters read as individual glyphs with breathing room, not as a tight block.
- **Color:** Cream `#E9DCC4` on near-black `#09090B`. The cream is warm, not pure white.

#### The crescent-O

The O is not a letterform — it is a partial eclipse mark composed of two overlapping circles:

1. **Ring:** A thin circle stroke in cream, the same weight as the surrounding letterstrokes. This is the "full moon" base.
2. **Eclipse disk:** A filled circle in the background color (`#09090B`), offset to the right of center, slightly smaller than the ring's outer diameter. It overlaps the right portion of the ring, occluding it.
3. **Result:** The left arc of the ring remains visible as a crescent. The right side disappears into the background. The crescent opens to the right — a waning crescent as seen from the northern hemisphere.

The crescent width (the visible arc) is approximately one-third of the full circle diameter. The eclipse disk is positioned so its left edge falls near the horizontal centerline of the ring, creating a deep, narrow crescent rather than a half-moon.

The mark sits at the same optical cap-height as the surrounding letters. Its width matches a standard O in the chosen typeface.

#### Wordmark typeface

Space Grotesk at 300 (Light) weight. Not Bold — the thin, even strokes are the point. Share Tech Mono is ruled out by the proportional letter spacing visible in the mark (P is narrower than E; monospaced fonts prevent this).

#### Screen rendering — backlit silkscreen + phosphor pilot light

The logo uses two distinct treatments on screen, applied to different parts of the mark:

**E, P, C, H — backlit silkscreen label**

The letterforms are rendered as a matte panel label with soft warm-white backlight diffusion. This mimics silkscreened text on a front panel — light coming through frosted ink, not a VFD element. Wide, low-intensity bloom; no sharp inner glow; warm color, not teal.

```css
.logo-text {
  color: #E9DCC4;
  text-shadow:
    0 0 20px rgba(233, 220, 196, 0.25),   /* wide diffuse backlight */
    0 0 60px rgba(233, 220, 196, 0.08);   /* ambient warmth */
}
```

**Crescent O — phosphor pilot light**

The visible arc of the crescent is treated as a lit VFD element — the one glowing thing on an otherwise matte panel. Tight VFD teal bloom on the arc only. Implemented in SVG: the ring stroke gets the glow filter; the eclipse disk and letter strokes do not.

```css
/* Applied to the crescent ring stroke via SVG filter or box-shadow */
.logo-crescent {
  filter:
    drop-shadow(0 0 2px #00E5CC)
    drop-shadow(0 0 6px rgba(0, 229, 204, 0.50))
    drop-shadow(0 0 14px rgba(0, 229, 204, 0.20));
}
```

The result reads as: *matte instrument panel label with one glowing pilot light.* The text identifies the instrument; the crescent signals it is running. This is how real hardware works — silkscreened "TACH" labels, glowing VFD bars inside.

**Do not apply VFD teal glow to the full wordmark.** The letters are panel labels, not display elements. Glowing the whole logo reads as a decorative effect; glowing only the crescent arc reads as a functioning indicator.

#### Print rendering rules

- **Screen:** Cream `#E9DCC4` + silkscreen/pilot light treatment above
- **Print:** Black on white/near-white `#FAFAF6`. No glow effects. Ring is a black stroke, eclipse disk is white fill.
- **Reversed (light background):** Near-black `#09090B` on cream — eclipse disk becomes cream, ring stroke is dark
- **Minimum size:** The crescent detail requires at least 24px cap-height to be legible; below that, use plain text wordmark

#### Favicon

The crescent arc alone (no letters, no ring — just the lit arc) at 32×32px, VFD teal `#00E5CC` on `#09090B`. It reads as a thin glowing curve — a moon sliver, a pilot light.

### Open Lunar Foundation Co-branding

Epoch operates within the Open Lunar Foundation ecosystem but maintains visual independence.

**Include "An Open Lunar Foundation project" in colophon/footer for:**
- Whitepapers and technical reports
- Conference papers and formal proposals
- Grant applications (use both identities as context requires)

**Epoch stands alone (no Open Lunar branding) for:**
- Website and landing pages
- Social media and project updates
- Live demos and interactive visualizations
- GitHub repositories and README files

---

## DUAL-MODE VISUAL SYSTEM

The Epoch brand operates in two distinct visual modes. Each mode has its own aesthetic, typography, and implementation rules. Context determines which mode applies.

### Screen Mode

**Where it applies:** Website, web dashboards, interactive demos, slide presentations, social media cards, GitHub READMEs, web-based visualizations

**Substrate:** Dark background, `#09090B` or near-black

**Display font:** DSEG7 segment font for all numerical time readouts and clock displays

**UI font:** Share Tech Mono for terminal UI, navigation, labels, and captions

**Body font:** Space Grotesk for longer text passages if needed (blog posts, detailed README prose)

**Color system:** VFD teal as the dominant instrument color. Timescale-specific color coding used in multi-timescale contexts (labels, legends, charts). See Color System section.

**Visual vocabulary:**

The screen aesthetic is modeled specifically on late-1980s VFD (Vacuum Fluorescent Display) automotive instrument clusters — Honda and Acura digital dashboards circa 1988. Not a generic retro-tech look; a specific, referential aesthetic built from the actual hardware's constraints and characteristics.

VFD hardware produces light, not reflected color. Every lit element emits phosphor glow. The visual language follows from that physics:

- Segmented bar columns (EQ/VU-meter style) for accumulating values like drift and holdover error — not sweep needles, not line charts
- 7-segment digit geometry for all numerical readouts — crisp axis-aligned rectangles, no curves
- Ghost segments (unlit segments visible at low opacity) showing the full digit skeleton behind active values — a characteristic of real VFD hardware that egui and HTML canvas can both replicate
- Phosphor bloom radiating outward from every lit element — achieved by layering semi-transparent shapes, not blur filters
- Subtle grid crosshatch behind instrument panels — the crosshatch visible on real VFD displays behind bar graphs
- Small rectangular indicator lights for status — not circular LEDs, not pill shapes; filled rectangles
- Panel zone borders as thin low-opacity lines — instruments live in distinct bordered zones, not floating on a blank background

**Design principle:** Beauty comes from precision and information density, not decoration.

**Emotional register: "Weyland-Yutani, but they're the good guys"**

The screen-mode brand draws from 1980s sci-fi corporate identity — Weyland-Yutani (Alien), Tyrell Corporation (Blade Runner), Nakatomi Corporation (Die Hard) — but inverted. These fictional companies projected institutional confidence through instrumentation aesthetics, dense technical displays, and serious hardware design. Epoch borrows that visual authority while serving the opposite purpose: open infrastructure, cooperative standards, public commons.

The screen aesthetic is **warm, technically specific, and alive** — not cold, sterile, or generically dark-mode.

### Print Mode

**Where it applies:** Whitepapers, technical datasheets, PDFs, formal proposals, conference papers, technical reports

**Substrate:** White or near-white paper, #FAFAF6

**Header accent band:** Color classified by document type following CCSDS convention (see Color System section below)

**Body font:** Space Grotesk (400/500/700 weights)

**Code/data font:** Space Mono (400/700 weights)

**Section hierarchy:** Three-level maximum (3, 3.1, 3.1.1). ALL CAPS section titles with horizontal rule below.

**Layout principles:**
- Short paragraphs (3–5 lines), dense but not crowded
- Thin horizontal rules on tables, no vertical grid lines
- Left-aligned, ragged-right body text
- Figures numbered by section (Figure 3-1, Figure 3-2, etc.)

**Block diagrams:** Square corners, orthogonal routing only, ALL CAPS labels. See Diagram Style section.

**Visual vocabulary:**
- Tektronix and HP instrumentation manual aesthetics
- Bell Labs technical report design
- Microchip datasheet formatting conventions
- NASA technical documentation structure

**Design principle:** Documents must hold their own in a stack of Microchip datasheets and NASA tech reports. They carry the personality and information density of a Tektronix 465 service manual.

---

## TYPOGRAPHY

Four typefaces, each assigned to a specific function. All are open source (Google Fonts / npm).

### Typeface Assignments

| Role | Typeface | Context | Notes |
|------|----------|---------|-------|
| **Display** | DSEG7 Classic Bold | Clock readouts, numerical time values | Screen mode only |
| **Terminal** | Share Tech Mono | UI elements, labels, captions, website code blocks | Screen and print |
| **Body/Headings** | Space Grotesk (400/500/700) | Document structure, headings, body text, tables | Print + screen docs |
| **Data/Code** | Space Mono (400/700) | Code blocks, numerical specifications, data tables | Print + screen |

### Typeface Rationale

**Space Grotesk vs. IBM Plex Sans:** Space Grotesk was selected for its geometric character—a hint of personality while remaining professional. It was designed specifically for sci-fi/technical contexts.

**Space Grotesk + Space Mono pairing:** Both typefaces were designed by Colophon Foundry and share the same skeletal structure. They mix naturally in tables and mixed-content layouts without typographic conflict.

### Print Mode Type Scale (Tektronix Convention)

| Element | Size | Weight | Case | Tracking |
|---------|------|--------|------|----------|
| Document title | 22pt | Bold | ALL CAPS | wide |
| Section title | 14pt | Bold | ALL CAPS | normal |
| Subsection | 11pt | Bold | Sentence case | normal |
| Body text | 10pt | Regular | Sentence case | normal |
| Table headers | 9pt | Bold | ALL CAPS | normal |
| Captions | 9pt | Regular | Sentence case (italic) | normal |
| Code/data | 9pt | Space Mono | As written | normal |

### Screen Mode Type Usage

- **DSEG7:** All numerical time displays, clock readouts, duration values
- **Share Tech Mono:** All UI labels, navigation items, captions, code blocks
- **Space Grotesk:** Longer prose blocks (if needed), emphasis, section breaks

---

## COLOR SYSTEM

### Screen Palette

Screen-mode colors are grounded in VFD and CRT phosphor hardware — the specific hues of analog display technology, not approximations of them. Color encodes information; it does not serve decoration.

#### Structural Colors (always present)

| Role | Hex | CSS Variable | Notes |
|------|-----|-------------|-------|
| Background | `#09090B` | `--bg` | Near-black with slight cool cast — the void behind the display |
| Surface | `#111113` | `--surface` | Panels, instrument zone interiors |
| Housing | `#1A1A1C` | `--housing` | Instrument enclosure, bezel |
| Border | `#00E5CC` at 20% | `--border` | Panel zone edges — use VFD teal at low opacity, not gray |
| Text primary | `#E9DCC4` | `--cream` | Warm white, labels, body text |
| Text dim | `#555558` | `--dim` | Secondary labels, captions |

#### Accent Hierarchy

**VFD teal is the hero color.** It is the primary instrument display color in sundial and the dominant accent on the website. All other colors are secondary — used for timescale coding in multi-timescale contexts and for status/warning states.

| Rank | Name | Bright | Dim | Role |
|------|------|--------|-----|------|
| **★ Hero** | VFD Teal | `#00E5CC` | `#00251F` | Instrument displays, active elements, primary accent. Slightly blue-shifted — not `#00FF00` (LCD green), not `#00FFFF` (pure cyan). |
| **2nd** | Amber | `#FFAA00` | `#332200` | Holdover/caution state, secondary accent, warmth |
| **3rd** | Warning Red | `#FF2255` | `#330A18` | Fault/error indicator lights. Hot pink-red — not pure `#FF0000`. |
| **4th** | Cream | `#E9DCC4` | — | Labels, body text |

#### Supporting Accents (multi-timescale contexts only)

Used on the website and in documentation when multiple timescales appear together. Not used in instrument display panels, which are monochromatic VFD teal.

| Color | Bright | Dim | Role |
|-------|--------|-----|------|
| Green | `#33FF66` | `#0A330A` | TAI |
| Magenta | `#CC66FF` | `#220033` | TCB |
| Pink | `#FF6688` | `#331018` | Secondary alert |
| Gray | `#CCCCCC` | `#222222` | Neutral |

#### Timescale → Color Mapping

| Timescale | Color | CSS vars |
|-----------|-------|----------|
| Lunar TCL | VFD Teal `#00E5CC` | `--lun`, `--lun-d` |
| UTC | Amber `#FFAA00` | `--utc`, `--utc-d` |
| TAI | Green `#33FF66` | `--tai`, `--tai-d` |
| GPS | Warning Red `#FF2255` | `--gps`, `--gps-d` |
| TCB | Magenta `#CC66FF` | `--tcb`, `--tcb-d` |
| UNIX | Cream `#E9DCC4` | `--unix`, `--unix-d` |

**The principle:** Color carries data, not decoration. In instrument panels (sundial), all displays are VFD teal; red and amber appear only for status lights. In multi-timescale web contexts, the full palette applies.

### Print Palette — Document Type Classification (CCSDS Convention)

The header accent band color classifies the document type. This follows CCSDS (Consultative Committee for Space Data Systems) conventions for technical documentation.

| Color | Hex | Document Type | Use Case |
|-------|-----|---------------|----------|
| **Blue** | `#1A3A5C` | Standards, specifications, interface definitions | Protocol specs, API docs, format definitions |
| **Magenta** | `#8B2252` | Recommended practices, architecture documents | Design rationale, system architecture, best practices |
| **Green** | `#2D6A2E` | Informational, primers, rationale | Explainers, "why we made this" docs, FAQs |
| **Orange** | `#C05A1C` | Experimental, research & development | R&D findings, preliminary results, unproven concepts |
| **Yellow** | `#B8960F` | Administrative, procedures | Process docs, checklists, operational procedures |
| **Red** | `#B22222` | Draft (any type, pre-release) | Pre-publication, internal review, "not final" status |

**Document numbering convention:** `EPOCH [NNN.N]-[C]-[V]`
- Example: `EPOCH 100.0-B-1` = Blue Book (standards), topic 100.0, version 1
- The letter (`B`, `M`, `G`, `O`, `Y`, `R`) maps to the color above

---

## DIAGRAM STYLE

Block diagrams follow Tektronix and Hewlett-Packard instrumentation manual conventions.

### Structural Rules

- **Blocks:** Rectangular shapes with square corners only. No rounded rectangles, no circles, no tilted diamonds.
- **Labels:** ALL CAPS, sans-serif (Space Grotesk), centered within blocks
- **Arrows:** Triangular arrowheads, orthogonal routing (horizontal and vertical only), no curves
- **Line weights:**
  - Primary outlines: 0.75pt
  - Secondary connections: 0.5pt
  - Wires and signals: 0.4pt

### Color Rules

**Print mode:** Black lines and text on white background

**Screen mode:** Light lines on dark background; use timescale colors where applicable (e.g., a signal path labeled GPS TIME uses `--gps` color)

### Example Structure

A typical block diagram shows:
- Input signal on the left
- Processing block in center (OSCILLATOR, PLL, FILTER, etc.)
- Output signal on right
- Control/feedback lines routed orthogonally
- All text inside blocks; no floating labels

---

## VFD RENDERING SPECIFICATION

This section defines how to implement the screen-mode aesthetic in code. An agent working from this section alone should produce output consistent with the rest of the brand without needing a visual reference.

### Bloom / Phosphor Glow

VFD elements emit light — they are not flat pixels. Every lit element is drawn three times:

1. **Core:** Shape at full color, full opacity
2. **Inner glow:** Same shape expanded 2px on all sides, same color at 40% opacity
3. **Outer glow:** Same shape expanded 6px on all sides, same color at 15% opacity

No blur filter required. Layered semi-transparent rects produce authentic phosphor spread. Ghost (unlit) segments receive no bloom layers.

In CSS, approximate with `text-shadow` or `box-shadow`:
```css
/* VFD teal element */
color: #00E5CC;
text-shadow:
  0 0 4px  #00E5CC,
  0 0 12px rgba(0, 229, 204, 0.4),
  0 0 28px rgba(0, 229, 204, 0.15);
```

### Segmented Bar Columns

The primary instrument display element. Used for drift accumulation, holdover error, and relative rate gauges.

**Geometry (main panel):**
- Segment size: 8px wide × 4px tall
- Gap between segments (vertical): 1px
- Gap between columns (horizontal): 2px
- Minimum column height: always draw all segments (lit + ghost) — never a blank column

**Geometry (narrow gauge panels):**
- Segment size: 6px wide × 3px tall
- Gaps: 1px vertical, 2px horizontal

**Fill behavior:**
- Lit segments: VFD teal, full bloom applied
- Unlit segments: VFD teal at 10% opacity, no bloom
- Columns fill from bottom up; data value maps to number of lit segments

**In egui (Rust):** Use `painter.rect_filled()` for each segment. Draw ghost rects first, then lit rects, then bloom layers on top of lit rects only.

### 7-Segment Digits

- Each segment is a thin axis-aligned filled rectangle
- Unlit segments: 10% opacity (ghost), no bloom — the full digit skeleton is always visible
- Lit segments: full color + bloom
- No anti-aliasing — crisp integer pixel boundaries
- Large readout: ~40px digit height; small readout: ~14px digit height

### Indicator Lights

Status lights are small filled rectangles — not circles, not pills.

- Size: 12px wide × 8px tall
- Active: solid fill at status color + bloom
- Inactive: same color at 15% opacity, no bloom
- Labels: 9px Share Tech Mono, uppercase, below the light

Status color assignments:
- LOCKED: VFD teal `#00E5CC`
- HOLDOVER: Amber `#FFAA00`
- FAULT: Warning red `#FF2255`
- OFFLINE: Dim (`#555558`, no bloom)

### Grid Crosshatch

Appears behind segmented bar panels only. Does not appear behind digit displays or indicator lights.

- Line spacing: 12px both axes
- Line color: VFD teal at 8% opacity
- Line width: 1px
- Draw before (behind) all other panel content

### Panel Zones

Each instrument group lives in a bordered zone:
- Border: 1px, VFD teal at 20% opacity
- Corner radius: 3px
- Interior fill: `#09090B` (same as background — zones are defined by border, not fill contrast)
- Zone label: 11px Share Tech Mono, uppercase, VFD teal, positioned below or above the zone

---

## CSS IMPLEMENTATION REFERENCE

### CSS Variables

```css
:root {
  /* Structural */
  --bg: #09090B;
  --surface: #111113;
  --housing: #1A1A1C;
  --cream: #E9DCC4;
  --dim: #555558;

  /* VFD primary */
  --vfd: #00E5CC;
  --vfd-ghost: rgba(0, 229, 204, 0.10);
  --vfd-glow-inner: rgba(0, 229, 204, 0.40);
  --vfd-glow-outer: rgba(0, 229, 204, 0.15);
  --vfd-border: rgba(0, 229, 204, 0.20);
  --vfd-grid: rgba(0, 229, 204, 0.08);
  --vfd-d: #00251F;

  /* Status colors */
  --amber: #FFAA00;
  --amber-d: #332200;
  --warning: #FF2255;
  --warning-d: #330A18;

  /* Timescale accents */
  --lun: var(--vfd);
  --lun-d: var(--vfd-d);
  --utc: var(--amber);
  --utc-d: var(--amber-d);
  --tai: #33FF66;
  --tai-d: #0A330A;
  --gps: var(--warning);
  --gps-d: var(--warning-d);
  --tcb: #CC66FF;
  --tcb-d: #220033;
  --unix: var(--cream);
  --unix-d: #222222;
}
```

### VFD Glow (CSS)

```css
/* Lit VFD element */
.vfd-lit {
  color: var(--vfd);
  text-shadow:
    0 0 4px  var(--vfd),
    0 0 12px var(--vfd-glow-inner),
    0 0 28px var(--vfd-glow-outer);
}

/* Ghost (unlit) VFD element */
.vfd-ghost {
  color: var(--vfd-ghost);
  /* no text-shadow */
}
```

### Grid Crosshatch (CSS)

```css
.instrument-panel {
  background-image:
    linear-gradient(var(--vfd-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--vfd-grid) 1px, transparent 1px);
  background-size: 12px 12px;
}
```

### Indicator Lights (CSS)

```css
.status-light {
  width: 12px;
  height: 8px;
  border-radius: 1px;
}

.status-light--locked {
  background: var(--vfd);
  box-shadow: 0 0 4px var(--vfd), 0 0 12px var(--vfd-glow-inner);
}

.status-light--holdover {
  background: var(--amber);
  box-shadow: 0 0 4px var(--amber), 0 0 12px rgba(255, 170, 0, 0.40);
}

.status-light--fault {
  background: var(--warning);
  box-shadow: 0 0 4px var(--warning), 0 0 12px rgba(255, 34, 85, 0.40);
}

.status-light--offline {
  background: var(--dim);
  /* no box-shadow */
}
```

### Panel Zone (CSS)

```css
.panel-zone {
  border: 1px solid var(--vfd-border);
  border-radius: 3px;
  background: var(--bg);
}

.panel-zone__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--vfd);
  letter-spacing: 0.08em;
}
```

---

## VOICE AND TONE

Epoch communicates like an instrument manual — precise, objective, but approachable.

### Brand Personality

**Archetype:** The Instrument — reliable, precise, purposeful, and quietly beautiful.

**If Epoch were a person:** A senior timing engineer who builds her own test equipment and keeps a vintage Tektronix scope on her bench not because she needs it, but because it works and she likes looking at it. She explains relativistic corrections over coffee using a napkin sketch. She'd rather show you a measurement than make a promise. She thinks infrastructure should be a public good, and she means it.

**We Are / We Are Not:**

| We Are | We Are Not |
|--------|------------|
| **Precise** — specifications, measurements, named systems | **Vague** — no hand-waving, no "significant improvements" |
| **Confident** — institutional authority, clear identity, "we built this" | **Arrogant** — never exclusive, never gatekeeping, never "you wouldn't understand" |
| **Warm** — analog nostalgia, inviting color, human materiality | **Cold** — not sterile, not clinical, not minimalist-for-minimalism's-sake |
| **Open** — commons-oriented, cooperative, interoperable by default | **Territorial** — never proprietary-first, never "our ecosystem" |
| **Purposeful** — everything carries information, every element earns its place | **Decorative** — no ornament without function, no gradients for vibes |
| **Nostalgic** — 80s/90s warmth, analog-era trust, instrument-grade authority | **Retro for retro's sake** — the aesthetic serves legibility and character, not cosplay |

### Voice Registers

Epoch uses three distinct voice registers depending on context.

#### Technical Register
**Used in:** Whitepapers, technical specifications, datasheets, formal documentation

**Rules:**
- Third person: "Epoch provides...", "The Space Time Card maintains..."
- Objective and impersonal
- No pronouns on datasheets
- Focus on measured performance, not capability
- Heavy use of units, specifications, tolerances

**Example:**
> The SA.65 CSAC provides 1×10⁻¹⁰ short-term stability at τ = 1s, sufficient for sub-microsecond holdover over 24-hour periods.

#### Blog/Update Register
**Used in:** Project updates, Substack posts, social media, community announcements

**Rules:**
- First person plural: "we", "our", "us"
- Casual and direct, but still specific
- Numbers and named systems are required; vague claims are forbidden
- Allowed to be playful, use analogies, show personality

#### Educational Register
**Used in:** Explainers, conference talks, live demos, tutorial content

**Rules:**
- Explanatory tone, may use "we" or "you"
- Vivid analogies from everyday experience encouraged
- Make the physics visible and intuitive
- Numbers are still required; vivid language is permitted

**Example:**
> Clocks on the Moon run 56 microseconds faster per day than clocks on Earth. That's about 20 milliseconds per year — enough to put your navigation fix 6 kilometers off target.

### Writing Rules (All Registers)

- Short, declarative sentences. One idea per sentence.
- Use concrete examples with specific numbers. "56 μs per day" not "significant drift".
- Clear distinction between facts (established, measured) and vision (could be, aspirational). Always clarify which you're describing.
- Technical accuracy is non-negotiable. Rough estimates must be labeled as such.

### Forbidden Language

Do not use these terms in any Epoch communication:

**Marketing superlatives:** Revolutionary, cutting-edge, game-changing, groundbreaking, innovative, state-of-the-art (as praise), unprecedented, world-class, best-in-class, industry-leading

**Hype constructions:** "It's not just X—it's Y", "Imagine a world where...", clusters of three adjectives, rhetorical questions as transitions

**Vague qualifiers:** Significant (use a number instead), robust (in non-statistical context), seamless, turnkey, holistic, synergy, leverage (as a verb)

**Startup-speak:** Disrupt, pivot, paradigm shift, unlock value, 10x, moonshot, democratize (use "make accessible" instead), empower

### The Test

**If a sentence could appear unchanged in a press release from any company in any industry, it is too generic for Epoch.**

Every claim should contain:
- A specific number, or
- A named system (SA.65 CSAC, STM32, Zynq 7020, etc.), or
- A concrete technical fact (phase drift, Allan deviation, holdover time, etc.)

---

## PRODUCT VOCABULARY

### Proper Terminology

| Term | Meaning | Usage Notes |
|------|---------|-------------|
| **Epoch** | The project and organization | Always capitalized |
| **Space Time Card** | The hardware reference design | Three words, title case, always |
| **sundial** | Visualization and demo application | Lowercase, even at start of sentence |
| **phaser** | Core timing library | Lowercase, even at start of sentence |
| **LTC** / **Lunar Coordinate Time** | The lunar-specific timescale | Always expand acronym on first use |
| **ADEV** / **Allan Deviation** | Frequency stability metric | Always expand acronym on first use |

### Keyword Bank (For Naming, Metaphors, Visual Language)

These words carry the Epoch aesthetic:

**Sundial metaphors:** gnomon, dial, shadow, analemma, hour line

**Horology:** complication, escapement, mainspring, chime, regulator, pivot

**Physics:** dilate, proper (time), sidereal, synodic, libration, precession

**Timing/Infrastructure:** tick, drift, pulse, holdover, beacon, anchor, datum, discipline, lock, phase

**Cooperative/Commons:** commons, infrastructure, standard, interoperability, specification

---

*Last updated: 2026-03-29*
