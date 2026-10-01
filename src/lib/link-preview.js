/**
 * Pulls the name and lead image out of a product URL at build time, so the
 * Currently Wearing tile is fed by pasting a link rather than transcribing
 * details by hand.
 *
 * Reads Open Graph tags, which virtually every shop emits (Shopify, WooCommerce
 * and friends do by default). A site that blocks bots or renders only in the
 * browser will not resolve — the build warns and the item is skipped rather
 * than failing.
 */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function metaTag(html, property) {
  // Attribute order varies between platforms, so try both arrangements.
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`, 'i'),
  ];
  for (const re of patterns) {
    const found = html.match(re);
    if (found?.[1]) return decodeEntities(found[1]);
  }
  return null;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/gi, "'")
    .trim();
}

// Shop images are often 2000px and well over a megabyte, for a tile about 310px
// wide. Shopify's CDN resizes on request; 700px stays sharp on a 2x screen.
// Anything that isn't a Shopify CDN URL is left as it is.
function sized(src) {
  try {
    const u = new URL(src);
    if (!u.pathname.includes('/cdn/shop/')) return src;
    u.searchParams.set('width', '700');
    return u.toString();
  } catch {
    return src;
  }
}

export async function previewLink(url) {
  let html;
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': UA,
        accept: 'text/html',
        // Shopify stores split their catalogue by market, and a product listed
        // only for Canada 404s for anyone else — including a build machine in
        // a US data centre. This cookie is how Shopify picks the market; other
        // shops ignore it.
        cookie: 'localization=CA',
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    html = await res.text();
  } catch (err) {
    console.warn(`[wearing] could not read ${url}: ${err.message}`);
    return null;
  }

  const name = metaTag(html, 'og:title') ?? metaTag(html, 'twitter:title');
  // og:image is often plain http even on an https shop; serving that from an
  // https page gets it blocked as mixed content, so prefer the secure variant.
  const rawImage = metaTag(html, 'og:image:secure_url')
    ?? metaTag(html, 'og:image')
    ?? metaTag(html, 'twitter:image');
  const image = rawImage ? sized(rawImage.replace(/^http:\/\//, 'https://')) : null;

  if (!name && !image) {
    console.warn(`[wearing] no Open Graph tags found at ${url}`);
    return null;
  }

  return {
    url,
    name,
    image,
    shop: metaTag(html, 'og:site_name'),
  };
}

// An item is either a link to read, or — for shops that block automated
// requests, like Levi's — an object filled in by hand: { url, name, image }.
export async function previewLinks(items = []) {
  const results = await Promise.all(items.map((item) => (
    typeof item === 'string'
      ? previewLink(item)
      : { url: item.url ?? null, name: item.name ?? null, image: item.image ?? null }
  )));
  return results.filter(Boolean);
}
