'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The claim ledger with filters. Rows link to the claim page where the
 * claim sits beside its sources.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { COPY, STATUS_LABEL } from './copy'
import { Pill, StatusPill } from './ui'

export default function EvidenceTable({ claims, chapters, parts, mechanisms }) {
  const [part, setPart] = useState('')
  const [chapter, setChapter] = useState('')
  const [type, setType] = useState('')
  const [importance, setImportance] = useState('')
  const [status, setStatus] = useState('')
  const [origin, setOrigin] = useState('')
  const [mech, setMech] = useState('')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return claims.filter((c) =>
      (!part || c.part === part) &&
      (!chapter || c.chapter_id === chapter) &&
      (!type || c.type === type) &&
      (!importance || c.importance === importance) &&
      (!status || c.status === status) &&
      (!origin || c.origin === origin) &&
      (!mech || c.mechanisms.includes(mech)) &&
      (!needle || c.text.toLowerCase().includes(needle) || c.id.toLowerCase().includes(needle)))
  }, [claims, part, chapter, type, importance, status, origin, mech, q])

  const chapterList = chapters.filter((c) => !part || c.part.numeral === part)
  const any = part || chapter || type || importance || status || origin || mech || q

  return (
    <div className="a-stack-lg">
      <div className="a-filters">
        <label className="a-field" style={{ flex: '2 1 240px' }}>Filter by words or ID
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. polyvagal, FP-CH06" />
        </label>
        <label className="a-field">{COPY.common.part}
          <select value={part} onChange={(e) => { setPart(e.target.value); setChapter('') }}><option value="">Any</option>{parts.map((p) => <option key={p.numeral} value={p.numeral}>Part {p.numeral} · {p.label}</option>)}</select>
        </label>
        <label className="a-field">{COPY.common.chapter}
          <select value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="">Any</option>{chapterList.map((c) => <option key={c.id} value={c.id}>{c.tag} · {c.title}</option>)}</select>
        </label>
        <label className="a-field">{COPY.evidence.columns.type}
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="">Any</option>{Object.keys(COPY.evidence.typeHelp).map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </label>
        <label className="a-field">{COPY.evidence.columns.importance}
          <select value={importance} onChange={(e) => setImportance(e.target.value)}><option value="">Any</option>{Object.keys(COPY.evidence.importanceHelp).map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </label>
        <label className="a-field">{COPY.evidence.columns.status}
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any</option>{Object.keys(STATUS_LABEL).map((t) => <option key={t} value={t}>{STATUS_LABEL[t]}</option>)}</select>
        </label>
        <label className="a-field">Origin
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}><option value="">Any</option><option value="overview-core-claim">Core claim (Overview)</option><option value="draft-sentence">Footnoted sentence (Draft)</option><option value="research-map">Research Map table</option></select>
        </label>
        <label className="a-field">Mechanism
          <select value={mech} onChange={(e) => setMech(e.target.value)}><option value="">Any</option>{mechanisms.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
        </label>
      </div>
      <div className="a-row" style={{ justifyContent: 'space-between' }}>
        <p className="a-muted a-small" aria-live="polite">{COPY.evidence.counts(rows.length)}</p>
        {any && <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={() => { setPart(''); setChapter(''); setType(''); setImportance(''); setStatus(''); setOrigin(''); setMech(''); setQ('') }}>{COPY.explore.clear}</button>}
      </div>
      <ul className="a-list">
        {rows.map((c) => (
          <li key={c.id}>
            <div className="a-row" style={{ marginBottom: 6 }}>
              <span className="a-id">{c.id}</span>
              <Pill tone="mute">{chapters.find((x) => x.id === c.chapter_id)?.tag}</Pill>
              <Pill tone="kind" title={COPY.evidence.typeHelp[c.type]}>{c.type}</Pill>
              <Pill title={COPY.evidence.importanceHelp[c.importance]}>{c.importance}</Pill>
              <StatusPill status={c.status} />
              <span className="a-tiny">{c.sources} source{c.sources === 1 ? '' : 's'}{c.qualifying ? ` · ${c.qualifying} qualifying` : ''}</span>
            </div>
            <Link href={`/atlas/claim/${c.id}`}>{c.text}</Link>
            {c.section && <p className="a-tiny">§ {c.section}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
