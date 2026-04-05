# Epochlunar.com — local testing runbook

Short reference for running the static site and the Rust Worker without living in the Node ecosystem day to day.

**Mental model**

| Piece | What it is |
|-------|------------|
| **epoch-worker** | Rust API (`/api/time`, etc.) in `backend/`. Deployed with **GitHub Actions** (`deploy-worker.yml`) using `backend/wrangler.toml`. |
| **epochlunar-com** | Static site in `frontend/`, deployed as **Worker + Assets** from repo-root `wrangler.toml` via **Cloudflare’s Workers git integration** (not GitHub Pages). |
| **Worker URL in the browser** | `frontend/script.js` calls **`https://epoch-worker.philiplinden.workers.dev/api/time`** in production; on **`localhost` / `127.0.0.1`** it uses **`http://localhost:8787/api/time`** (local Wrangler). |

---

## One-time setup

From a terminal:

```bash
# Rust: WASM target for worker-build
rustup target add wasm32-unknown-unknown

# Build helper (installs a small cargo subcommand used by wrangler's build step)
cargo install worker-build

# Node deps for Wrangler (run inside backend — like a Python venv + requirements, but for Node)
cd backend
npm ci
cd ..
```

You need **Node.js** (LTS is fine) so `npm` and `npx` exist. You do **not** need to learn npm deeply: `npm ci` once (uses `package-lock.json`, same as CI), then use `npx wrangler …` as shown below. After changing `package.json`, run `npm install` in `backend/` to refresh the lockfile, then commit it.

---

## Run the API Worker locally

```bash
cd backend
npx wrangler dev
```

- Leave this running; it watches and rebuilds when Rust sources change (via `worker-build` in `wrangler.toml`).
- Default dev URL is **`http://localhost:8787`**; the clock calls **`/api/time`** on that host.

**Rust tests only** (no Wrangler):

```bash
cd backend
cargo test
```

---

## Run the frontend

Browsers can be picky about ES modules from `file://`. Prefer a tiny static server from the **frontend** directory:

```bash
cd frontend

# Option A — Python 3
python -m http.server 8080

# Option B — Node (one-off; no project file needed)
npx --yes serve -l 8080 .
```

Then open **http://localhost:8080** (or the URL the tool prints).

Checklist:

1. `npx wrangler dev` running in `backend/` (Worker on 8787).
2. Page opened from **localhost** so `script.js` uses `http://localhost:8787/api/time`.

You should see the clock tick and the worker panel move toward **LOCKED** without console errors (aside from third-party embeds/fonts if blocked).

---

## Deploy (reminder)

| What | How |
|------|-----|
| **Static site** (`frontend/`) | Cloudflare **Workers** build from git — uses repo-root **`wrangler.toml`** (worker name `epochlunar-com`). |
| **Rust API** (`backend/`) | **GitHub Actions** on `main` when `backend/**` changes: `wrangler deploy` from `backend/`. |

GitHub secret **`CLOUDFLARE_API_TOKEN`** is for the **`deploy-worker.yml`** job only. You can remove **`WORKER_URL`**, **`CLOUDFLARE_ACCOUNT_ID`**, and any **Pages**-related secrets if they were only used by the old frontend workflow.

Manual deploy from your machine (if you ever need it):

```bash
# API Worker
cd backend
npx wrangler deploy

# Static site (same as Cloudflare CI; requires wrangler logged in)
cd ..
npx wrangler deploy
```

You must be logged in (`npx wrangler login`) or use an API token as Wrangler expects.

---

## Quick troubleshooting

| Symptom | Things to check |
|---------|-------------------|
| `worker-build` / wasm errors | `rustup target add wasm32-unknown-unknown`, `cargo install worker-build` |
| Wrangler command not found | Run from `backend/` and use `npx wrangler …` (uses local `node_modules`) |
| Worker panel stuck OFFLINE | Wrangler dev running? Page served from **localhost** (not `file://`)? Production: API Worker deployed and URL in `script.js` matches your `workers.dev` host |
| Blank page or module errors | Serve `frontend/` over **http://localhost**, not `file://` |
| `npm` errors | Run `npm ci` inside `backend/` first (or `npm install` if `package.json` changed and lockfile is stale) |

---

## Paths cheat sheet

| Path | Role |
|------|------|
| `frontend/index.html` | Site entry |
| `frontend/script.js` | Clock + worker sync (ES module); production API URL baked in |
| `wrangler.toml` (repo root) | Static Worker + assets (`epochlunar-com`) |
| `backend/src/lib.rs` | API Worker implementation |
| `backend/wrangler.toml` | API Worker name (`epoch-worker`), build command, deploy settings |
