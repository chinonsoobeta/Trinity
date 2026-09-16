# Trinity

Personal site for Chinonso Obeta. Design is settled; the site itself is not
built yet.

## State

| | |
|---|---|
| Direction | Console — dark, modular, a rail of live modules |
| Pages | Home, Writing index, Projects, Now/About |
| Viewports | Desktop (1280) and mobile (390) for each |
| Built | Nothing yet |

Design canvas: https://claude.ai/artifact/12qDFbG1Qurwx7iWwDydWF

## Identity

- **Name:** Chinonso Obeta
- **Role:** Senior Policy Analyst, British Columbia Environmental Assessment Office
- **Location:** Vancouver, British Columbia
- **Footer disclaimer:** "Views my own." — on every page, beside the copyright

## `design/`

Source for the canvas artboards. These are Design Component files (`.dc.html`)
— HTML wrapped in an `<x-dc>` element, so they don't render standalone in a
browser. Read them as markup references when building the real pages.

`canvas.json` lays them out across two pages: the chosen Console direction,
and the two that weren't picked (Quiet Index, Broadsheet), kept for reference.

## Writing — pulled from Substack

Posts live on Substack. The site lists them and links out; nothing is hosted
here, and there is no on-site post page.

- **Feed:** `https://chinonsoobeta.substack.com/feed`
- **Publication:** https://chinonsoobeta.substack.com
- **Pull per item:** `title`, `description` (the subtitle), `pubDate`, and the
  `<enclosure>` image. Sort newest first.
- All 6 current posts carry an image enclosure, so the thumbnail column can
  assume one exists — but still design a fallback for a post without one.
- Home shows the 4 most recent; the Writing index shows all, grouped by year.

## Now Listening — manual

Updated by hand, not scraped. Apple Music has no simple public now-playing
endpoint the way Spotify does, so this reads from a data file in the repo:
track, artist, album, year, artwork, and a link out.

Options if automating it later becomes worth it are noted in the canvas build
notes; none of them are free.

## Links

Same three on every page and both viewports, in this order.

| Label | Target | Status |
|---|---|---|
| email | `mailto:chinonso8@gmail.com` | temporary, to be replaced |
| github | https://github.com/chinonsoobeta | final |
| substack | https://chinonsoobeta.substack.com | final |

Instagram is deferred — add the handle and it slots in.

Email is a plain `mailto:`. It will be scraped once the site is public; that's
the accepted tradeoff for one-click contact, and the reason to swap in an alias
before launch.

## Design system

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
| dim | `#56564c` | dates, metadata, ↗ markers |
| accent | `#cf9450` | links, active nav |
| cool | `#4fa8b0` | weather icon |
| ok | `#5fbf7a` | online status |

**Type**

- Display and body: Space Grotesk (400/500/700)
- Metadata, labels, nav: JetBrains Mono (400/500)
- Section labels: mono 11px, `letter-spacing: 0.12em`, uppercase, muted
- Page titles: 40px desktop / 32px mobile, weight 700, `letter-spacing: -0.02em`
- Running text: 17px / 1.75

**Layout**

- Desktop page padding `40px 48px 56px`; mobile `24px 20px 32px`
- 12-column grid, 20px gutter; main content spans 8, live rail spans 4
- Cards: 12px radius, 24px padding desktop / 18px mobile
- Tap targets on mobile are 44px minimum
- Active nav is amber: no underline on desktop, 2px underline on mobile

## Live data

Three things are still genuinely live: online status, local time, and weather
(Vancouver). Each needs a source and a designed resting state for when it's
down or still loading. Values in the design are samples.

## Outstanding

- Instagram handle
- Projects — names, descriptions, stacks, links; all still placeholder
- "Now" copy, "What I use" entries, "Open to" row
- Verbatim post subtitles (the design shows one real subtitle and placeholders
  for the rest; the build pulls all of them from the feed)
- Static site generator vs. hand-rolled HTML
- Hosting
- Weather and status endpoints
