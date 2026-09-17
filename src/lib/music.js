/**
 * Resolves the Now Listening card from the track and artist named in
 * src/data/now-listening.json.
 *
 * Cover art, the Apple Music link, the album and the release date are looked
 * up at build time on the public iTunes Search API, so hand-editing the data
 * file means changing the track and artist and nothing else. Getting those out
 * of step with the artwork is exactly the failure this exists to prevent.
 *
 * Anything set explicitly in the file wins over the lookup, and if the lookup
 * fails the file's own values are used as-is. Either way the build does not
 * fail over a music card.
 */
const ENDPOINT = 'https://itunes.apple.com/search';

export async function resolveListening(entry) {
  if (!entry?.track || !entry?.artist) return entry ?? null;

  const query = new URLSearchParams({
    term: `${entry.artist} ${entry.track}`,
    entity: 'song',
    limit: '10',
  });

  let results = [];
  try {
    const res = await fetch(`${ENDPOINT}?${query}`);
    if (!res.ok) throw new Error(`iTunes returned ${res.status}`);
    results = (await res.json()).results ?? [];
  } catch (err) {
    console.warn(`[music] lookup failed, using the data file as-is: ${err.message}`);
    return entry;
  }

  // A track often appears on both a single and an album. When the file names an
  // album, honour it; otherwise take the first hit.
  const wanted = entry.album?.toLowerCase();
  const hit = (wanted && results.find((r) => r.collectionName?.toLowerCase() === wanted))
    ?? results[0];

  if (!hit) {
    console.warn(`[music] no match for "${entry.artist} — ${entry.track}", using the data file as-is`);
    return entry;
  }

  return {
    ...entry,
    track: hit.trackName ?? entry.track,
    artist: hit.artistName ?? entry.artist,
    album: hit.collectionName ?? entry.album ?? null,
    released: hit.releaseDate?.slice(0, 10) ?? entry.released ?? null,
    artwork: entry.artwork ?? hit.artworkUrl100?.replace('100x100bb', '600x600bb') ?? null,
    url: entry.url ?? hit.trackViewUrl?.split('&uo=')[0] ?? null,
  };
}
