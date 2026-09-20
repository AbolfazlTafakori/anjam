---
name: Anjam
description: A Notion-style workspace with one ruby accent — quiet warm neutrals, hairline rules, and cherry-red for the single action that matters.
colors:
  bg: "#ffffff"
  bg-side: "#f7f5f4"
  text: "#1e1a1b"
  text-2: "rgba(30,26,27,0.62)"
  text-3: "rgba(30,26,27,0.52)"
  line: "rgba(30,26,27,0.10)"
  hover: "rgba(30,26,27,0.055)"
  ruby: "#9e1b34"
  ruby-hover: "#861529"
  ruby-soft: "rgba(158,27,52,0.10)"
  danger: "#b3132f"
  ok: "#1b7a45"
  dark-bg: "#191415"
  dark-bg-side: "#211b1d"
  dark-text: "#efe8e6"
  dark-ruby: "#e24a64"
typography:
  page-title:
    fontFamily: "Vazirmatn, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  task-title:
    fontFamily: "Vazirmatn, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "Vazirmatn, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Vazirmatn, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  phone-body:
    fontFamily: "Vazirmatn, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ruby}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "0 12px"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "0 12px"
  nav-item:
    textColor: "{colors.text-2}"
    rounded: "{rounded.md}"
    height: "30px"
    padding: "0 8px"
  nav-item-active:
    backgroundColor: "rgba(30,26,27,0.09)"
    textColor: "{colors.text}"
  row:
    height: "36px"
    padding: "0 6px"
    rounded: "{rounded.md}"
  row-selected:
    backgroundColor: "{colors.ruby-soft}"
  chip:
    height: "20px"
    padding: "0 7px"
    rounded: "{rounded.sm}"
  checkbox:
    size: "16px"
    rounded: "4px"
    backgroundColor: "{colors.ruby}"
  peek:
    width: "560px"
    backgroundColor: "{colors.bg}"
  dialog:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.xl}"
    width: "460px"
---

# Anjam design system

## Overview

Anjam is a **Notion-style workspace** for tasks: a quiet sidebar, a breadcrumb topbar, a page with an icon and a large title, and a database beneath it with four views (list · table · board · calendar) and a side-peek task page. The chrome is warm neutral in four tints; **ruby** (`#9e1b34`, cherry-red) is the one accent, used for the primary action, selection, checked ticks, "today", the FAB and the active phone tab. Light and dark are both first-class (system / light / dark, persisted). Persian RTL is the default; every layout rule is logical (`inset-inline`, `margin-inline`) and mirrors for English.

## Colors

- **Surfaces**: `bg` for pages, peek and menus; `bg-side` for the sidebar and the auth screen backdrop; `hover` / `active` as translucent washes so they work on any surface.
- **Text**: `text` primary, `text-2` secondary (nav, subtitles), `text-3` metadata and placeholders (≥ 4.5:1 on white), `text-4` disabled only. Warm-tinted, never neutral gray.
- **Ruby**: primary button, checked checkbox, switch-on, selected date, today's calendar dot, the FAB, selection wash (`ruby-soft`) and the focus ring (`ruby-ring`). Hover → `ruby-hover`. Dark mode lifts it to `#e24a64` for contrast on `#191415`.
- **Property chips**: six tinted pairs (red/amber/blue/green/gray/purple). Priority uses red (high), amber (medium), blue (low); tags use purple; done-count uses green text.
- **Semantic**: `danger` for overdue and destructive; `ok` for a complete subtask count and "synced".

## Typography

One family, **Vazirmatn** (variable, self-hosted), Persian and Latin alike. Fixed pixel scale: 40 page title / 30 task title / 16 empty-state / 15 phone body / 14 body & rows / 13 toolbar buttons / 12 metadata & chips / 11 kbd hints, tab labels and menu group labels. Weights 800 titles, 700 dialog titles, 600 labels, buttons, active nav; 500 chips, nav; 400 body. Numbers are tabular and rendered through `Intl` in the UI language. Line-height 1.5 body, 1.7 notes, 1.2 titles.

## Layout

