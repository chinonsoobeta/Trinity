/**
 * Fills a project card from its GitHub repository at build time, so the card
 * tracks the repo instead of going stale the moment you change the About line.
 *
 * projects.json wins; the repo fills whatever the file leaves null, and always
 * supplies `updated`.
 *
 * This ordering was the other way round briefly. Reading the real metadata
 * settled it: the repo's `homepage` still points at a leftover placeholder, and
 * its About line is not the wording the project's own site uses. Curated prose
 * and canonical links belong in the file where they can be checked; the repo is
 * authoritative for what it maintains automatically — topics, language,
 * archived state, last push.
 *
 * File-first is also the safe ordering. The unauthenticated API allows 60
 * requests an hour per IP and build machines share addresses, so a rate limit
 * is a question of when; with real values in the file a throttled build renders
 * a complete card rather than an empty one.
 */
const API = 'https://api.github.com/repos';

function tagsFrom(repo) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  // Language first, then topics, capped so the chip row stays one or two lines.
  return [repo.language, ...topics].filter(Boolean).slice(0, 4);
}

export async function resolveProject(entry) {
  if (!entry?.repo) return entry;

  let repo;
  try {
    const res = await fetch(`${API}/${entry.repo}`, {
      headers: { accept: 'application/vnd.github+json', 'user-agent': 'trinity-site' },
    });
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
    repo = await res.json();
  } catch (err) {
    console.warn(`[github] ${entry.repo}: ${err.message} — using projects.json as-is`);
    return entry;
  }

  return {
    ...entry,
    name: entry.name ?? repo.name ?? null,
    description: entry.description ?? repo.description ?? null,
    // An empty homepage string means "not set", which ?? would happily keep.
    live: entry.live ?? (repo.homepage || null),
    source: entry.source ?? repo.html_url ?? null,
    tags: entry.tags?.length ? entry.tags : tagsFrom(repo),
    status: entry.status ?? (repo.archived ? 'archived' : 'active'),
    // Always the repo's: freshness is the one thing the file cannot know.
    updated: repo.pushed_at ?? null,
  };
}

export async function resolveProjects(entries = []) {
  return Promise.all(entries.map(resolveProject));
}
