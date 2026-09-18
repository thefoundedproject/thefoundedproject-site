/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Substack essays for Field Notes. Substack is the canonical home for published
 * essays (Publishing spec), so these entries link out to it rather than copying
 * the text here: two full copies of one essay split search ranking between two
 * URLs and leave readers unsure which is the real one.
 *
 * Pulled from the public RSS feed, so no API key and no browser. New posts show
 * up within the revalidate window without a redeploy.
 *
 * Failure-tolerant on purpose. If Substack is slow or down, this returns [] and
 * Field Notes renders its local notes as before; one outside service never takes
 * the page down with it.
 *
 * Deliberately NOT fed into /feed.xml: that feed is meant for Substack and other
 * readers to consume, and feeding Substack's own posts back to it would loop.
 */

const FEED = 'https://thefoundedproject.substack.com/feed'
export const SUBSTACK_REVALIDATE = 3600 // seconds; also exported for the page
const TIMEOUT_MS = 5000

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}

function tag(block, name) {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(block)
  return m ? decode(m[1]).trim() : ''
}

function plain(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function getSubstackPosts() {
  try {
    const res = await fetch(FEED, {
      next: { revalidate: SUBSTACK_REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []

    return items
      .map((block) => {
        const href = tag(block, 'link')
        const published = new Date(tag(block, 'pubDate'))
        if (!href || Number.isNaN(published.getTime())) return null
        const postSlug = href.replace(/\/+$/, '').split('/').pop()
        return {
          slug: `substack-${postSlug}`,
          title: tag(block, 'title'),
          date: published.toISOString().slice(0, 10),
          type: 'post',
          youtube: null,
          excerpt: plain(tag(block, 'description')),
          href,
          source: 'substack',
        }
      })
      .filter((n) => n && n.title)
  } catch {
    return []
  }
}
