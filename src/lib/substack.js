import { XMLParser } from 'fast-xml-parser';

const FEED = 'https://chinonsoobeta.substack.com/feed';

function stripHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reads the Substack feed at build time.
 *
 * A feed outage must not fail the whole build — an unrelated deploy should
 * still go out. On failure this returns an empty list and the pages fall back
 * to linking straight to Substack.
 */
export async function getPosts(limit) {
  let xml;
  try {
    const res = await fetch(FEED, { headers: { accept: 'application/rss+xml' } });
    if (!res.ok) throw new Error(`feed returned ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(`[substack] could not read the feed, building without posts: ${err.message}`);
    return [];
  }

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const raw = parser.parse(xml)?.rss?.channel?.item ?? [];
  const items = Array.isArray(raw) ? raw : [raw];

  const posts = items
    .map((item) => {
      const date = new Date(item.pubDate);
      return {
        title: stripHtml(item.title),
        subtitle: stripHtml(item.description),
        url: item.link,
        date: Number.isNaN(date.getTime()) ? null : date,
        image: item.enclosure?.['@_url'] ?? null,
      };
    })
    .filter((post) => post.title && post.url)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
}

export function groupByYear(posts) {
  const years = new Map();
  for (const post of posts) {
    const year = post.date ? post.date.getUTCFullYear() : 'Undated';
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(post);
  }
  return [...years.entries()];
}
