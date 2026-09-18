/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Substack essays for Field Notes, linked out rather than copied.
 *
 * Since 2026-09-18 essays publish on this site first and Substack sends them
 * the next morning (Publishing spec §3), so new essays reach Field Notes as
 * local notes and the page drops their Substack twin. What this module still
 * surfaces is the essays that went to Substack before that change. Substack
 * published those first, so it holds the original, and a copy here would only
 * compete with it in search. They link out.
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
