/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Field Notes content loader. Each note is a markdown file in
 * content/notes/ with frontmatter between --- fences:
 *
 *   ---
 *   title: The title
 *   date: 2026-07-28
 *   type: post            (post | vlog)
 *   youtube: dQw4w9WgXcQ  (vlogs only — the YouTube video id)
 *   excerpt: One or two sentences shown on the list page.
 *   ---
 *   Body in markdown.
 *
 * Publishing = adding a file and pushing. No database, no admin panel.
 * Dependency-free on purpose: a small frontmatter parser and a markdown
 * renderer covering the constructs Dr. Thompson's writing actually uses
 * (headings, paragraphs, bold, italic, links, lists, blockquotes).
 */
import fs from 'fs'
import path from 'path'

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes')

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: raw.slice(match[0].length) }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s) {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="note-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

/** Minimal markdown → HTML for note bodies. */
export function renderMarkdown(md) {
  const lines = md.split(/\r?\n/)
  const out = []
  let list = null
  let para = []

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(escapeHtml(para.join(' ')))}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map((li) => `<li>${inline(escapeHtml(li))}</li>`).join('')}</ul>`)
      list = null
    }
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) { flushPara(); flushList(); continue }
    const h = /^(#{1,3})\s+(.*)$/.exec(t)
    if (h) {
      flushPara(); flushList()
      const level = Math.min(h[1].length + 1, 4) // # → h2 so page keeps one h1
      out.push(`<h${level}>${inline(escapeHtml(h[2]))}</h${level}>`)
      continue
    }
    if (t.startsWith('> ')) {
      flushPara(); flushList()
      out.push(`<blockquote>${inline(escapeHtml(t.slice(2)))}</blockquote>`)
      continue
    }
    if (/^[-*]\s+/.test(t)) {
      flushPara()
      list = list || []
      list.push(t.replace(/^[-*]\s+/, ''))
      continue
    }
    flushList()
    para.push(t)
  }
  flushPara(); flushList()
  return out.join('\n')
}

export function getNotes() {
  if (!fs.existsSync(NOTES_DIR)) return []
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map((file) => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), 'utf8')
      const { meta, body } = parseFrontmatter(raw)
      return {
        slug: file.replace(/\.md$/, ''),
        title: meta.title || file.replace(/\.md$/, ''),
        date: meta.date || '1970-01-01',
        type: meta.type === 'vlog' ? 'vlog' : 'post',
        youtube: meta.youtube || null,
        excerpt: meta.excerpt || '',
        body,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNote(slug) {
  return getNotes().find((n) => n.slug === slug) || null
}
