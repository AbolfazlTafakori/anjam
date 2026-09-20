# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (Electron desktop for Windows today; an Android build is planned, so the layout language must translate to a phone: sidebar → bottom tabs, panels → sheets).

## Stack

Electron + vanilla HTML/CSS/JS, no bundler. Vazirmatn variable font self-hosted. Data in a local JSON file.

## Product

**Anjam (انجام)** — a personal to-do list for Windows that is complete without being busy. One owner, one machine, offline, no account.

## Users and job

A single Persian-speaking user (also fluent in English) who wants to capture tasks in seconds, see what matters today, and review what got done. Usage scene: a laptop/desktop at a desk, often in the evening (dark room), Windows display scaled 150%. Sessions are short and frequent: open, add/tick, close.

## Mechanism / position

- Quick capture with inline tokens (`!3`, `#tag`, `فردا`, `1405/07/05`) parsed live.
- Truly bilingual: full RTL/LTR switch, Persian/English UI, Jalali or Gregorian calendar chosen independently of language.
- Reports and exports (PDF/CSV/Markdown/JSON) built in.
- Positioned against heavyweight workspace tools: lists and shared spaces without a database builder; against bare checklists: has lists, subtasks, recurrence, reminders.

## Capabilities (confirmed)

Views: Today, Upcoming, All, Completed, per-list, per-tag, search. Task: title, notes, due date, priority (0–3), tags, done/undone, created/completed timestamps. Undo delete, autosave, settings (language, calendar), report with stats and 7-day chart, exports, backup/restore.

Planned in this redesign (user asked for "everything necessary, complete, not cluttered"): lists/projects, subtasks with progress, recurring tasks, reminders with Windows notifications, command palette (Ctrl+K), keyboard navigation, drag reorder.

## Constraints and brand commitments

- Theme pinned by the user: **deep/dark red** (iPhone "Deep Red" reference) with a second color at Claude's discretion (warm gold chosen and accepted).
- Quality bar named by the user: "as if working for Apple" — precise, calm, no gimmicks.
- Emoji are acceptable to the user but a drawn icon system is preferred for Android parity.
- Persian typing must never break font or direction; mixed-language content is normal.
- Simple: no feature may add a mandatory step to capturing a task.

## Terminology

fa: کار (task), لیست (list), برچسب (tag), سررسید (due), اولویت (priority), زیرکار (subtask), یادآور (reminder), تکرار (repeat), گزارش (report). en: Task, List, Tag, Due, Priority, Subtask, Reminder, Repeat, Report.

## Open decisions

None blocking. (Android build is future work; not in this repo.)
