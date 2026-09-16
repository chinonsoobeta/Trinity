# Trinity

Personal site. Design is settled; the site itself is not built yet.

## State

| | |
|---|---|
| Direction | Console — dark, modular, a rail of live widgets |
| Pages designed | Home, Writing index, Post, Projects, Now/About |
| Viewports | Desktop (1280) and mobile (390) for each |
| Built | Nothing yet |

Design canvas: https://claude.ai/artifact/12qDFbG1Qurwx7iWwDydWF

## `design/`

Source for the canvas artboards. These are Design Component files (`.dc.html`)
— HTML wrapped in an `<x-dc>` element, so they don't render standalone in a
browser. Read them as markup references when building the real pages.

`canvas.json` lays them out on the canvas and splits them across two pages:
the chosen Console direction, and the two directions that weren't picked
(Quiet Index, Broadsheet), kept for reference.

## Design system

Lifted from the artboards so it survives independently of them.

**Colour**

| Token | Value | Use |
|---|---|---|
| bg | `#0f0f0d` | page background |
| panel | `#181815` | cards |
| panel-alt | `#21211c` | image wells, nested blocks |
| border | `#2a2a25` | card and section borders |
| border-soft | `#1d1d19` | list row dividers |
| text | `#e9e6dd` | headings, primary |
| body | `#cfcbc1` | running text |
| muted | `#8b877c` | secondary, labels |
| dim | `#56564c` | dates, metadata |
| accent | `#cf9450` | links, active nav, progress |
| cool | `#4fa8b0` | weather icon, code keywords |
| ok | `#5fbf7a` | online / active status |

**Type**

- Display and body: Space Grotesk (400/500/700)
- Metadata, labels, nav, code: JetBrains Mono (400/500)
- Section labels: mono 11px, `letter-spacing: 0.12em`, uppercase, muted
- Page titles: 40px desktop / 32px mobile, weight 700, `letter-spacing: -0.02em`
- Running text: 17px / 1.75 desktop and mobile both

**Layout**

- Desktop page padding `40px 48px 56px`; mobile `24px 20px 32px`
- 12-column grid, 20px gutter; main content spans 8, live rail spans 4
- Cards: 12px radius, 24px padding desktop / 18px mobile
- The post page caps its column at 680px. Nothing else does.
- Tap targets on mobile are 44px minimum

## Live data

Four things on the Home page are not static: online status, local time,
weather, and now playing. Each needs a source, and each needs a resting state
for when it's down or still loading. The values in the design are samples.

## Not decided yet

- Static site generator vs. hand-rolled HTML
- Hosting
- Where the live-data endpoints come from
- All real content — every string in the design is a bracketed placeholder
