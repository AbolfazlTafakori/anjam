# Anjam · انجام

A simple, precise, bilingual (فارسی / English) to-do list for Windows.

## Run in development
```bash
npm install
npm start
```

## Build the desktop installers
```bash
npm run dist          # Windows (dist/Anjam-Setup-<version>.exe)
npm run dist:linux    # AppImage + deb
```
Releases are built by GitHub Actions: push a tag `vX.Y.Z` and the installers appear under Releases; the apps update themselves from there (electron-updater) and every server's `/download` page lists them.

## Features
- Quick add with smart tokens: `!1 / !2 / !3` (priority), `#tag`, `@list`, `14:30` (time), `today / tomorrow / next week / fri / 2026-10-01 / 1405-07-05`
  (Persian too: `امروز / فردا / پس‌فردا / هفته بعد / شنبه …`)
- Views: Inbox, Today, Upcoming, All, Completed, per-list, per-tag, search
- Lists with colors, subtasks with progress, repeat (daily/weekdays/weekly/monthly/yearly), time + reminder (Windows notification)
- Command palette (Ctrl+K), keyboard navigation (↑ ↓ Enter Space Del), drag to reorder within a group
- Collapsible sidebar; bottom tab bar on narrow windows (phone/Android-ready layout)
- Detail panel: notes, due date picker, priority, tags
- Settings: language (فارسی / English) and calendar (Jalali / Gregorian) — independent of each other; the other calendar is always shown as a hint under the date
- Quick add accepts Jalali dates too: `1405/07/05` or `۱۴۰۵/۰۷/۰۵`
- Reports: totals, completion rate, overdue, last-7-days chart, by priority, by tag
- Export: PDF report, CSV (Excel-safe UTF-8), Markdown, JSON backup + restore
- Undo delete, autosave, offline, no account

## Shortcuts
| Key | Action |
|---|---|
| `Ctrl+K` | command palette |
| `Ctrl+N` | focus quick add |
| `Ctrl+\` | collapse sidebar |
| `Ctrl+F` | search |
| `Ctrl+E` | report / export |
| `Ctrl+Shift+L` | toggle فارسی / English |
| `Esc` | close panel / clear search |

Data is stored at `%APPDATA%\anjam\anjam-data.json`.

## Server, accounts and sync (Windows ↔ web/Android)
The backend (`backend/`, Go, one static binary, SQLite) stores accounts, **workspaces shared between users** (owner / editor / viewer), databases (lists) and items, and syncs them with last-write-wins per workspace. It also serves the web app (`web/`), the admin panel and the download page, and mirrors the installers.

Ubuntu / Debian, one command:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/install.sh)
```
It asks for the domain, the administrator e-mail and password and the registration mode (`-y` takes the defaults with a generated password; every question is also a flag, e.g. `--domain --admin-email --admin-pass --registration`). It downloads the release binary and web bundle into `/opt/anjam` (no runtime or packages on the host), a hardened systemd service bound to `127.0.0.1`, an nginx vhost for that domain only, and a Let's Encrypt certificate. Re-running upgrades in place; `anjam update` fetches the latest release.

The installer prints the **administrator e-mail, password and the panel address** once (kept in `/etc/anjam/install-result.env`, root only). The administrator is chosen at install time and is the only account that can open the panel; the same e-mail/password also works as an ordinary app account. Nobody who signs up in the app can reach the panel. The panel lives at a random path (`/panel-…`) and lets you switch registration between *open / invite only / closed*, create invite codes, make password-reset links, disable/delete users, download a database backup and read the audit log. On the server, `anjam` opens a management menu (`anjam admin reset`, `anjam registration invite`, `anjam invite create`, `anjam backup`, `anjam update`, `anjam log` …). Password-reset e-mails are sent only if `SMTP_URL` is set; otherwise the admin hands out reset links.

API: `POST /api/auth/register|login` → `{token}`; `GET/POST /api/workspaces`, `/api/workspaces/{id}/members`; `POST /api/sync {cursors:{wsId:seq}, changes:[{kind: database|item, id, workspaceId, data, updatedAt, deleted}]}` with `Authorization: Bearer` → `{changes[], cursors, workspaces}`.
