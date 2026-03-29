# EPOCH Brand Guide

A technical reference for engineering and design decisions across the Epoch project.

**Visual reference:** See [color-palette.html](./color-palette.html) for live color swatches, font samples, and CRT effect demos.

---

## IDENTITY

### Core Definition

**Name:** EPOCH

**Tagline:** Lunar Timekeeping

**What Epoch is:** Epoch builds open-source precision timing infrastructure for lunar and cislunar missions. A scrappy open-source project that aspires to be a serious infrastructure provider. Core values: open standards, cooperative infrastructure, thoughtful example-setting under the Open Lunar Foundation umbrella. Epoch maintains its own distinct visual identity separate from Open Lunar's purple/teal gradient aesthetic.

**Origin story:** "What if there was a clock anyone could read easily? Like a sundial in a town square." The project grew from an Open Lunar Foundation / MoonDAO research fellowship in 2023 investigating whether a lunar time standard could be a public common.

### Logo

**Status: In exploration.** The text wordmark is the baseline. Mark concepts are under active development.

**Text wordmark (baseline):** EPOCH in Space Grotesk Bold, ALL CAPS, generous letter-spacing. Subtitle "LUNAR TIMEKEEPING" in Share Tech Mono, sized to match the width of EPOCH above it.

**Active mark concepts:**

*Crescent O (concepts 5a–5d):* The letter O in EPOCH is replaced with a waning crescent moon shape. Variants range from a thin sliver to a full-weight O with a dark crescent bite.

*Wireframe globe (concepts 6a–6c, 6-lockup):* A wireframe globe mark — meridian and equator ellipses — with a CRT phosphor fade that cuts off sharply on the right edge. Used standalone or in lockup with EPOCH + LUNAR TIMEKEEPING text. Green phosphor variant also explored.

**Rendering rules:**

