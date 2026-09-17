#!/usr/bin/env node
/**
 * Set the Now Listening card.
 *
 *   npm run song -- "santigold les artistes"
 *   npm run song -- "bonobo kiara" --spotify https://open.spotify.com/track/xxxx
 *
 * Writes the track, artist and album to src/data/now-listening.json. Cover art
 * and the Apple Music link are resolved at build time, so you never edit those
 * by hand. Running this first also shows you which album matched, which is the
 * only thing worth checking before you push.
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

// Only the identifying fields are stored. Cover art, the Apple Music link and
// the release date are resolved at build time by src/lib/music.js, so they can
// never drift out of step with the track named here.
const record = {
  track: hit.trackName,
  artist: hit.artistName,
  album: hit.collectionName,
  spotify,
  artwork: null,
  url: null,
};

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'now-listening.json');
await writeFile(out, `${JSON.stringify(record, null, 2)}\n`);

console.log(`${record.track} — ${record.artist}`);
console.log(`${record.album}${hit.releaseDate ? ` (${hit.releaseDate.slice(0, 10)})` : ''}`);
if (!spotify) console.log('No --spotify link given; the card will use a Spotify search URL.');
console.log('\nWritten to src/data/now-listening.json. Commit and push to publish.');
