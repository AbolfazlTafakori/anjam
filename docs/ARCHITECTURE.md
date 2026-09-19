# Anjam — Architecture

Anjam is an **offline-first, single-codebase** to-do system: one renderer runs inside Electron (Windows), inside the browser as a PWA (Android/phone/desktop web), and later inside a native Android shell. A small Node service holds accounts and syncs items between devices.

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
│  SERVER  (server/server.js — Node 22, express, built-in SQLite)          │
│   /api/auth/*   register · login · forgot · reset                        │
│   /api/me       profile · password · delete account                      │
│   /api/sync     last-write-wins item sync (tasks, lists, settings)       │
│   /api/admin/*  overview · users · invites · settings · audit · backup   │
│   /            serves web/ (PWA)        /admin  serves web/admin.html    │
│   data: /var/lib/anjam/anjam.sqlite (WAL) + secret.key                   │
└──────────────────────────────────────────────────────────────────────────┘
```

## 1. Layers

| Layer | Location | Responsibility |
|---|---|---|
| **UI / domain** | `src/app.js` | State, i18n (fa/en), Jalali/Gregorian dates, quick-add parser, views, detail panel, command palette, reports, exports, **sync engine**. Knows nothing about Electron or the browser: it only talks to `window.anjam`. |
| **Platform bridge** | `src/preload.js` (Electron) · `src/web-bridge.js` (browser) | Implements the `window.anjam` contract: `load/save` (persistence), `exportFile/exportPdf/importFile`, `notify`, `openExternal`, `defaultServer`. Swapping the bridge is how a native Android shell (Capacitor/TWA) plugs in. |
| **Desktop host** | `src/main.js` | Window, single-instance lock, atomic file writes with `.bak`, PDF rendering, Windows notifications. |
| **Server** | `server/server.js` | Accounts, tokens, invites, password reset, admin API, sync, static hosting of the PWA. |
| **Build / deploy** | `scripts/build-web.js`, `deploy/*` | Produces `web/` from `src/`; installs the service on a shared Ubuntu host without touching other apps. |

## 2. Data model (client)

One JSON document per device (`anjam-data.json` / `localStorage['anjam-data']`), version 3:

```
settings   { lang, calendar, notify, railCollapsed, settingsUpdatedAt }
lists[]    { id, name, color, order, updatedAt }
tasks[]    { id, title, notes, listId, due 'YYYY-MM-DD', time 'HH:MM', reminder, notifiedAt,
             repeat none|daily|weekdays|weekly|monthly|yearly, priority 0-3, tags[], subtasks[{id,title,done}],
             done, createdAt, completedAt, order, updatedAt }
tombstones { id: deletedAtMs }        ← deletions waiting to be pushed
sync       { server, token, email, name, role, cursor, lastSync }
```

`normalize()` upgrades any older document on load, so clients never break on old files.

## 3. Sync protocol (last-write-wins, per item)

- Every task/list carries `updatedAt`. On each `save()` the client diffs against a snapshot (`seen`), stamps changed items with `Date.now()`, and adds their ids to a `dirty` set; removed ids become tombstones.
- `POST /api/sync { since: cursor, changes: [{id, type, data, updatedAt, deleted}] }`
  - server keeps an item only if `updatedAt` is newer than its copy, assigns a monotonic `server_seq`, and returns every item with `server_seq > since` plus the new `cursor`.
  - client applies returned items with the same rule (newer wins; tombstone removes if not newer locally).
- Triggers: 2 s after any change, every 60 s, on start, on `online`. Offline changes simply wait in `dirty`.
- Settings (`lang`, `calendar`, `notify`) sync as one item `settings`; `railCollapsed` is per device.
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
/opt/anjam/node/          private Node 22 runtime (host /usr/bin/node untouched)
/opt/anjam/app/           git checkout of this repo
/var/lib/anjam/           anjam.sqlite, secret.key      (only path the service may write)
/etc/anjam/anjam.env      PORT, BIND=127.0.0.1, PUBLIC_URL, optional SMTP   (root, 600)
/etc/systemd/system/anjam.service      user=anjam, ProtectSystem=strict, MemoryMax=512M
/etc/nginx/sites-available/anjam       server_name anjam.abolfazltafakori.com only
/etc/nginx/conf.d/anjam-zones.conf     limit_req zones prefixed anjam_
```

Install = `bash <(curl -fsSL …/install.sh)` (interactive; `-y` unattended). Deploy = `bash deploy/push.sh` (git push → `server-deploy.sh`: pull, `npm ci`, build web, restart). Backups: admin panel → *Database backup* (a `VACUUM INTO` copy), or `cp /var/lib/anjam/anjam.sqlite`.

## 6. Repository map

```
src/            shared UI + Electron main/preload + web bridge + admin page
server/         API (single file by design; split into routes/ when it grows)
scripts/        build-web.js
deploy/         install/deploy scripts, systemd, nginx, env example
build/          app icon
docs/           this file
DESIGN.md       visual system (Qalamdan)      PRODUCT.md  product truth
```

## 7. Roadmap hooks

- **Android native**: wrap `web/` with Bubblewrap (TWA) or Capacitor; the bridge contract is the only thing to implement.
- **Scale**: SQLite → Postgres by replacing the `q.*` prepared statements; the HTTP contract stays.
- **Sharing lists** between users: add `list.members[]` + per-list ACL in `/api/sync`; the client model already keys everything by `listId`.
