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

export async function previewLink(url) {
  let html;
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
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
  const image = rawImage ? rawImage.replace(/^http:\/\//, 'https://') : null;

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

export async function previewLinks(urls = []) {
  const results = await Promise.all(urls.map(previewLink));
  return results.filter(Boolean);
}
