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
 *   substack: https://thefoundedproject.substack.com/p/...  (optional)
 *   ---
 *
 * Essays publish here first and go out through Substack the next morning
 * (Publishing spec §3). Once the Substack send exists, put its URL in
 * `substack:` so Field Notes shows the essay once, from here, rather than
 * twice. Footnotes use the manuscript form: [^key] inline and
 * `[^key]: citation` on its own line, usually under a Sources heading.
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

function inline(s, fn) {
  if (fn) {
    s = s.replace(/\[\^([^\]]+)\]/g, (m, key) => {
      const n = fn.number.get(key)
      return n ? `<sup class="fnref"><a href="#fn-${n}" id="fnref-${n}">${n}</a></sup>` : m
    })
  }
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="note-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

/** Minimal markdown → HTML for note bodies. */
const FN_DEF = /^\[\^([^\]]+)\]:\s+(.*)$/

export function renderMarkdown(md) {
  const lines = md.split(/\r?\n/)
  const out = []
  let list = null
  let para = []

  // Footnotes: definitions come out of the flow and render as one numbered
  // list where the first definition sat; references are numbered in the order
  // a reader meets them, not the order the definitions happen to be written.
  const defs = new Map()
  for (const line of lines) {
    const d = FN_DEF.exec(line.trim())
    if (d) defs.set(d[1], d[2])
  }
  const number = new Map()
  for (const line of lines) {
    if (FN_DEF.test(line.trim())) continue
    for (const m of line.matchAll(/\[\^([^\]]+)\]/g)) {
      if (defs.has(m[1]) && !number.has(m[1])) number.set(m[1], number.size + 1)
    }
  }
  const fn = { number }
  let fnPlaced = false

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(escapeHtml(para.join(' ')), fn)}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map((li) => `<li>${inline(escapeHtml(li), fn)}</li>`).join('')}</ul>`)
      list = null
    }
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) { flushPara(); flushList(); continue }
    if (FN_DEF.test(t)) {
      flushPara(); flushList()
      if (!fnPlaced) { out.push('<!--footnotes-->'); fnPlaced = true }
      continue
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(t)
    if (h) {
      flushPara(); flushList()
      const level = Math.min(h[1].length + 1, 4) // # → h2 so page keeps one h1
      out.push(`<h${level}>${inline(escapeHtml(h[2]), fn)}</h${level}>`)
      continue
    }
    if (t.startsWith('> ')) {
      flushPara(); flushList()
      out.push(`<blockquote>${inline(escapeHtml(t.slice(2)), fn)}</blockquote>`)
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

  let html = out.join('\n')
  if (number.size) {
    const items = [...number.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([key, n]) =>
        `<li id="fn-${n}">${inline(escapeHtml(defs.get(key)))} <a href="#fnref-${n}" class="fnback" aria-label="Back to reference ${n}">↩</a></li>`)
      .join('')
    const block = `<ol class="footnotes">${items}</ol>`
    html = fnPlaced ? html.replace('<!--footnotes-->', block) : `${html}\n${block}`
  }
  return html
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
        substack: meta.substack || null,
        body,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNote(slug) {
  return getNotes().find((n) => n.slug === slug) || null
}
