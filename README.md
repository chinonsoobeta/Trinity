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

```
npm run song -- "santigold les artistes"
npm run song -- "bonobo kiara" --spotify https://open.spotify.com/track/xxxx
```

That looks the track up and writes `src/data/now-listening.json` — title,
artist, album, release date, 600px cover art and the Apple Music link. Commit
and push; Vercel rebuilds.

**The Spotify link is the one thing that can't be looked up.** Odesli's public
API is deprecated (401) and Spotify's own API needs registered credentials.
Without `--spotify` the card falls back to a Spotify *search* URL built from the
artist and track — it works, but lands on results rather than the song. Paste
the real share link when you care.

You can also edit the JSON by hand. Apple Music has no simple public now-playing endpoint the way Spotify
does; the usual workaround is scrobbling to Last.fm and reading its API, which
is real infrastructure for a widget. Manual costs nothing and can't silently go
stale-and-wrong.

Leave `artwork` or `url` as `null` and the card degrades — placeholder art, one
button instead of two — rather than breaking.

`scripts/song.mjs` uses the public iTunes Search API: no key, no account.

## Currently Wearing — manual

`src/data/wearing.json`: an optional `photo` and a list of `{k, v}` rows. Same
shape as Current Machinery, plus the photo.

Photos go in `public/wearing/` and are referenced as `/wearing/name.jpg`. Keep
them under ~300KB — they live in git, so every version is kept forever. If this
becomes something you change weekly, move the images to a host and store URLs
instead.

With `photo: null` the tile is just the item list.

## Links and contact

Same three on every page and both viewports: **email**, **github**, **substack**.
Instagram is deferred — add it to `links` in `site.json` and it slots in.

"email" is not a `mailto:`. It opens a modal contact form (native `<dialog>`,
so the backdrop, Esc and focus handling are the browser's). The address is never
put on the page, which also means it can't be scraped off it.

**The form needs a backend before it can send.** A static site cannot deliver
email. Set `contact.endpoint` in `site.json` to a form endpoint that accepts a
`POST` of `FormData` and returns 2xx — Formspree, Formspark and Web3Forms all
do, all have free tiers:

```json
"contact": { "endpoint": "https://formspree.io/f/xxxxxxxx" }
```

With `endpoint` left `null` the dialog shows the address instead of a form, so
the site never presents a control that silently does nothing. A hidden
`_gotcha` honeypot field is included for spam.

The form asks for Name, **Email** and Message. The email field is not optional
padding — without it a message arrives with no way to reply.

## Design system

**Colour**

Contrast is measured, not eyeballed. `--bg` is a mid-tone purple at 11.6%
relative luminance, which is bright enough that it cannot carry a quiet
secondary tone — anything dimmer than `--body` fails AA on it. So `--muted` and
`--dim` are **panel-only**, and everything that sits directly on the background
uses `--text`, `--body` or `--accent`.

| Token | Value | On bg | On panel | Use |
|---|---|---|---|---|
| bg | `#6F5296` | — | — | page background |
| panel | `#42305C` | 1.8:1 | — | cards |
| panel-alt | `#4E3A6B` | 1.6:1 | — | image wells, inputs |
| border | `#634E85` | — | 1.6:1 | card and section borders |
| border-soft | `#5C4680` | — | 1.5:1 | list row dividers |
| text | `#FBF9FE` | 6.0:1 | 11.1:1 | headings, primary |
| body | `#E7E0F3` | 4.9:1 | 9.0:1 | running text, anything on bg |
| muted | `#CFC4E0` | 3.8:1 ✗ | 7.0:1 | panel only — labels, secondary |
| dim | `#AC9EC2` | 2.5:1 ✗ | 4.7:1 | panel only — metadata |
| accent | `#FFD59B` | 4.6:1 | 8.4:1 | links, active nav |
| cool | `#8FE0E8` | 4.2:1 | 7.7:1 | weather icon |
| ok | `#8FE3AB` | 4.1:1 | 7.6:1 | active project status |

**Changing `--bg` means re-running those numbers.** Every other value is tuned
against it. SVG icons use `stroke="currentColor"` and inherit from their
container, so no colour is hardcoded outside `:root`.

**Type**

- Display and body: Space Grotesk (400/500/700)
- Metadata, labels, nav: JetBrains Mono (400/500)
- Section labels: mono 11px, `letter-spacing: 0.12em`, uppercase, muted
- Page titles: 40px desktop / 32px mobile, weight 700, `letter-spacing: -0.02em`
- Running text: 17px / 1.75
- Post dates are sans, 15px, `--body` — deliberately the same as body text
  rather than mono metadata. Format is `September 16, 2026`, rendered in UTC so
  it doesn't shift with the build machine.

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
| `src/data/now.json` | Now copy, reading, About, At a glance, Current Machinery |
| `src/data/projects.json` | every project card |
| `src/data/wearing.json` | the Currently Wearing tile |
| `src/data/now-listening.json` | the Now Listening card |

Posts are not in a file — they come from the feed at build time.

## Outstanding

- **A form backend** — `contact.endpoint` in `site.json`. Until it is set, the
  contact dialog shows your address instead of a form
- **Confirm the purple.** `--bg: #6F5296` is my read of the swatch you sent,
  not a sampled value. If it's off, that one hex is the only thing to change
  (then re-check the contrast table above)
- Instagram handle — add to `site.json` links and it slots in
- `projects.json` — every entry is still a placeholder
- `wearing.json` — placeholder rows, no photo yet
- `now.json` — Now copy, About, the "Open to" row
- An avatar image for the hero (currently a drawn placeholder)
- `site` in `astro.config.mjs` — needs the real domain before launch
- Feed titles carry literal markdown asterisks (`*how*`); decide whether to
  render them as emphasis or leave them
- A real email alias to replace the Gmail address
