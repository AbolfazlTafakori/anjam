---
name: Anjam
description: A lacquered pen box — deep red-black lacquer shell, matte interior, hairline gold
colors:
  lacquer-0: "#0f0507"
  lacquer-1: "#160a0d"
  lacquer-2: "#1e0e12"
  lacquer-3: "#27141a"
  interior-0: "#1c1013"
  interior-1: "#241518"
  interior-2: "#2d1b1f"
  interior-3: "#382227"
  gold: "#e2b45a"
  gold-rule: "rgba(226, 180, 90, 0.20)"
  gold-rule-strong: "rgba(226, 180, 90, 0.45)"
  gold-wash: "rgba(226, 180, 90, 0.10)"
  crimson: "#c1121f"
  crimson-hover: "#dc1f2e"
  ink: "#f6eee6"
  ink-2: "#d4c1b8"
  ink-3: "#a08a82"
  ink-4: "#6f5c58"
  ok: "#58c58f"
  danger: "#ff5c63"
  priority-low: "#7ea4d6"
typography:
  title:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  panel-title:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.4
  row:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Vazirmatn, Segoe UI, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "34px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.crimson-hover}"
  button-ghost:
    backgroundColor: "{colors.interior-1}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    height: "34px"
    padding: "0 14px"
  nav-item:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 10px"
  nav-item-active:
    backgroundColor: "{colors.gold-wash}"
    textColor: "{colors.ink}"
  row:
    textColor: "{colors.ink}"
    padding: "10px 8px 10px 4px"
  row-selected:
    backgroundColor: "{colors.gold-wash}"
  field:
    backgroundColor: "{colors.interior-0}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "34px"
    padding: "0 10px"
  chip:
    backgroundColor: "{colors.interior-1}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "26px"
    padding: "0 11px"
  dialog:
    backgroundColor: "{colors.lacquer-1}"
    rounded: "{rounded.lg}"
    padding: "18px 22px 24px"
    width: "420px"
---

# Anjam design system

## Overview

Anjam is a **qalamdan** — a Persian lacquered pen box. The shell (rail, dialogs, detail panel, palette) is deep red-black lacquer; the interior (the task sheet) is a slightly lighter matte surface where the work happens. Gold is used only as hairline rules, the current selection, "today", and focus. Crimson appears exactly twice: the one primary action and P3 priority. Everything else is ivory ink in four tints. The app is an Operate surface: familiarity first, brand in the details. It is fully mirrored for RTL (Persian default) and LTR (English) and every date can render in Jalali or Gregorian independently of language.

## Colors

- **Lacquer** (`lacquer-0…3`): chrome only — rail gradient (2 → 1 → 0 top-to-bottom), dialogs, detail panel, popovers. Never for content rows.
- **Interior** (`interior-0…3`): the work surface and its controls. `interior-0` is also the field background inside lacquer panels so inputs read as recessed.
- **Gold**: `gold-rule` (20%) is the universal hairline: row separators, section rules, borders. `gold-rule-strong` (45%) for dialog and popover borders. `gold-wash` (10%) is the only selection fill. Solid `gold` is text/icon color for active nav, today, focus ring, switch-on. Never a gold surface larger than a switch.
- **Crimson**: the primary button, P3 flag, the brand seal, and the capture "+" mark only while focused. Hover → `crimson-hover`. Checked ticks, selected dates, chart bars and meters are gold/ink, never crimson.
- **Ink**: `ink` primary text, `ink-2` secondary and labels on hover, `ink-3` metadata/placeholders/icons at rest, `ink-4` disabled and hairline-level text. All four are warm-tinted; never neutral gray.
- **Semantic**: `danger` for overdue and destructive hover only; `ok` for a fully completed subtask count; `priority-low` blue for P1. P2 is `ink-2`.
- Contrast: `ink-3` on `interior-0` ≈ 5.1:1; `ink-4` is reserved for non-essential text.

## Typography

One family, **Vazirmatn** (variable, self-hosted), for Persian and Latin alike; no display face. Fixed pixel scale, never fluid: 24 title / 18 panel title / 16 empty-state / 14.5 row / 14 body / 13 buttons & meters / 12.5 sub / 11.5 meta & labels / 11 counts. Weights: 800 titles, 700 panel titles, 600 labels/buttons/active nav, 400 everything else. Section labels are 11.5px, 600, +0.04em, uppercase in Latin (uppercase has no effect on Persian, which is intended). Numbers use `tabular-nums`; they are rendered through `Intl` in the UI language (Persian digits in Persian). Do not enable Vazirmatn `ss01` (it forces Persian digits in Latin text).

## Layout

