# Finprov local operations

## Services

| Service | URL | Port |
|---|---|---:|
| Django CMS/API | http://127.0.0.1:8000 | 8000 |
| Public website | http://127.0.0.1:3000 | 3000 |
| SEO Admin | http://127.0.0.1:3001 | 3001 |

Prerequisites are Python 3.12, packages from `backend/requirements.txt`, Node.js, and dependencies installed in both Next.js projects. Local environment files must define `NEXT_PUBLIC_CMS_API_URL` for the public site and `DJANGO_API_URL` for SEO Admin. Never commit secrets or `.env.local`.

## Daily development

Run these commands from the repository root in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/dev.ps1 status
powershell -ExecutionPolicy Bypass -File ./scripts/dev.ps1 start
powershell -ExecutionPolicy Bypass -File ./scripts/dev.ps1 restart
powershell -ExecutionPolicy Bypass -File ./scripts/dev.ps1 stop
powershell -ExecutionPolicy Bypass -File ./scripts/health-check.ps1
```

The controller records owned listener PIDs and logs under `.runtime/`. It refuses to terminate an untracked process occupying a project port. Resolve such a collision deliberately after confirming the process belongs to this workspace.

Next.js development output is stored in `.next-dev`; production output is stored in `.next-build`. Therefore `next build` cannot overwrite chunks used by a running development server. Historical `.next-*` archives are not runtime inputs and may be reviewed for deletion separately.

## Validation and production builds

Stop development services before release verification, then run:

```powershell
python backend/manage.py check
python backend/manage.py test
npm --prefix next.js-website-perfect-one- run typecheck
npm --prefix next.js-website-perfect-one- run lint
npm --prefix next.js-website-perfect-one- run build
npm --prefix seo-admin run typecheck
npm --prefix seo-admin run lint
npm --prefix seo-admin run build
```

Production `next start` reads `.next-build`. Development restarts continue using `.next-dev`.

## Backup

Create a matched database and media snapshot:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/backup.ps1
```

Each `backups/current-YYYYMMDD-HHMMSS/` package contains:

- `db.sqlite3`
- the complete `media/` tree
- `manifest.json` with sizes, hashes, course counts and the `courses.ts` hash

Backups never overwrite earlier packages. Copy production backups to durable off-machine storage; the local directory is not disaster recovery by itself.

## Restore and rollback

Validate a backup without changing anything:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/restore.ps1 -Backup ./backups/current-YYYYMMDD-HHMMSS
```

The current restore tool is intentionally dry-run only. An applied restore must be separately approved because it replaces database and media. The production procedure is:

1. Put the site into maintenance mode.
2. Stop all application writers.
3. Create a fresh recovery backup of the current database and media.
4. Validate the selected backup manifest and checksum.
5. Restore database and media together.
6. Run migrations and `manage.py check`.
7. Verify course counts, draft isolation, API/sitemap membership and media URLs.
8. Start services and run the health check.
9. If verification fails, restore the recovery backup using the same procedure.

## Stale runtime diagnosis

- A missing `.next/server/vendor-chunks/*` file means development and build artifacts were mixed or an old server is running.
- A new Django route returning 404 usually means a stale Django process is still loaded.
- Use `./scripts/dev.ps1 status` to identify tracked listeners.
- Stop the verified project process before clearing only `.next-dev`; do not delete source, database, media, or an arbitrary workspace directory.

## Production requirements still to configure

Local defaults are not production-safe. Before deployment, set a secret `DJANGO_SECRET_KEY`, disable debug, configure exact allowed hosts/CORS, use the approved database and media storage, serve static/media through the deployment platform, and run Django behind a production WSGI/ASGI server rather than `runserver`.
