'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Global search. Loads the compact index through the protected data route
 * and searches it in the browser: exact words first, then light stemming,
 * synonyms from the taxonomy, and close spellings (one or two edits) when
 * a word matches nothing. Results say what kind of record they are.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { COPY } from './copy'

const KIND_ORDER = { chapter: 0, term: 1, claim: 2, source: 3, challenge: 4 }

function stem(w) {
  if (w.length <= 4) return w
  for (const suf of ['ing', 'edly', 'ed', 'es', 's', 'ly']) {
    if (w.endsWith(suf) && w.length - suf.length >= 4) return w.slice(0, -suf.length)
  }
  return w
}

function tokenize(q) {
  return (q.toLowerCase().match(/[a-z0-9][a-z0-9'’-]*/g) || []).map((w) => w.replace(/['’]/g, '')).filter((w) => w.length >= 2)
}

/** Damerau-Levenshtein distance with an early exit. */
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const m = a.length, n = b.length
  let prev2 = null
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1)
      cur[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    prev2 = prev
    prev = cur
  }
  return prev[n]
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, words }) {
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.map(escapeRe).join('|')})`, 'ig')
  const parts = String(text).split(re)
  return <>{parts.map((p, i) => (re.test(p) && words.some((w) => p.toLowerCase().startsWith(w.toLowerCase().slice(0, 3))) ? <mark key={i} className="a-hit">{p}</mark> : <span key={i}>{p}</span>))}</>
}

function snippet(text, words, width = 180) {
  const lower = text.toLowerCase()
  let at = -1
  for (const w of words) {
    at = lower.indexOf(w)
    if (at >= 0) break
  }
  if (at < 0) return text.slice(0, width) + (text.length > width ? '…' : '')
  const start = Math.max(0, at - Math.floor(width / 3))
  const end = Math.min(text.length, start + width)
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
}

export default function Search({ synonyms, mechanisms, parts, stages, chapters }) {
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [kind, setKind] = useState('all')
  const [part, setPart] = useState('')
  const [stage, setStage] = useState('')
  const [mech, setMech] = useState('')
  const [ctype, setCtype] = useState('')
  const [status, setStatus] = useState('')
  const [stype, setStype] = useState('')
  const [limit, setLimit] = useState(40)
  const inputRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch('/atlas/api/index', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error(`index ${r.status}`); return r.json() })
      .then((data) => {
        if (!alive) return
        setRows(data.map((r) => ({ ...r, lower: `${r.title} ${r.text}`.toLowerCase(), tlower: r.title.toLowerCase() })))
      })
      .catch((e) => alive && setError(String(e.message || e)))
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (params.get('focus') === '1') inputRef.current?.focus()
  }, [params])

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href)
        if (q) url.searchParams.set('q', q); else url.searchParams.delete('q')
        url.searchParams.delete('focus')
        history.replaceState(null, '', url)
      } catch { /* ignore */ }
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const vocab = useMemo(() => {
    if (!rows) return []
    const set = new Set()
    for (const r of rows) for (const w of r.lower.match(/[a-z][a-z'-]{3,}/g) || []) set.add(w)
    return Array.from(set)
  }, [rows])

  const sourceTypes = useMemo(() => rows ? Array.from(new Set(rows.filter((r) => r.kind === 'source').map((r) => r.sourceType))).sort() : [], [rows])

  const { results, expanded, words } = useMemo(() => {
    if (!rows) return { results: [], expanded: [], words: [] }
    const base = tokenize(q)
    const phrase = q.trim().toLowerCase()
    const extra = []
    for (const [key, syns] of Object.entries(synonyms || {})) {
      if (phrase.includes(key)) for (const s of syns) extra.push(s.toLowerCase())
    }
    const primary = base.map((w) => ({ w, s: stem(w) }))
    const fuzzy = []
    if (primary.length) {
      for (const { w } of primary) {
        if (w.length < 5) continue
        const hit = rows.some((r) => r.lower.includes(w))
        if (hit) continue
        const max = w.length >= 8 ? 2 : 1
        const near = vocab.filter((v) => editDistance(w, v, max) <= max).slice(0, 6)
        fuzzy.push(...near)
      }
    }
    const allWords = [...primary.map((p) => p.w), ...primary.map((p) => p.s), ...extra, ...fuzzy]
    const uniqWords = Array.from(new Set(allWords.filter(Boolean)))
    const scored = []
    for (const r of rows) {
      if (kind !== 'all' && r.kind !== kind) continue
      if (part && r.part !== part) continue
      if (stage && r.stage !== stage) continue
      if (mech && !(r.tags || []).includes(mech)) continue
      if (ctype && r.type !== ctype) continue
      if (status && r.status !== status) continue
      if (stype && r.sourceType !== stype) continue
      if (!primary.length) { scored.push({ r, score: 0 }); continue }
      let score = 0
      let primaryHit = false
      for (const { w, s } of primary) {
        if (r.tlower.includes(w)) { score += 6; primaryHit = true }
        else if (r.lower.includes(w)) { score += 2; primaryHit = true }
        else if (s !== w && r.lower.includes(s)) { score += 1.5; primaryHit = true }
      }
      for (const e of extra) if (r.lower.includes(e)) score += 1.2
      for (const f of fuzzy) if (r.lower.includes(f)) score += 1
      if (phrase.length > 3 && r.tlower.includes(phrase)) score += 8
      else if (phrase.length > 3 && r.lower.includes(phrase)) score += 4
      if (!primaryHit && score === 0) continue
      if (r.kind === 'chapter' || r.kind === 'term') score += 1
      scored.push({ r, score })
    }
    scored.sort((a, b) => b.score - a.score || KIND_ORDER[a.r.kind] - KIND_ORDER[b.r.kind] || a.r.title.localeCompare(b.r.title))
    return { results: scored, expanded: Array.from(new Set([...extra, ...fuzzy])), words: uniqWords }
  }, [rows, q, kind, part, stage, mech, ctype, status, stype, synonyms, vocab])

  const anyFilter = kind !== 'all' || part || stage || mech || ctype || status || stype
  const showing = results.slice(0, limit)
  const chapterTag = (id) => chapters?.[id]?.tag || ''

  return (
    <div className="a-stack-lg">
      <div className="a-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input
          id="atlas-search"
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(40) }}
          placeholder={COPY.explore.placeholder}
          aria-label={COPY.explore.placeholder}
          autoComplete="off"
          autoFocus={params.get('focus') === '1'}
        />
      </div>

      <div className="a-chipbar" role="group" aria-label="Kind of record">
        {[['all', 'All'], ...Object.entries(COPY.explore.kinds)].map(([k, label]) => (
          <button key={k} type="button" className="a-chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{label}</button>
        ))}
      </div>

      <details className="a-details">
        <summary>{COPY.explore.filtersLabel}{anyFilter ? ' · active' : ''}</summary>
        <div className="a-details-body">
          <div className="a-filters">
            <label className="a-field">{COPY.common.part}
              <select value={part} onChange={(e) => setPart(e.target.value)}><option value="">Any</option>{parts.map((p) => <option key={p.numeral} value={p.numeral}>Part {p.numeral} · {p.label}</option>)}</select>
            </label>
            <label className="a-field">{COPY.common.stage}
              <select value={stage} onChange={(e) => setStage(e.target.value)}><option value="">Any</option>{stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
            </label>
            <label className="a-field">Mechanism
              <select value={mech} onChange={(e) => setMech(e.target.value)}><option value="">Any</option>{mechanisms.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
            </label>
            <label className="a-field">Claim type
              <select value={ctype} onChange={(e) => setCtype(e.target.value)}><option value="">Any</option>{Object.keys(COPY.evidence.typeHelp).map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </label>
            <label className="a-field">Support
              <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any</option>{Object.keys(COPY.evidence.statusHelp).map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </label>
            <label className="a-field">Source type
              <select value={stype} onChange={(e) => setStype(e.target.value)}><option value="">Any</option>{sourceTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </label>
          </div>
          {anyFilter && <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={() => { setKind('all'); setPart(''); setStage(''); setMech(''); setCtype(''); setStatus(''); setStype('') }}>{COPY.explore.clear}</button>}
        </div>
      </details>

      {error && <p className="a-muted">The index could not load ({error}). Reload the page; if it keeps failing, the data route may be unreachable.</p>}
      {!rows && !error && <p className="a-muted a-small">Loading the index…</p>}

      {rows && (q.trim() || anyFilter) && (
        <section aria-live="polite" className="a-stack">
          <div className="a-row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.15rem' }}>{q.trim() ? COPY.explore.results(results.length, q.trim()) : `${results.length} records`}</h2>
            {expanded.length > 0 && <span className="a-tiny">{COPY.explore.expanded} {expanded.slice(0, 8).join(', ')}</span>}
          </div>
          {results.length === 0 && <p className="a-muted">{COPY.explore.none}</p>}
          <ul className="a-list">
            {showing.map(({ r }) => (
              <li key={`${r.kind}:${r.id}`}>
                <div className="a-row" style={{ marginBottom: 4 }}>
                  <span className="a-pill a-pill-kind">{COPY.explore.kinds[r.kind]}</span>
                  {r.chapter && <span className="a-pill a-pill-mute">{chapterTag(r.chapter)}</span>}
                  {r.kind === 'claim' && <span className="a-pill">{r.type}</span>}
                  {r.kind === 'claim' && <span className="a-pill">{r.status}</span>}
                  {r.kind === 'source' && <span className="a-pill">{r.sourceType}</span>}
                  {r.kind === 'challenge' && <span className="a-pill">{r.resolution}</span>}
                </div>
                <Link href={r.href} style={{ fontWeight: 600 }}><Highlight text={r.title} words={words} /></Link>
                <p className="a-small a-muted" style={{ marginTop: 4 }}><Highlight text={snippet(r.text, words)} words={words} /></p>
              </li>
            ))}
          </ul>
          {results.length > limit && <button type="button" className="a-btn a-btn-secondary" onClick={() => setLimit((l) => l + 40)}>{COPY.explore.showMore} ({results.length - limit} more)</button>}
        </section>
      )}

      {rows && !q.trim() && !anyFilter && (
        <section className="a-stack">
          <p className="a-muted">{COPY.explore.startHints}</p>
          <div className="a-chipbar">
            {mechanisms.slice(0, 24).map((m) => <button key={m.id} type="button" className="a-chip" onClick={() => setQ(m.label)}>{m.label}</button>)}
          </div>
        </section>
      )}
    </div>
  )
}
