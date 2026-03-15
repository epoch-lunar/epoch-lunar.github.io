# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EPOCH is a static single-page website for lunar timekeeping, deployed via GitHub Pages. It displays multiple astronomical time scales (TCL/Lunar, TCB, TAI, UTC, GPS, UNIX) with a retro LCD instrument aesthetic, and shows the local system's deviation from network time.

## Development

No build step — open `index.html` directly in a browser or serve it locally:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

The page actively tries to fetch from `http://localhost:8765/ntp` during development. This is for a local NTP proxy server (not included in repo) that returns JSON with `{ servers: [{name, offset, rtt}], averageOffset }`. If unavailable, it falls back to `https://time.nist.gov` HTTP Date headers, then system time.

`time_diagnostics.py` is a standalone diagnostic CLI (no dependencies beyond stdlib):

```bash
python time_diagnostics.py           # single run
python time_diagnostics.py --continuous  # refresh every 5 seconds
```

## Architecture

Everything lives in `index.html` — ~1600 lines of CSS, ~700 lines of JS, all inline. There is no framework, no bundler, no external JS.

### Time Scale Calculations (JS, line ~2025)

All math runs client-side using `Date.now()`. Key functions:

- `lunarDriftUs(d)` — cumulative lunar drift in µs since J2000, using `RATE_M` (56.0199 µs/day mean drift) and an orbital eccentricity correction via `trueAnom(d)` and `PERIGEE` reference epoch (2024-01-13T10:35Z)
- `lunarDate(u)` — adds drift to UTC to get TCL
- `taiDate(u)` — UTC + 37s
- `gpsDate(u)` — UTC + 18s (TAI − 19s)
- `tcbDate(u)` — Barycentric Coordinate Time using `L_B = 1.550519768e-8` rate coefficient

The `SCALES` array (line ~2105) defines the 6 time modes and their display colors.

### Clock Rendering Loop (JS, line ~2280)

`requestAnimationFrame(tick)` drives the main display. `tick()` calls `buildTimeHTML()` for the large DSEG7 display, updates all aux readouts (UTC/TAI/TCL/SYSTEM strip), and calls `updateDeviationDisplay()` for the 48-segment drift bar.

Ghost digits (dim "88:88:88" backdrop) are rendered behind the active digits to simulate a physical 7-segment display.

### Network Time (JS, line ~2315)

`fetchNetworkTime()` runs every 5 seconds via `setInterval`. Priority order:
1. `https://worldtimeapi.org/api/ip` — CORS-enabled, microsecond-precision JSON
2. `https://www.timeapi.io/...` — backup
3. System clock fallback (deviation = 0)

RTT compensation: `correctedMs = serverMs + rtt/2`, where RTT is measured with `performance.now()` for sub-millisecond precision. Irreducible error floor is ±rtt/2. (deviation = 0)

`updateDeviationDisplay()` maps deviation onto the 48-segment bar: segments 0–23 = slow (left), 24–47 = fast (right). Color thresholds: green < 0.25s, amber 0.25–1.0s, red > 1.0s.

### Email Signup

Uses Formspree. The form ID is a placeholder (`YOUR_FORM_ID`) at line ~2680 and must be replaced for the signup to function.

### Fonts

- `DSEG7` / `DSEG14` — 7/14-segment display fonts from jsDelivr CDN (dseg package v0.46)
- `Share Tech Mono` — labels and auxiliary text
- `Space Grotesk` / `Space Mono` — brand strip

## Key Constants

| Constant | Value | Meaning |
|---|---|---|
| `RATE_M` | 56.0199 µs/day | Mean lunar drift rate (Ashby & Patla 2024, arXiv:2402.11150) |
| `RATE_E` | 0.10843417 | Eccentricity correction amplitude |
| `TAI_OFF` | 37 s | TAI − UTC |
| `J2000` | 2000-01-01T12:00Z | Reference epoch |
| `PERIGEE` | 2024-01-13T10:35Z | Reference lunar perigee for eccentricity model |