- **Desktop** (> 760px): sidebar 240px (collapsible, Ctrl+\) · main with a 44px topbar · page column max 960px with 96px side padding (64 ≤ 1280, 40 ≤ 1100, 24 ≤ 900); table/board/calendar widen the page to 1280px.
- **Side peek**: 560px fixed panel from the end edge; above 1100px it pushes the page (`margin-inline-end`), below it floats over a scrim. Expand button makes it full-width.
- **Phone** (≤ 760px): sidebar becomes a drawer; a 58px bottom tab bar (Today · Upcoming · Search · Inbox · More) plus a 56px ruby FAB; the peek becomes a full-screen sheet; rows grow to 52px with metadata stacked under the title; all controls ≥ 40px tall; safe-area insets respected.
- **Database bar** is sticky under the title: view tabs on the start side, search / filter / sort / split "New" button on the end side.

## Elevation

Three shadows: `shadow-sm` (buttons, cards, 1px ring + 2px drop), `shadow-md` (menus, date picker, popovers), `shadow-lg` (dialogs, peek, drawer). Dark mode uses deeper blacks and a faint light ring instead of a border. No colored glows; the FAB's drop shadow is black at 22%.

## Shapes

4px chips, checkboxes and small controls · 6px buttons, rows, nav items, inputs · 8px cards, menus, toasts · 12px dialogs, page icon · 16px FAB and the auth card · pill for the switch and quick-date chips.

## Components

- **Sidebar** (Notion's form): icon row (collapse · inbox with badge · compose) → search field with `Ctrl K` → tab strip Home · Calendar · Report (label only on the active tab) → sections Upcoming (next three dated tasks) · Views · Recents · Shared · Private · Tags → Settings and the primary "New task" → account/workspace footer (mark + name + chevrons) opening the account menu. Hover reveals "+" on sections and "…" on lists.
- **Topbar**: breadcrumb (workspace › list / view), sync pill (spinning while syncing, amber when offline, red on error), Share (only inside a workspace), command palette, "…" menu (exports, language, calendar, settings).
- **Page head**: 56px tinted icon, 40px title (34 ≤ 1100, 30 ≤ 900, 28 on phones), one-line subtitle (date · counts). Home greets by time of day and lists the lists as link columns above this week's tasks.
- **Views**: list (grouped rows, inline "+ New" per group, drag to reorder), table (properties as columns, each cell a popover editor), board (columns by priority, drag between columns), calendar (month grid, drag to reschedule, click a day to add).
- **Row**: checkbox · title · hover "Open" pill · property chips · hover delete. Context menu on right-click.
- **Inline capture**: a highlighted row with the quick-add parser (date words, `!1-3`, `#tag`, `@list`, `HH:MM`) and live token pills.
- **Peek**: close / expand / delete bar → 24px checkbox + 30px editable title → property rows (Due, Time + reminder switch, Repeat, Priority segmented, List, Tags, Created) → subtasks with a progress bar → notes.
- **Settings window**: Notion's form — 1150×720 dialog, 240px nav on the start side (search, groups Account · Workspace · App), one pane at a time with a 24px title, subtitle, section rules and label/description rows with the control on the end side; on phones the nav becomes a horizontal strip.
- **Page chrome (lists)**: optional cover strip (12 gradient presets, hover → Change/Remove), emoji icon (picker: Emoji tab · filter · Remove), hover row above the title (Add icon · Add cover · Add description), inline editable description; star (favorites) and copy-link in the topbar; "…" menu adds Full width, Lock, Move to Trash.
- **Sidebar extras**: Favorites section on top; right-click / "…" on a list → Favorite · Copy link · Duplicate · Rename · Move to · Move to Trash; drag to reorder; bottom: Trash popover (search · restore · delete forever · 30-day note) and Customize sidebar (toggle sections).
- **Menus**: 8px radius, 30px items, group titles, active dot; date picker with quick chips + month grid (Jalali starts Saturday, Fridays red; Gregorian starts Sunday).
- **Skeleton**: shown during boot only; four shimmering rows.
- **Toast**: bottom center, dark, with Undo.

## Motion

100ms hover · 160ms menus (scale .98→1) and checkbox fill · 220ms peek (24px slide) and dialog (8px rise) · 200ms row leaving. Easing `cubic-bezier(.2,.8,.2,1)`. `prefers-reduced-motion` collapses everything to a 1ms fade.

## Do's and Don'ts

- Do keep ruby for one action per screen and for selection. Don't use it for borders or body text.
- Do separate rows with hairline `line` rules on phone and hover washes on desktop. Don't wrap rows in cards.
- Do keep the fixed px scale and ≥ 15px text on phones. Don't add fluid `clamp()` type.
- Do write layout with logical properties. Don't hard-code left/right.
- Do draw icons in the sprite's 24-grid, 1.7px stroke. Don't mix icon sets or use emoji.
