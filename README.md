# Anjam · انجام

A simple, precise, bilingual (فارسی / English) to-do list for Windows.

## Run in development
```bash
npm install
npm start
```

## Build the Windows installer
```bash
npm run dist
```
The installer is written to `dist/Anjam Setup 1.0.0.exe`.

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
The `server/` folder is a small Node service (built-in SQLite, one dependency) that stores accounts and syncs items with last-write-wins. It also serves the web app (`web/`, built with `npm run web`), which installs on Android as a PWA ("Add to Home screen") and works offline.

Ubuntu / Debian:
```bash
sudo bash deploy/install.sh anjam.example.com
```
That installs Node 22, a systemd service (`anjam`, port 8787, data in `/var/lib/anjam`), nginx and a Let's Encrypt certificate. Or use Docker: `docker compose -f deploy/docker-compose.yml up -d`.

Then in the Windows app: Settings → Account → server address → Sign up. The **first account becomes admin**; open `https://your-domain/admin` to manage users, switch registration to *invite only* or *closed*, create invite codes, make password-reset links, disable/delete users, download a database backup, and read the audit log. Password-reset e-mails are sent only if `SMTP_URL` is set; otherwise the admin hands out reset links.

API (for a native Android client): `POST /api/auth/register|login` → `{token}`; `POST /api/sync {since, changes[]}` with `Authorization: Bearer` → `{changes[], cursor}`. Items are `{id, type: task|list|settings, data, updatedAt, deleted}`.