Three columns: **rail** (248px, collapsible to 62px icon rail; state persisted) · **interior** (fluid, content capped at 1040px and centered) · **detail** (372px). Gutters: 28px desktop, 20px ≤1000px, 16px ≤760px. Breakpoints are structural, not typographic:

- ≤1180px: the detail panel floats over the interior with a scrim instead of squeezing it.
- ≤760px (phone / Android target): the rail becomes a drawer opened by ☰ or the "Lists" tab; a 58px **bottom tab bar** (Today · Upcoming · All · Lists · More) replaces the rail; search goes full-width; detail becomes a full-height sheet.
- ≤540px tall: header and rail paddings tighten.

The interior stacks: header (title + subtitle, search, ⌘) → one **capture line** (a ruled line, not a box) → grouped rows separated by hairline rules. Rows are not cards.

## Elevation & Depth

Depth is material, not shadow: lacquer is darker than interior, so panels read as the box's walls. Only floating things cast shadows: `--shadow-lg` (0 18px 44px -12px black 70% + 0 2px 6px 35%) for dialogs, palette, date picker, floating detail; `--shadow-md` for the toast. The primary button carries a 1px inner highlight and a soft crimson drop. The rail has a faint gold radial sheen at the top (7%). No glass, no glow halos.

## Shapes

Radii: 6px fields/small buttons/rows, 10px buttons/nav/segmented, 14px dialogs and popovers, pill for chips and switches. Ticks are circles (20px list, 26px detail, 16px subtask). List color dots are 9px rounded squares (3px); tag dots are 7px circles. The active nav indicator is a 2px gold bar at the rail's start edge, not a filled block.

## Components

- **Rail**: brand seal (crimson gradient square with gold ring) + name; views; Lists (with + and hover "…" editor); Tags; footer Report / Settings. Collapsed: icons only, section rules replace headings.
- **Capture line**: circular crimson "+" outline that fills on focus; underline turns gold on focus; the Add button appears only when focused or non-empty; live token pills beneath (date, time, priority in crimson, list, #tags).
- **Row**: grip (hover) · tick · title + meta line (calendar/clock/repeat/subtask progress/list dot/tags/notes glyph) · priority flag (P1 blue, P2 gold, P3 crimson) · delete (hover). States: hover wash, selected (gold wash + start bar), focus (inset gold ring), done (50% opacity, strikethrough), leaving (slides toward reading end and fades, 220ms), dragging, drop-before/after (gold edge).
- **Group header**: 12px 600 label + count; overdue in danger, today in gold.
- **Detail**: bar (close · list badge · delete) → big tick + title textarea → notes → subtasks (checklist with progress) → two-column grid: due (full) with alt-calendar line and quick chips, time + reminder switch, repeat select, priority segmented (full), list select, tags → created/completed meta.
- **Segmented control** (`.seg`): recessed track, raised active segment; priority segments tint their active color.
- **Switch**: 34×20 track, gold when on, knob travels 14px (mirrored in RTL).
- **Command palette** (Ctrl K): 560px lacquer sheet at 12vh; groups Tasks / Views / Lists / Actions; arrow keys + Enter.
- **Date picker**: 284px popover; Jalali starts Saturday with Fridays in danger, Gregorian starts Sunday; today gold, selected crimson.
- **Dialogs**: settings (language, calendar, notifications, shortcuts), list editor (name + 10 swatches).
- **Toast**: bottom center, with Undo (gold) for deletes.
- **Report**: a ruled ledger row of four figures, a 7-day bar chart (today's bar gold), three meter columns (list/priority/tag), export buttons.
- **Icons**: authored inline SVG sprite, 24-unit grid, 1.6px stroke, round caps; 18px default, 16px in buttons, 13px in meta. Chevrons flip with direction.

## Do's and Don'ts

- Do keep gold to hairlines, selection wash, and small marks. Don't paint surfaces gold.
- Do use crimson for one action per screen. Don't use it for emphasis text or borders.
- Do separate rows with `gold-rule` hairlines. Don't wrap rows in cards or add colored side borders.
- Do draw new icons in the sprite's grammar. Don't use emoji or mixed icon sets.
- Do keep type on the fixed scale. Don't introduce a display face or fluid `clamp()` type.
- Do mirror with logical properties (`inset-inline-*`, `margin-inline-*`). Don't hardcode left/right.
- Do isolate mixed-direction text (`unicode-bidi: isolate`, start alignment). Don't use `plaintext` on list titles — it left-aligns Latin rows in a Persian UI.
- Do animate state only (tick fill, row leaving, panel entrance, 140–220ms, exponential ease-out). Don't add page-load choreography or hover theatrics.
- Do tint muted text from ink. Don't use neutral gray.
