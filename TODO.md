# epochlunar.com — plan log & next steps

## Completed

- [x] **Task 1 — ES module fix** — `frontend/index.html` loads `script.js` with `type="module"`.
- [x] **Task 2 — Worker URL** — Production API URL in `frontend/script.js`; localhost uses `http://localhost:8787/api/time` when the page is served from localhost.
- [x] **Task 3 — Deploy API Worker** — `.github/workflows/deploy-worker.yml` (push to `main`, `backend/**` paths). Uses `npm ci` with committed `backend/package-lock.json`.
- [x] **Frontend hosting** — **Worker + static assets** (`epochlunar-com`), deployed by **Cloudflare Workers** git integration; repo-root **`wrangler.toml`** describes the deploy. Removed redundant **`deploy-frontend.yml`** (Pages action targeted a non-existent Pages project).
- [x] **Runbook** — `RUNBOOK.md` updated for the split: Cloudflare CI = static site, GitHub Actions = Rust API Worker.

## Next steps

### Verify production

- [ ] **Smoke test** `https://epochlunar-com.philiplinden.workers.dev` (or your live host): clock ticks, worker **LOCKED**, offset ms, holdover, sparkline; `https://epoch-worker.philiplinden.workers.dev/api/time` and `/api/health` return JSON.

### GitHub repo hygiene

- [x] **Remove unused Actions secrets** if nothing references them anymore: `WORKER_URL`, `CLOUDFLARE_ACCOUNT_ID` (keep **`CLOUDFLARE_API_TOKEN`** for `deploy-worker.yml`).

## References

- Local dev: `RUNBOOK.md`
- Static Worker config: `wrangler.toml` (repo root)
- API Worker config: `backend/wrangler.toml`
