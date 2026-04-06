# Epoch Ecosystem

**Execution order / phases:** see [roadmap.md](./roadmap.md).

Three repos. Each one independently useful; together they make the website.

```
phaser          → Rust library: time scale math kernel
dash         → Rust/Python visualization app (native + WASM)
epochlunar.com  → Website: embeds dash WASM, Worker wraps phaser
```

---

## phaser

**What it is:** A pure Rust library crate. No HTTP, no runtime dependencies beyond `hifitime`. Designed to compile to native (flight hardware, ground station) and WASM (browser, Worker).

**What it contains:**
- `true_anomaly(utc_ms: f64) -> f64` — Kepler solver for lunar orbital position
- `lunar_drift_us(utc_ms: f64) -> f64` — TCL drift in µs since J2000
- Thin wrappers around `hifitime` for TAI, TT, TDB, GPS conversions (TBD: decide how much of hifitime to re-export vs. expose directly)

**Cargo.toml shape:**
```toml
[lib]
crate-type = ["cdylib", "rlib"]  # rlib for Worker import, cdylib for future WASM/npm

[dependencies]
hifitime = "4"
```

**Source of truth for:** all time scale math. The JS in dash mirrors this — different language target, not harmful duplication.

---

## dash

**What it is:** A Rust visualization app targeting native desktop and WASM (browser). It imports phaser directly — no JS time-scale duplication, no language boundary for math.

**Visual direction:** late-80s VFD (Vacuum Fluorescent Display) instrument cluster — Honda/Acura digital dash circa 1988. Segmented bar columns, 7-segment digits, phosphor bloom on near-black panels. Not an oscilloscope trace; not an LCD grid. A specific, referential aesthetic.

---

### Visual specification

An agent implementing dash should be able to reproduce the aesthetic from this section alone.

#### Color palette

| Role | Hex | Notes |
|------|-----|-------|
| VFD primary | `#00E5CC` | Teal, slightly blue-shifted. Not `#00FF00` (LCD green). Not `#00FFFF` (pure cyan). |
| VFD dim (ghost segments) | `#00E5CC` at 10% opacity | Unlit segments — barely visible, just enough to show the segment geometry |
| VFD glow (inner) | `#00E5CC` at 40% opacity, spread +2px | First bloom layer |
| VFD glow (outer) | `#00E5CC` at 15% opacity, spread +6px | Second bloom layer, wider falloff |
| Warning red | `#FF2255` | Hot pink-red, not pure red. Used for fault/error indicator lights. |
| Warning amber | `#FF8C00` | Warm orange. Used for caution states (HOLDOVER). |
| Panel background | `#0A0A0A` | Near-black (aligned with logo substrate) |
| Panel border | `#00E5CC` at 20% opacity | Thin (1px) lines defining instrument zones |
| Grid lines | `#00E5CC` at 8% opacity | Crosshatch behind bar graph panels |

#### Bloom / phosphor glow

VFD elements are not flat — they emit light. Simulate by drawing each lit element three times:
1. Core shape at full color and full opacity
2. Same shape, expanded by 2px on all sides, filled at 40% opacity (inner glow)
3. Same shape, expanded by 6px on all sides, filled at 15% opacity (outer glow)

All three layers use the same color. No blur required — layered semi-transparent rects produce convincing phosphor spread. Ghost (unlit) segments get no bloom layers.

#### Segmented bar columns

The dominant visual element. Used for the main drift display and the stacked gauge panels.

- Each column is a stack of small rectangles (segments) with uniform gaps
- Segment size: approximately 8×4px (width × height) for the main panel; 6×3px for narrow gauges
- Gap between segments: 1px vertical
- Gap between columns: 2px horizontal
- Lit segments: full VFD primary color + bloom layers
- Unlit segments: ghost color (10% opacity), no bloom
- The fill level encodes the data value — partially filled columns have lit segments from the bottom up, ghost segments above

The visual effect is identical to a hardware VU meter or EQ visualizer.

#### 7-segment digit displays

- Segment geometry: standard 7-segment, each segment is a thin filled rectangle
- Unlit segments visible at ghost opacity (10%) — the full digit "skeleton" shows even for zero-valued segments
- Bloom applied to lit segments only
- Digit size: large (primary readout ~40px tall), small (secondary readouts ~14px tall)
- No anti-aliasing — segments are crisp axis-aligned rectangles

#### Indicator lights

Small filled rectangles, 12×8px, arranged in a horizontal row.
- Active: solid fill at warning color (red or amber) + bloom
- Inactive: same color at 15% opacity, no bloom
- Labels below in VFD primary, 9px, uppercase

#### Grid crosshatch

Behind bar graph panels only. Regular grid, ~12px spacing, lines at VFD primary 8% opacity. Does not appear behind 7-segment displays or indicator lights.

#### Panel zones

The full display is one wide horizontal band, subdivided into bordered zones:
- Each zone is a rounded rectangle (radius 3px) with a 1px VFD border at 20% opacity
- Zone interior background is `#0A0A0A`
- Zone labels (e.g. "TACH", "SPEED", "FUEL") appear below or above the zone, VFD primary, 11px uppercase

#### Typography

