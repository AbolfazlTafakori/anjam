# Anjam — Architecture

Anjam is an **offline-first, single-codebase** to-do system: one renderer runs inside Electron (Windows/Linux), inside the browser as a PWA, and inside a Capacitor shell on Android. A **Go backend** (one static binary, SQLite) holds accounts, **workspaces shared between users**, and syncs their databases and items between devices.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  CLIENTS (one UI codebase: src/)                                         │
│                                                                          │
│   Windows (Electron)            Web / PWA (Android, any browser)         │
│   ┌──────────────────┐          ┌──────────────────┐                     │
│   │ src/index.html   │          │ web/index.html   │  ← built by         │
│   │ src/app.js  ─────┼─ same ───┼─ app.js          │    scripts/build-web│
│   │ src/styles.css   │          │ styles.css       │                     │
│   │ src/jalali.js    │          │ jalali.js        │                     │
│   ├──────────────────┤          ├──────────────────┤                     │
│   │ preload.js       │          │ web-bridge.js    │  ← platform bridge  │
│   │ (IPC → main.js)  │          │ (localStorage,   │    window.anjam     │
│   │ file, PDF,       │          │  Blob download,  │                     │
│   │ Notification)    │          │  print, Notif.)  │                     │
│   └────────┬─────────┘          └────────┬─────────┘                     │
│            │  JSON file in %APPDATA%      │  localStorage + service worker│
└────────────┼─────────────────────────────┼───────────────────────────────┘
             │        HTTPS  /api/*         │
             ▼                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  BACKEND  (backend/ — Go, net/http, SQLite via modernc, one binary)      │
│   /api/auth/*        register · login · forgot · reset                   │
│   /api/me            profile · password · delete account                 │
│   /api/workspaces/*  create · rename · delete · members (share by e-mail)│
│   /api/sync          per-workspace last-write-wins (databases, items)    │
│   /api/admin/*       overview · users · invites · settings · audit · backup│
│   /dl/<platform>     installers mirrored from GitHub Releases            │
│   /  web (PWA)   /<ADMIN_PATH> panel   /download                         │
│   data: /var/lib/anjam/anjam.sqlite (WAL) + secret.key + releases/       │
└──────────────────────────────────────────────────────────────────────────┘
```

## 1. Layers

| Layer | Location | Responsibility |
|---|---|---|
| **UI / domain (client)** | `app/app.js` | State, i18n, calendars, quick-add parser, views, detail, palette, reports, exports, **sync engine**, sharing UI. Talks only to `window.anjam`. |
| **Platform bridge** | `desktop/preload.js` · `app/web-bridge.js` | The `window.anjam` contract: persistence, files/PDF, notifications, updates, `openExternal`. |
| **Desktop host** | `desktop/main.js`, `updater.js` | Window, single instance, atomic writes, PDF, Windows notifications, electron-updater. |
| **Backend — domain** | `backend/internal/domain` | Entities (User, Workspace, Member, Database, Item, Change …) and repository interfaces. No I/O. |
| **Backend — application** | `backend/internal/app` | Use cases: registration modes, sessions, password reset, profiles, workspaces & members, sync, admin. Owns security primitives (scrypt, HMAC tokens, limiter/tarpit). |
| **Backend — adapters** | `internal/store/sqlite` (all SQL, embedded migrations) · `internal/httpapi` (routes, middleware) · `internal/mail` · `internal/releases` (mirror) · `internal/system` · `internal/cli` | Replaceable edges. Postgres = a second `store` package; nothing else changes. |
| **Build / deploy** | `scripts/build-web.js`, `deploy/*`, `install.sh`, `.github/workflows` | web bundle, installers, server binaries, one-command install, in-place `anjam update`. |

## 2. Data model (client)

One JSON document per device (`anjam-data.json` / `localStorage['anjam-data']`), version 3:

```
settings    { lang, calendar, notify, railCollapsed }               (per device)
workspaces  [{ id, name, personal, role owner|editor|viewer, ownerId }]   (from the server)
lists       [{ id, workspaceId, name, color, order, updatedAt }]    = server "databases"
tasks       [{ id, listId, title, notes, due, time, reminder, repeat, priority, tags[], subtasks[], done, createdAt, completedAt, order, updatedAt }]  = server "items" (props JSON)
tombstones  { id: { at, kind, workspaceId } }                       deletions waiting to be pushed
sync        { server, token, email, name, cursors { workspaceId: seq }, lastSync }
```
Inbox = tasks with no list; they live in the user's **personal workspace**. A list belongs to exactly one workspace; a shared workspace (owner + editors/viewers) is how a family shares lists.

`normalize()` upgrades any older document on load, so clients never break on old files.

## 3. Sync protocol (last-write-wins, per entity, per workspace)

- Every list/task carries `updatedAt`. On each `save()` the client diffs against a snapshot (`seen`), stamps changed entities, and adds their ids to a `dirty` set; removed ids become tombstones.
- `POST /api/sync { cursors: {wsId: seq}, changes: [{kind: database|item, id, workspaceId, data, updatedAt, deleted}] }`
  - the server applies each change only inside a workspace the user may **write** (owner/editor), keeps it only if `updatedAt` is newer, and assigns a per-workspace monotonic `seq`;
  - it returns every entity with `seq > cursor` for **every workspace the user belongs to**, the new cursors, and the membership list (so a device learns about a newly shared space on its next sync);
  - the client applies returned entities with the same rule and drops data of workspaces it no longer belongs to.
- Triggers: 2 s after any change, every 60 s, on start, on `online`. Offline changes simply wait in `dirty`.
- Trade-off: LWW is field-blind (whole item wins). For a family-sized user base this is the right simplicity; CRDT merging can replace it behind the same endpoint later.

## 4. Auth & security

- Passwords: `scrypt` (N=16384) with a per-user salt; never logged.
- Tokens: HMAC-SHA256 signed `{sub, v, exp}` (90 days). `token_version` on the user invalidates all sessions on password change/reset/disable.
- **Administrator = one user with `role='admin'`**, granted only by the installer / `anjam admin reset <email>` (never by sign-up). The same e-mail/password uses the app normally; the panel issues its own short-lived admin token and sits at a random panel path (`ADMIN_PATH`, e.g. `/panel-a68…`; `/admin` is 404), get 12 h sessions, and face a tarpit (exponential delay per failed attempt) plus rate limits. App users can never reach `/api/admin/*`.
- Registration modes: **open / invite / closed** (panel or `anjam registration …`).
- Password reset: single-use 1 h token; e-mailed if `SMTP_URL` is set, otherwise the admin issues a 24 h link.
- Rate limits: in-process per-IP on auth (30/15 min), plus nginx `limit_req` zones.
- Transport: HTTPS only (Let's Encrypt via certbot); app port bound to `127.0.0.1`.
- Headers: nosniff, no-referrer, DENY framing; CORS `*` on `/api` because the desktop app is `file://` (auth is bearer-token, not cookie, so CORS does not widen the attack surface).
- Audit log for register/login/reset/admin actions with IP.

## 5. Server layout on the host (isolation)

The host runs other projects (their own Node 20, nginx sites, Postgres). Anjam never shares anything with them:

```
/opt/anjam/bin/anjam      the server binary (static, ~12 MB) — also the management CLI
/opt/anjam/web/           web bundle of the same release
/opt/anjam/deploy/        unit, nginx templates, fetch-release.sh
/var/lib/anjam/           anjam.sqlite, secret.key, releases/ (mirrored installers)   — only writable path
/etc/anjam/anjam.env      PORT, BIND=127.0.0.1, PUBLIC_URL, ADMIN_PATH, REGISTRATION, optional SMTP (root, 600)
/etc/systemd/system/anjam.service      user=anjam, ProtectSystem=strict, MemoryMax=256M
/etc/nginx/sites-available/anjam       server_name <domain> only; /dl/ unbuffered
/etc/nginx/conf.d/anjam-zones.conf     limit_req zones prefixed anjam_
```

Install = `bash <(curl -fsSL …/install.sh)` (interactive; `-y` unattended). Update = `anjam update [vX.Y.Z]` (downloads the release binary + web bundle, restarts). No git, Node or Go on the host. Backups: admin panel → *Database backup* (a `VACUUM INTO` copy), or `cp /var/lib/anjam/anjam.sqlite`.

## 6. Repository map

```
app/                renderer shared by desktop, web and Android (+ admin/, download.html, web-bridge.js)
desktop/            Electron host (main.js · preload.js · updater.js)
android/            Capacitor shell (signed APK built in CI)
backend/
  cmd/anjam/        main: `anjam serve` + management subcommands
  internal/domain   entities + repository interfaces
  internal/app      use cases (auth, workspaces, sync, admin) + security
  internal/store/sqlite   SQL + embedded migrations
  internal/httpapi  routes + middleware
  internal/{mail,releases,system,cli,config}
scripts/build-web.js   app/ → web/
deploy/             anjam CLI wrapper, systemd unit, nginx, fetch-release.sh, env example
install.sh          one-command installer
.github/workflows   release.yml (tag → apps + server binaries + web bundle + APK) · server-check.yml
```

## 7. Roadmap hooks

- **Android native**: wrap `web/` with Bubblewrap (TWA) or Capacitor; the bridge contract is the only thing to implement.
- **Scale**: SQLite → Postgres by replacing the `q.*` prepared statements; the HTTP contract stays.
- **Realtime**: a WebSocket/SSE channel that pushes "workspace X has new seq" so clients sync immediately instead of every 60 s.
- **Property schemas**: `Database.schema` already exists; typed properties (select, number, person) can be added without touching sync.