- Screen: White or cream (#E9DCC4) on dark background (#0A0A0A)
- Print: Black on white/near-white (#FAFAF6)
- Header band: White (#FFFFFF) on accent color (varies by document type)

**Favicon:** Undecided. Candidates: moon emoji (🌙) placeholder, "E" in Space Grotesk Bold at 32×32px, wireframe globe mark.

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

**Substrate:** Dark background, #0A0A0A or near-black

**Display font:** DSEG7 segment font for all numerical time readouts and clock displays

**UI font:** Share Tech Mono for terminal UI, navigation, labels, and captions

**Body font:** Space Grotesk for longer text passages if needed (blog posts, detailed README prose)

**Color system:** Timescale-specific color coding (see Color System section below). Information density is the aesthetic. No decorative elements.

**Visual vocabulary:**
- 1980s/early-90s retro-futurism aesthetic
- Inspiration sources: Nissan digital dashboards, Pioneer/Kenwood/Alpine LCD stereo displays, phosphor CRT terminals, hi-fi receiver front panels, PCB layout art, AutoCAD on dark screens
- Color warmth: the amber/green/cyan palette of nighttime car dashboards and stereo EQ displays. Institutional confidence of Kodak yellow and Fuji green — warm, trustworthy, analog-era.
- Permitted effects: CRT scanline texture and subtle glow effects on main clock display
- Corner rivets/screws on housing elements (as shown on website)
- Ghost segments (dim "888" behind active display on segment displays) for visual continuity
- Segmented bar graphs (like a stereo EQ or Nissan tachometer) for data like drift accumulation, holdover quality, phase error

**Design principle:** Beauty comes from precision and information density, not decoration.

**Emotional register: "Weyland-Yutani, but they're the good guys"**

The screen-mode brand draws from 1980s sci-fi corporate identity — Weyland-Yutani (Alien), Tyrell Corporation (Blade Runner), Nakatomi Corporation (Die Hard) — but inverted. These fictional companies projected institutional confidence through instrumentation aesthetics, dense technical displays, and serious hardware design. Epoch borrows that visual authority while serving the opposite purpose: open infrastructure, cooperative standards, public commons.

This means the screen aesthetic is **warm, multi-colored, and alive** — not cold, sterile, or monochrome.

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

All screen-mode colors derive from CRT phosphor colors — the bright, saturated hues of analog display technology. Color encodes information, never serves decoration.

#### Structural Colors (always present)

| Role | Hex | CSS Variable | Notes |
|------|-----|-------------|-------|
| Background | #0A0A0A | `--bg` | Near-black, the void behind the display |
| Surface | #141414 | `--surface` | Panels, cards, elevated elements |
| Housing | #1A1A1A | `--housing` | Instrument enclosure, bezel |
| Border | #2A2A2A | `--border` | Dividers, panel edges |
| Text primary | #E9DCC4 | `--cream` | Warm white, labels, body text |
| Text dim | #555555 | `--dim` | Secondary labels, captions |

#### Accent Hierarchy (CRT phosphor colors)

Ordered by prominence. When in doubt, reach for Cyan first.

| Rank | Color | Bright | Dim | Phosphor ref | Role |
|------|-------|--------|-----|-------------|------|
| **★ Hero** | Cyan | #00DDFF | #002A33 | Blue-white phosphor | Primary accent, highlights, active states |
| **2nd** | Amber | #FFAA00 | #332200 | P3 amber phosphor | Secondary accent, warmth |
| **3rd** | White | #FFFFFF | #E9DCC4 | P4 white phosphor | Pure emphasis, flash highlights |
| **4th** | Red | #FF1A1A | #330808 | Red phosphor | Tertiary accent, alerts |

#### Supporting Accents

| Color | Bright | Dim | Role |
|-------|--------|-----|------|
| Green | #33FF66 | #0A330A | P1 green phosphor |
| Magenta | #CC66FF | #220033 | Special accent |
| Pink | #FF6688 | — | Secondary alert |
| Gray | #CCCCCC | #222222 | Neutral |

#### Current Timescale → Color Mapping

These are the current assignments used on the website. They may evolve as the product develops, but should stay consistent within any single context (a page, an app, a document).

| Timescale | Color | CSS vars |
|-----------|-------|----------|
| Lunar TCL | Cyan #00DDFF | `--lun`, `--lun-d` |
| UTC | Amber #FFAA00 | `--utc`, `--utc-d` |
| TAI | Green #33FF66 | `--tai`, `--tai-d` |
| GPS | Red #FF1A1A | `--gps`, `--gps-d` |
| TCB | Magenta #CC66FF | `--tcb`, `--tcb-d` |
| UNIX | White #FFFFFF | `--unix`, `--unix-d` |

**The principle:** Color carries data, not decoration. Within a given context, be consistent — don't switch mappings mid-page. But the specific assignments aren't sacred across the whole brand.

### Print Palette—Document Type Classification (CCSDS Convention)

The header accent band color classifies the document type. This follows CCSDS (Consultative Committee for Space Data Systems) conventions for technical documentation.

| Color | Hex | Document Type | Use Case |
|-------|-----|---------------|----------|
| **Blue** | #1A3A5C | Standards, specifications, interface definitions | Protocol specs, API docs, format definitions |
| **Magenta** | #8B2252 | Recommended practices, architecture documents | Design rationale, system architecture, best practices |
| **Green** | #2D6A2E | Informational, primers, rationale | Explainers, "why we made this" docs, FAQs |
| **Orange** | #C05A1C | Experimental, research & development | R&D findings, preliminary results, unproven concepts |
| **Yellow** | #B8960F | Administrative, procedures | Process docs, checklists, operational procedures |
| **Red** | #B22222 | Draft (any type, pre-release) | Pre-publication, internal review, "not final" status |

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

## VOICE AND TONE

Epoch communicates like an instrument manual—precise, objective, but approachable.

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
| **Nostalgic** — 80s/90s warmth, analog-era trust, Kodak/Fuji confidence | **Retro for retro's sake** — the aesthetic serves legibility and character, not cosplay |

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
> Clocks on the Moon run 56 microseconds faster per day than clocks on Earth. That's about 20 milliseconds per year—enough to put your navigation fix 6 kilometers off target.

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

## CSS IMPLEMENTATION REFERENCE

### CSS Variables

```css
:root {
  /* Structural */
  --bg: #0A0A0A;
  --surface: #141414;
  --housing: #1A1A1A;
  --border: #2A2A2A;
  --cream: #E9DCC4;
  --dim: #555555;

  /* Screen surfaces */
  --lcd: #080404;
  --lcd-panel: #0C0808;
  --crt: #060810;
  --screen-border: #1A0505;

  /* Accents */
  --cyan: #00DDFF;
  --cyan-d: #002A33;
  --amber: #FFAA00;
  --amber-d: #332200;
  --white: #FFFFFF;
  --red: #FF1A1A;
  --red-d: #330808;
  --green: #33FF66;
  --green-d: #0A330A;
  --magenta: #CC66FF;
  --magenta-d: #220033;
  --pink: #FF6688;
  --pink-d: #331018;
  --gray: #CCCCCC;
  --gray-d: #222222;

  /* Timescale aliases */
  --lun: var(--cyan);
  --lun-d: var(--cyan-d);
  --utc: var(--amber);
  --utc-d: var(--amber-d);
  --tai: var(--green);
  --tai-d: var(--green-d);
  --gps: var(--red);
  --gps-d: var(--red-d);
  --tcb: var(--magenta);
  --tcb-d: var(--magenta-d);
  --unix: var(--white);
  --unix-d: var(--gray-d);
}
```

### Phosphor Glow Effect

```css
/* Base glow pattern — adapt color per accent */
color: var(--cyan);
text-shadow:
  0 0 8px  var(--cyan),              /* tight inner glow */
  0 0 20px rgba(0, 221, 255, 0.4),  /* medium bloom */
  0 0 40px rgba(0, 221, 255, 0.1);  /* wide ambient */
```

### Scanlines Effect

```css
/* Scanlines — ::before pseudo-element on .lcd */
content: '';
position: absolute;
inset: 0;
background: repeating-linear-gradient(
  0deg,
  transparent,       transparent 2px,
  rgba(0,0,0,0.15)  2px,
  rgba(0,0,0,0.15)  4px
);
pointer-events: none;
z-index: 1;

/* Vignette — ::after pseudo-element on .lcd */
content: '';
position: absolute;
inset: 0;
background: radial-gradient(
  ellipse at center,
  transparent 0%,
  transparent 60%,
  rgba(0,0,0,0.2) 80%,
  rgba(0,0,0,0.5) 100%
);
pointer-events: none;
z-index: 10;
```

### Status Lights

```css
/* Status light — lit state (green example) */
background: #071a07;
border: 1px solid var(--green);
color: var(--green);
text-shadow: 0 0 10px var(--green), 0 0 20px rgba(51,255,102,0.4);
box-shadow: inset 0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(51,255,102,0.35);
```

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

*Last updated: 2026-03-14*
