# Epochlunar.com — local testing runbook

Short reference for running the static site and the Rust Worker without living in the Node ecosystem day to day.

**Mental model**

| Piece | What it is |
|-------|------------|
| **Worker** | Your Rust code compiled to WebAssembly; Cloudflare runs it at the edge. **Wrangler** is the CLI (like `cargo` + deploy) for Workers. |
| **Frontend** | Plain HTML/CSS/JS. **npm** in `backend/` only exists to install the Wrangler CLI locally; you rarely touch JavaScript tooling beyond that. |
| **config.js** | Sets `window.EPOCH_CONFIG.workerUrl` so the clock knows where `/api/time` lives. Gitignored; create it yourself for local dev. |

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
npm install
cd ..
```

You need **Node.js** (LTS is fine) so `npm` and `npx` exist. You do **not** need to learn npm deeply: `npm install` once, then use `npx wrangler …` as shown below.

---

## Local config for the website

The site expects `frontend/config.js` (ignored by git). If it is missing, create it:

**`frontend/config.js`**

```js
window.EPOCH_CONFIG = {
  workerUrl: "http://localhost:8787/api/time",
};
```

That URL is where Wrangler serves the Worker in dev by default.

---

## Run the Worker locally

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
2. `frontend/config.js` points at `http://localhost:8787/api/time`.
3. Static server serving `frontend/` on some port.

You should see the clock tick and the worker panel move toward **LOCKED** without console errors (aside from third-party embeds/fonts if blocked).

---

## Deploy (reminder)

CI on `main` runs:

- **Worker** — when `backend/**` changes: build WASM, `wrangler deploy`.
- **Frontend** — when `frontend/**` changes: writes `config.js` from the `WORKER_URL` secret, then deploys to Cloudflare Pages.

Secrets live in GitHub → **Settings → Secrets and variables → Actions**.

Manual deploy from your machine (if you ever need it):

```bash
cd backend
npx wrangler deploy
```

You must be logged in (`npx wrangler login`) and have a Cloudflare API token or OAuth as Wrangler expects.

---

## Quick troubleshooting

| Symptom | Things to check |
|---------|-------------------|
| `worker-build` / wasm errors | `rustup target add wasm32-unknown-unknown`, `cargo install worker-build` |
| Wrangler command not found | Run from `backend/` and use `npx wrangler …` (uses local `node_modules`) |
| Worker panel stuck OFFLINE | Wrangler dev running? `config.js` URL exactly `http://localhost:8787/api/time`? Mixed content if site is HTTPS but worker URL is HTTP |
| Blank page or module errors | Serve `frontend/` over **http://localhost**, not `file://` |
| `npm` errors | Run `npm install` inside `backend/` first |

---

## Paths cheat sheet

| Path | Role |
|------|------|
| `frontend/index.html` | Site entry |
| `frontend/script.js` | Clock + worker sync (ES module) |
| `frontend/config.js` | Local/runtime worker URL (gitignored) |
| `backend/src/lib.rs` | Worker implementation |
| `backend/wrangler.toml` | Worker name, build command, deploy settings |
