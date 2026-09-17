#!/usr/bin/env node
/**
 * Set the Now Listening card.
 *
 *   npm run song -- "santigold les artistes"
 *   npm run song -- "bonobo kiara" --spotify https://open.spotify.com/track/xxxx
 *
 * Looks the track up on the public iTunes Search API (no key, no account) and
 * writes src/data/now-listening.json. Commit and push; Vercel does the rest.
 *
 * The Spotify link is optional. Without one the card falls back to a Spotify
 * search URL built from the artist and track, which works but lands on results
 * rather than the song — paste the real share link when you care.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const spotifyFlag = args.indexOf('--spotify');
const spotify = spotifyFlag === -1 ? null : args[spotifyFlag + 1] ?? null;
const term = (spotifyFlag === -1 ? args : args.slice(0, spotifyFlag)).join(' ').trim();

if (!term) {
  console.error('usage: npm run song -- "artist track" [--spotify <url>]');
  process.exit(1);
}

const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
const res = await fetch(url);
if (!res.ok) {
  console.error(`iTunes search failed: ${res.status}`);
  process.exit(1);
}

const [hit] = (await res.json()).results ?? [];
if (!hit) {
  console.error(`No match for "${term}". Try adding the artist, or fewer words.`);
  process.exit(1);
}

const record = {
  track: hit.trackName,
  artist: hit.artistName,
  album: hit.collectionName,
  released: hit.releaseDate ? hit.releaseDate.slice(0, 10) : null,
  artwork: hit.artworkUrl100 ? hit.artworkUrl100.replace('100x100bb', '600x600bb') : null,
  url: hit.trackViewUrl ? hit.trackViewUrl.split('&uo=')[0] : null,
  spotify,
};

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'now-listening.json');
await writeFile(out, `${JSON.stringify(record, null, 2)}\n`);

console.log(`${record.track} — ${record.artist}`);
console.log(`${record.album}${record.released ? ` (${record.released})` : ''}`);
if (!spotify) console.log('No --spotify link given; the card will use a Spotify search URL.');
console.log('\nWritten to src/data/now-listening.json. Commit and push to publish.');
