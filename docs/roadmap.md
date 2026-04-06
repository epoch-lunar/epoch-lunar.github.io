# EPOCH web stack — roadmap & phases

**Purpose:** Turn `docs/ecosystem.md` into sequenced work with clear handoffs. **Current reality:** this repo is the live site — Worker + static assets (`wrangler.toml`), Rust API Worker (`backend/`), vanilla JS clock. **Target:** **phaser** (math kernel) + **dash** (Rust/VFD visualization, WASM) + thin **epochlunar.com** shell.

**Related docs:** [ecosystem.md](./ecosystem.md) (architecture intent), [brand.md](./brand.md) + [color-palette.html](./color-palette.html) (tokens), [prototypes/README.md](./prototypes/README.md) (spikes).

---

## Where we are now (baseline)

| Layer | What runs today |
|-------|-----------------|
| Static site | `frontend/` → Worker **`epochlunar-com`** (+ staging env) |
| API | `backend/` → **`epoch-worker`**; math in `lib.rs`, duplicated scale logic in `frontend/time-scales.js` |
| CI | GitHub Actions (API + staging), Cloudflare git (prod static Worker) |
| Docs | `docs/architecture.md` still describes “Cloudflare Pages” — **should be refreshed** to match Worker + assets |

---

## North-star structure (from ecosystem.md)

```
phaser   → Rust lib: time + lunar drift; native + WASM consumer
dash     → egui (then maybe Bevy) app; depends on phaser; trunk → WASM
epochlunar.com → HTML chrome + `<canvas>`/WASM embed; Worker thin wrapper over phaser
```

**Rule:** No long-term duplication of time-scale math between JS and Rust. JS dashboard code is **interim** until dash ships.

---

## Phase A — Align docs & contracts (short)

**Goal:** One honest picture of production + a stable JSON contract for the next phases.

- [ ] Rewrite `docs/architecture.md`: Worker + assets vs Pages, staging/prod, two Workers, link to this roadmap.
- [ ] Document **`/api/time` JSON schema** in `docs/` (version field optional) so dash/phaser can target it before the Worker is thin.
- [ ] Decide **Worker URL** strategy for WASM (ecosystem open question): recommend **`window.location` origin** + path `/api/time` when dash is same-site; keep absolute fallback for `workers.dev`.

**Exit:** New contributors can read one architecture doc and know where code lives.

---

## Phase B — **phaser** kernel (new crate; can start inside this repo)

**Goal:** Library that owns scale math + lunar drift; Worker calls it; no HTTP inside phaser.

**Suggested bootstrap (avoids repo sprawl on day one):**

- Add `crates/phaser/` in this monorepo with `hifitime`, small API surface (`lunar_drift_us`, TAI/TCB/… as needed).
- `backend/Cargo.toml`: `phaser = { path = "../crates/phaser" }` (later `git` or crates.io).

**Exit:** `cargo test -p phaser` green; `epoch-worker` still serves same JSON but delegates math to phaser (behavior parity with tests).

---

## Phase C — **dash** prototype (separate repo *or* `crates/dash/`)

**Goal:** Prove VFD readability and performance (egui + `trunk` WASM) before replacing the main clock UI.

- Standalone app: fake clock + one **segmented column meter** + one **7-seg** readout (ecosystem visual spec).
- **`trunk build --release`** artifact; manual drop into `frontend/dash/` or CI copy — answer ecosystem “committed vs CI” question with one chosen path.

**Exit:** You can open a page with WASM dash + brand-correct panels; no need for full Worker integration yet.

---

## Phase D — Integration on epochlunar.com

**Goal:** Landing chrome (logo, links, Substack) stays HTML; **instrument cluster** is dash.

- `index.html`: canvas (or div) + `trunk` output scripts; lazy-load WASM.
- dash: fetch API (same-origin or configured base URL); holdover / LOCKED semantics ported from current `script.js` into Rust state machine.
- **Delete** `frontend/time-scales.js` and slim `script.js` (or remove) when parity is verified.

**Exit:** Production site matches functional behavior of today with a single Rust math path.

---

## Phase E — Repo splits & publishing (when friction hurts)

- Move `phaser` to `github.com/epoch-lunar/phaser`, version tags.
- dash remains its own repo; epochlunar.com depends on git SHAs until API stable.
- Optional **phaser-py** / PyO3 — parallel track, not blocking the web.

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| WASM bundle size (egui ~2–3 MB) | Lazy load; measure; defer Bevy until egui fails visually |
| Same-origin API | Put **api** on `epochlunar.com/api/*` route or `api.epochlunar.com` before launch |
| Staging vs prod URLs | dash reads base URL from `data-` attribute or `import.meta` injection at deploy |
| Big-bang rewrite | Strict phases B → C → D; keep current site shippable until D is feature-complete |

---

## Suggested “next sprint” (concrete)

1. **Phase A:** Patch `architecture.md` + add `docs/api-time.md` (JSON schema).
2. **Phase B spike:** Empty `crates/phaser` with one tested function moved from `backend` (e.g. lunar drift only).
3. **Phase C design:** Open `docs/prototypes/vfd-column-meter.html` in a browser — tune segment geometry against brand before writing egui layout code.

---

*This is a living doc; adjust phases as phaser/dash repos land.*
