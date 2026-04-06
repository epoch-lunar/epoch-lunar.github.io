# Design prototypes (non-production)

Static HTML/CSS/JS spikes under `frontend/prototypes/` — **not** served by the main site (only `frontend/` app assets are deployed).

| Prototype | Intent |
|-----------|--------|
| [index.html](./index.html) | Hub page linking all prototypes |
| [logo-mark1.svg](./logo-mark1.svg) | EPOCH **O** mark: cream + eclipse disk (Inkscape source) |
| [logo-mark1-crescent.svg](./logo-mark1-crescent.svg) | Same mark, **crescent-only** fill (favicon / small glyph) |
| [vfd-column-meter.html](./vfd-column-meter.html) | Segmented bar columns + grid + panel zone (`ecosystem.md` / `brand.md`) |
| [crt-oscilloscope.html](./crt-oscilloscope.html) | P31-style green phosphor CRT face: graticule, glowing trace, persistence + noise sliders |
| [indicator-lights.html](./indicator-lights.html) | 12×8 lamps + **Sync OK** (green); LOCKED / HOLDOVER / FAULT / OFFLINE — click to toggle |
| [dashboard-knobs-buttons.html](./dashboard-knobs-buttons.html) | Car cluster: knobs, rockers, **8-position ivory DIP** (white paddle), push buttons |
| [segments-odometer.html](./segments-odometer.html) | **DSEG7** / **DSEG14** (jsDelivr `dseg@0.46.0` woff2), ghost “8” stack |
| [mfd-a10c-demo.html](./mfd-a10c-demo.html) | **MFD-style**: green phosphor grid, side **OSB** strips, labels on screen (A-10C–inspired) |
| [../color-palette.html](../color-palette.html) | Full design system swatches, fonts, logo treatments |

Open [index.html](./index.html) in a browser or run `python -m http.server` from `frontend/prototypes/` and use `http://localhost:8000/…` (not `file://`). Some editor/embedded browsers and extensions throw harmless `postMessage` / `invalid or illegal string` console errors on `file:` URLs.
