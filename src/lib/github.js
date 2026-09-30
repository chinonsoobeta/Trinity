/**
 * Fills a project card from its GitHub repository at build time, so the card
 * tracks the repo instead of going stale the moment you change the About line.
 *
 * The repo is authoritative when reachable; the values in projects.json are the
 * safety net beneath it. That ordering matters: the unauthenticated API allows
 * 60 requests an hour per IP and build machines share addresses, so a rate
 * limit is a question of when, not if. With the file as fallback a throttled
 * build renders a slightly stale card instead of an empty one.
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

  const topics = tagsFrom(repo);
  return {
    ...entry,
    // `name` is the exception: repo names carry underscores, so the file wins.
    name: entry.name ?? repo.name ?? null,
    description: repo.description ?? entry.description ?? null,
    // An empty homepage string means "not set", which ?? would happily keep.
    live: (repo.homepage || null) ?? entry.live ?? null,
    source: repo.html_url ?? entry.source ?? null,
    tags: topics.length ? topics : (entry.tags ?? []),
    status: (repo.archived ? 'archived' : 'active'),
    updated: repo.pushed_at ?? null,
  };
}

export async function resolveProjects(entries = []) {
  return Promise.all(entries.map(resolveProject));
}
