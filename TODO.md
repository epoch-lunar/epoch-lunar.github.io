# epochlunar.com — plan log & next steps

## Completed

- [x] **Task 1 — ES module fix** — `frontend/index.html` loads `script.js` with `type="module"`.
- [x] **Task 2 — Worker URL** — `frontend/config.js` pattern (gitignored), `index.html` loads it before `script.js`, `script.js` uses `window.EPOCH_CONFIG.workerUrl` with localhost fallback.
- [x] **Task 3 — Deploy Worker workflow** — `.github/workflows/deploy-worker.yml` (push to `main`, `backend/**` paths). Uses `npm install` (no committed `package-lock.json` in `backend/`).
- [x] **Task 4 — Deploy Frontend workflow** — `.github/workflows/deploy-frontend.yml` writes `config.js` from `WORKER_URL` secret, deploys via `cloudflare/pages-action@v1` to project `epochlunar-com`.
- [x] **Runbook** — `RUNBOOK.md` for local Wrangler/frontend testing (Rust/Python-friendly).

## Next steps

### One-time (Cloudflare + GitHub)

- [ ] **Cloudflare Pages** — Create/connect project `epochlunar-com` (Workers & Pages → Connect to Git): build command blank, output dir `frontend`, root blank. See original workplan Task 5.
- [ ] **GitHub Actions secrets** (repo → Settings → Secrets → Actions):
  - [ ] `CLOUDFLARE_API_TOKEN` — Workers + Pages permissions (e.g. “Edit Cloudflare Workers” template extended for Pages if needed).
  - [ ] `CLOUDFLARE_ACCOUNT_ID` — Dashboard sidebar.
  - [ ] `WORKER_URL` — Deployed Worker time endpoint, e.g. `https://epoch-worker.<subdomain>.workers.dev/api/time` (set after first successful worker deploy).

### After first deploys on `main`

- [ ] Confirm both workflows run on push (path filters: `backend/**` vs `frontend/**`).
- [ ] **Smoke test** production (from workplan Task 6): clock ticks, worker LOCKED, offset ms, holdover buttons, sparkline, JSON from `/api/time` and `/api/health`.

### Optional cleanup

- [ ] **Lockfile for CI** — Commit `backend/package-lock.json` and switch worker workflow to `npm ci` (remove `package-lock.json` from `backend/.gitignore` if you want reproducible installs).

## References

- Local dev commands: `RUNBOOK.md`
- Frontend entry: `frontend/index.html`
