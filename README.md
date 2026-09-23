# Anjam · انجام

A simple, precise, bilingual (فارسی / English) task app with Jalali and Gregorian calendars — for Windows, Linux, Android and the web, with an optional self-hosted server for accounts, shared workspaces and sync.

- Windows installer, Linux AppImage/deb, universal Android APK, PWA
- Self-hosted Go backend (one static binary, SQLite), admin panel, one-line installer
- Installs downloaded from your own server carry its address, so users never type it
- In-app updates on every platform

## Run in development
```bash
npm install
npm start
```

## Build
```bash
npm run dist          # Windows (dist/Anjam-Setup-<version>.exe)
npm run dist:linux    # AppImage + deb
npm run build:web     # web/ bundle served by the server
```
Releases are built by GitHub Actions: push a tag `vX.Y.Z` and the Windows/Linux installers, the signed Android APK, the server binaries (amd64/arm64) and the web bundle appear under Releases. The apps update themselves from there, and every server mirrors the files at `/dl/<platform>` and lists them on `/download`.

## The app

**Sidebar** — icon row (collapse · inbox with badge · new task) → search (`Ctrl K`) → tabs Home · Calendar · Report → sections: Favorites, Upcoming (next dated tasks), Views (Today · Upcoming · All · Completed), Recents, Shared (per shared workspace), Private (your lists), Tags → Trash, Customize sidebar, Settings, New task → account / workspace menu.

**Home** greets by time of day, shows your lists as link columns and this week's tasks beneath. **Calendar** is a month view of every dated task.

**Lists** are pages: emoji icon, cover (12 gradients), inline description, four views (list · table · board · calendar), sticky toolbar with search / filter / sort / New. From the sidebar (right-click or `…`) or the page menu: Favorite · Copy link · Duplicate · Rename · Move to workspace · Full width · Lock (read-only) · Move to Trash. Drag lists to reorder them. Trashed lists keep their tasks and can be restored for 30 days.

**Tasks** — quick add with smart tokens: `!1 / !2 / !3` (priority), `#tag`, `@list`, `14:30` (time), `today / tomorrow / next week / fri / 2026-10-01 / 1405-07-05` (Persian too: `امروز / فردا / پس‌فردا / هفته بعد / شنبه …`). Side peek with due date picker (Jalali or Gregorian, the other shown as a hint), time + reminder (system notification), repeat (daily / weekdays / weekly / monthly / yearly), priority, list, tags, subtasks with progress, notes. Drag to reorder, between board columns or across calendar days. Undo on delete.

**Settings window** — Account (profile, sync, sign out), Preferences (theme, language, calendar, show completed), Notifications, General (workspaces), People (members and roles), Data & backup (PDF report, CSV, Markdown, JSON backup / restore), Updates, Shortcuts, About.

**Shortcuts**

| Key | Action |
|---|---|
| `Ctrl+K` | search / command palette |
| `Ctrl+N` | new task |
| `Ctrl+\` | collapse sidebar |
| `Ctrl+F` | search |
| `Ctrl+E` | report |
| `Ctrl+Shift+L` | toggle فارسی / English |
| `↑ ↓ Enter Space Del` | move · open · toggle · delete |
| `Esc` | close panel / clear search |

Every view, list and tag has a link (`#/list/<id>`, `#/tag/<name>`, `#/today` …) that opens directly on the web.

Desktop data lives in `%APPDATA%\anjam\anjam-data.json`; the web and Android apps store it in the browser / app storage. Without an account everything stays on the device.

## Server, accounts and sync
The backend (`backend/`, Go, one static binary, SQLite) stores accounts, **workspaces shared between users** (owner / editor / viewer), databases (lists) and items, and syncs them with last-write-wins per workspace. It also serves the web app (`web/`), the admin panel and the download page, and mirrors the installers.

Ubuntu / Debian, one command:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/install.sh)
```

Interactive management console:
```bash
# On server:
anjam

# Or remotely:
bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/anjam.sh)
```
It asks for the domain, the administrator e-mail and password and the registration mode (`-y` takes the defaults with a generated password; every question is also a flag, e.g. `--domain --admin-email --admin-pass --registration`). It downloads the release binary and web bundle into `/opt/anjam` (no runtime or packages on the host), a hardened systemd service bound to `127.0.0.1`, an nginx vhost for that domain only, and a Let's Encrypt certificate. Re-running upgrades in place; `anjam update` fetches the latest release.

The installer is built to coexist with whatever else runs on the host: it never upgrades or restarts packages that are already there (an existing nginx keeps serving its other sites; it is only ever *reloaded*), refuses a port or domain something else already uses, writes only files named `anjam*` (`/etc/nginx/sites-available/anjam`, `/etc/nginx/conf.d/anjam-zones.conf`, `/etc/systemd/system/anjam.service`, `/etc/anjam`, `/opt/anjam`, `/var/lib/anjam`), obtains the certificate with `certbot certonly --webroot` so no other vhost is ever edited, and withdraws its own vhost if `nginx -t` would fail. `anjam uninstall` removes exactly those files with an automatic safety backup in `/root/`.

The installer prints the **administrator e-mail, password and the panel address** once (kept in `/etc/anjam/install-result.env`, root only; `anjam creds` shows them again). The administrator is chosen at install time and is the only account that can open the panel; the same e-mail/password also works as an ordinary app account. Nobody who signs up in the app can reach the panel. The panel lives at a random path (`/panel-…`; `/admin` is a 404) and covers overview, users (disable / delete / reset link), invites, downloads per platform, registration mode (*open / invite only / closed*), backup and the audit log. On the server, running `anjam` opens a full interactive terminal menu (service management, live logs, safe updates, domain/SSL configuration, invite codes, users, backups, TCP BBR optimization, and uninstall). Password-reset e-mails are sent only if `SMTP_URL` is set; otherwise the admin hands out reset links.

Downloads served by a server are stamped with its address: the Windows/Linux installers by file name (`Anjam-Setup-1.6.0.srv-<host>.exe`), the APK inside the APK Signing Block. The apps read it on first run and skip the server field.

API: `POST /api/auth/register|login` → `{token}`; `GET/POST /api/workspaces`, `/api/workspaces/{id}/members`; `POST /api/sync {cursors:{wsId:seq}, changes:[{kind: database|item, id, workspaceId, data, updatedAt, deleted}]}` with `Authorization: Bearer` → `{changes[], cursors, workspaces}`. List records carry `name, color, order, icon, cover, desc, favorite, locked, trashedAt`.

## Layout
```
app/        renderer (index.html, app.js, styles.css, web-bridge.js, admin/, download.html)
desktop/    Electron main, preload, updater
android/    Capacitor shell (universal APK, server stamp reader)
backend/    Go server: cmd/anjam, internal/{config,domain,store/sqlite,app,httpapi,releases,system,mail,cli}
deploy/     systemd unit, nginx vhost, management CLI, release fetcher
install.sh  one-line installer
anjam.sh    terminal management launcher
scripts/    build-web.js
docs/       ARCHITECTURE.md
```
