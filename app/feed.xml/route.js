/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 * RSS 2.0 feed for Field Notes. Substack, feed readers, and future
 * newsletter tools can all consume this directly.
 */
import { getNotes } from '../../lib/notes'

const SITE = 'https://thefoundedproject.com'

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const dynamic = 'force-static'

export function GET() {
  const notes = getNotes()
  const items = notes
    .map((n) => {
      const url = `${SITE}/notes/${n.slug}`
      const desc = n.type === 'vlog'
        ? `${n.excerpt} Watch: https://www.youtube.com/watch?v=${n.youtube}`
        : n.excerpt
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(n.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Field Notes — The Founded Project</title>
    <link>${SITE}/notes</link>
    <description>Essays and video from Dr. Stephen Thompson on personal governance, agency, and building The Founded Project in the open.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
