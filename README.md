# Trinity

Personal site for Chinonso Obeta. Built, not yet deployed.

## State

| | |
|---|---|
| Direction | Console — dark, modular, a rail of live modules |
| Pages | Home, Writing index, Projects, Now/About |
| Viewports | Desktop (1280) and mobile (390) for each |
| Built | Astro 7, static output, deploys to Vercel |

Design canvas: https://claude.ai/artifact/12qDFbG1Qurwx7iWwDydWF

```
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

Vercel auto-detects Astro; no adapter or config needed. Set a deploy hook and
call it from a Substack webhook (or a cron) so a new post rebuilds the site.

## Identity

- **Name:** Chinonso Obeta
- **Role:** Senior Policy Analyst, British Columbia Environmental Assessment Office
- **Location:** Vancouver, British Columbia
- **Footer disclaimer:** "Views my own." — on every page, beside the copyright

## `design/`

The original mockups, kept for reference. These are Design Component files
(`.dc.html`) — HTML wrapped in an `<x-dc>` element, so they don't render
standalone in a browser.

**`src/` is now the source of truth, not `design/`.** The artboards have
drifted: they still show the Online status dot, which was cut from the build.

## Writing — pulled from Substack

Posts live on Substack. The site lists them and links out; nothing is hosted
here, and there is no on-site post page.

- **Feed:** `https://chinonsoobeta.substack.com/feed`
- **Publication:** https://chinonsoobeta.substack.com
- **Pull per item:** `title`, `description` (the subtitle), `pubDate`, and the
  `<enclosure>` image. Sort newest first.
- All 14 current posts carry an image enclosure. `PostRow` still falls back to
  a placeholder for a post without one.
- A feed outage does not fail the build: `src/lib/substack.js` warns, returns
  an empty list, and the pages fall back to linking straight to Substack.
- Home shows the 4 most recent; the Writing index shows all, grouped by year.

## Now Listening — manual

Edit `src/data/now-listening.json` and redeploy. Apple Music has no simple
public now-playing endpoint the way Spotify does; the usual workaround is
scrobbling to Last.fm and reading its API, which is real infrastructure for a
widget. Manual costs nothing and can't silently go stale-and-wrong.

Leave `artwork` or `url` as `null` and the card degrades — placeholder art, no
link — rather than breaking.

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
| ok | `#5fbf7a` | active project status |

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

Two things are live, both client-side, both with a resting state that survives
failure (verified — they render `—` when the network is unavailable):

- **Local time** — `Intl.DateTimeFormat` in `America/Vancouver`, not the
  visitor's timezone. Ticks every 30s.
- **Weather** — Open-Meteo `/v1/forecast`. No API key, no account.

The Online status dot from the original design was cut: nothing reports whether
you're at your desk, so it would have been a hardcoded lie.

## Where the content lives

| File | Holds |
|---|---|
| `src/data/site.json` | name, role, bio, coords, timezone, footer links |
| `src/data/now.json` | Now copy, reading, About, At a glance, What I use |
| `src/data/projects.json` | every project card |
| `src/data/now-listening.json` | the Now Listening card |

Posts are not in a file — they come from the feed at build time.

## Outstanding

- Instagram handle — add to `site.json` links and it slots in
- `projects.json` — every entry is still a placeholder
- `now.json` — Now copy, About, What I use, the "Open to" row
- An avatar image for the hero (currently a drawn placeholder)
- `site` in `astro.config.mjs` — needs the real domain before launch
- Feed titles carry literal markdown asterisks (`*how*`); decide whether to
  render them as emphasis or leave them
- A real email alias to replace the Gmail address