- Zone labels and unit labels: system sans-serif (or a narrow geometric sans), uppercase, VFD primary color, 10–12px
- No decorative fonts — the segment displays carry the visual weight; labels are purely functional
- Scale tick labels (numbers along axes) same treatment, 9px

---

**Data → instrument mapping:**

| Instrument | Data |
|------------|------|
| Large 7-seg center display | Current TAI or GPS time (HH:MM:SS.mmm) |
| EQ bar graph (main panel) | Accumulated TCL drift — columns fill left to right as µs accumulates |
| Stacked narrow bar gauges (right) | Relative drift rates: TCG / TCB / TCL shown as separate fill levels |
| Indicator lights (top row) | LOCKED (teal) / HOLDOVER (amber) / FAULT (red) / OFFLINE (dim) |
| Small 7-seg secondary display | Worker RTT in ms, last sync offset |

Holdover mode: main bar columns freeze at their current fill. A second color (amber) begins filling from the frozen level, representing dead-reckoning error since last sync. A small secondary readout shows accumulated error converted to meters.

### Rendering approach

**egui (eframe) — recommended starting point**
- Immediate-mode custom painter can draw the segmented bars, 7-seg digits, and grid as plain rectangles
- Bloom/glow simulated by layering semi-transparent rects (additive-style) — convincing at this resolution
- First-class `trunk` WASM support, ~2–3 MB bundle
- Faster to iterate on layout and information design

**Bevy — upgrade path**
- Real bloom post-process via `bevy_bloom` gives authentic phosphor glow that egui can only approximate
- Worth switching if the glow effect reads as flat or unconvincing in egui
- WASM bundle ~10 MB; heavier but not a dealbreaker

Start with egui. The segmented bar layout is just rectangles. If the glow isn't convincing, migrate the renderer to Bevy with the same data model.

In both cases, `trunk` builds the WASM artifact. epochlunar.com embeds it as a `<canvas>`.

### Key win over JS

dash imports phaser as a Rust crate. All time math runs through the same code on both the Worker and the visualization — no mirroring, no drift between implementations.

```toml
# dash/Cargo.toml
[dependencies]
phaser = { git = "https://github.com/epoch-lunar/phaser" }
# + bevy or eframe
```

### Python

A Python interface (`phaser-py`) via PyO3 bindings to phaser would serve a different audience: ground station operators, Jupyter notebooks, mission planning scripts. This is separable from dash (the visualization) but belongs in the same conversation since it's another consumer of phaser.

Could live as:
- A `python/` directory inside phaser (bindings co-located with the library)
- A separate `phaser-py` repo

**Moves from epochlunar.com:** `frontend/time-scales.js`, `frontend/script.js`, `frontend/styles.css` (all deleted — logic moves to phaser + dash)

---

## epochlunar.com

**What it is:** The website and the reference integration of phaser + dash.

### Backend (Cloudflare Worker)

Thin HTTP wrapper around phaser. All math lives in phaser; the Worker just handles routing and JSON serialization.

```toml
# backend/Cargo.toml
[dependencies]
phaser = { git = "https://github.com/epoch-lunar/phaser" }
worker = "0.7"
hifitime = "4"
serde_json = "1"
```

`backend/src/lib.rs` becomes ~30 lines: parse path, call `phaser::lunar_drift_us`, serialize to JSON, return with CORS headers.

### Frontend (Cloudflare Pages)

dash's WASM build (produced by `trunk`) is checked in or fetched at build time. The page is mostly chrome around the canvas:

```html
<!-- index.html -->
<canvas id="dash"></canvas>
<script type="module" src="dash_bg.js"></script>
```

Landing page elements (brand, Substack embed, links) stay here. The clock display is entirely dash's responsibility.

### What epochlunar.com demonstrates

| File | Shows how to... |
|------|----------------|
| `backend/Cargo.toml` | import phaser into a Cloudflare Worker |
| `backend/src/lib.rs` | wrap phaser's output as a JSON API |
| `frontend/index.html` | embed dash as a WASM canvas app |

---

## Local development

phaser and epochlunar.com are separate repos, so the Worker uses a git dependency in production and a path override locally:

```toml
# epochlunar.com/.cargo/config.toml  (gitignored or committed — TBD)
[patch."https://github.com/epoch-lunar/phaser"]
phaser = { path = "../../phaser" }
```

For dash, run `trunk serve` inside the dash repo and point `index.html` at localhost during dev. For the website, dash's `trunk build` output is committed to `frontend/` or fetched via CI.

---

## Open questions

**phaser**
- [ ] How much of `hifitime` should phaser re-export vs. expose its own types?
- [ ] Should `.cargo/config.toml` be committed (with local path) or gitignored?
- [ ] Does phaser host Python bindings (`phaser-py`) in a `python/` subdir, or a separate repo?

**dash**
- [ ] How does dash receive the Worker URL at runtime? Compile-time constant, env var baked by trunk, or a JS → WASM interop call?
- [ ] Is egui's simulated bloom convincing enough, or does Bevy's real post-process bloom matter?
- [ ] Layout: single full-width panel mimicking the cluster, or separate panels per time scale?

**epochlunar.com**
- [ ] How does dash's WASM artifact get into the frontend — committed, git submodule, or fetched in CI?
- [ ] Does the current `frontend/script.js` holdover UI survive as-is until dash is ready, or rewrite now?
