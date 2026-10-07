'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The Challenge Room: every counterpoint and review flag, filterable, each
 * one a closed card until opened. A ?id= in the URL opens that record.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { COPY } from './copy'
import { Pill } from './ui'

function tone(res) {
  if (res === 'no-change-needed') return 'ok'
  if (res === 'needs-stephen' || res === 'open') return 'warn'
  return undefined
}

export default function ChallengeRoom({ challenges, chapters }) {
  const params = useSearchParams()
  const focusId = params.get('id')
  const [chapter, setChapter] = useState(focusId ? (challenges.find((x) => x.id === focusId)?.chapter_id || '') : '')
  const [origin, setOrigin] = useState('')
  const [resolution, setResolution] = useState('')
  const [topic, setTopic] = useState('')
  const [limit, setLimit] = useState(30)

  useEffect(() => {
    if (!focusId) return
    const el = document.getElementById(focusId)
    if (el) { el.open = true; el.scrollIntoView({ block: 'start' }) }
  }, [focusId])

  const rows = useMemo(() => challenges.filter((x) =>
    (!chapter || x.chapter_id === chapter) &&
    (!origin || x.origin === origin) &&
    (!resolution || x.resolution === resolution) &&
    (!topic || x.topic === topic)), [challenges, chapter, origin, resolution, topic])

  const tagOf = (id) => chapters.find((c) => c.id === id)?.tag || id
  const counts = useMemo(() => {
    const c = {}
    rows.forEach((x) => { c[x.resolution] = (c[x.resolution] || 0) + 1 })
    return c
  }, [rows])

  return (
    <div className="a-stack-lg">
      <div className="a-filters">
        <label className="a-field">{COPY.challenge.filters.chapter}
          <select value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="">All chapters</option>{chapters.map((c) => <option key={c.id} value={c.id}>{c.tag} · {c.title}</option>)}</select>
        </label>
        <label className="a-field">{COPY.challenge.filters.origin}
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}><option value="">Any</option>{Object.entries(COPY.challenge.origins).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </label>
        <label className="a-field">{COPY.challenge.filters.resolution}
          <select value={resolution} onChange={(e) => setResolution(e.target.value)}><option value="">Any</option>{Object.entries(COPY.challenge.resolutions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </label>
        <label className="a-field">{COPY.challenge.filters.topic}
          <select value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">Any</option>{Object.entries(COPY.challenge.topics).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </label>
      </div>
      <div className="a-row">
        <span className="a-muted a-small" aria-live="polite">{COPY.challenge.counts(rows.length)}</span>
        {Object.entries(counts).map(([k, n]) => <Pill key={k} tone={tone(k)}>{COPY.challenge.resolutions[k] || k}: {n}</Pill>)}
      </div>
      <div className="a-stack">
        {rows.slice(0, limit).map((x) => (
          <details key={x.id} id={x.id} className="a-details">
            <summary>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <span className="a-row">
                  <span className="a-id">{x.id}</span>
                  <Pill tone="mute">{tagOf(x.chapter_id)} · {x.label}</Pill>
                  <Pill tone={tone(x.resolution)}>{COPY.challenge.resolutions[x.resolution] || x.resolution}</Pill>
                  <Pill>{COPY.challenge.topics[x.topic] || x.topic}</Pill>
                </span>
                <span style={{ fontWeight: 500, lineHeight: 1.4 }}>{x.proposition}</span>
              </span>
            </summary>
            <div className="a-details-body">
              <p className="a-tiny">{COPY.challenge.origins[x.origin]}{x.applied_to ? ` · applied to ${x.applied_to}` : ''}</p>
              <dl className="a-kv">
                <dt>{COPY.challenge.fields.objection}</dt><dd>{x.objection}</dd>
                {x.evidence?.length > 0 && <><dt>{COPY.challenge.fields.evidence}</dt><dd><ul className="a-bullets">{x.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul></dd></>}
                {x.response && <><dt>{COPY.challenge.fields.response}</dt><dd>{x.response}</dd></>}
                {x.revision && <><dt>{COPY.challenge.fields.revision}</dt><dd>{x.revision}</dd></>}
                {x.remaining_uncertainty && <><dt>{COPY.challenge.fields.remaining}</dt><dd>{x.remaining_uncertainty}</dd></>}
                {x.claim_ids?.length > 0 && <><dt>{COPY.challenge.fields.claims}</dt><dd className="a-row">{x.claim_ids.map((id) => <Link key={id} href={`/atlas/claim/${id}`} className="a-pill">{id}</Link>)}</dd></>}
              </dl>
              <div className="a-row">
                <Link href={`/atlas/chapter/${x.chapter_id}#challenge`} className="a-btn a-btn-secondary a-btn-sm">{COPY.common.open} {tagOf(x.chapter_id)}</Link>
              </div>
            </div>
          </details>
        ))}
        {rows.length > limit && <button type="button" className="a-btn a-btn-secondary" onClick={() => setLimit((l) => l + 30)}>{COPY.explore.showMore} ({rows.length - limit} more)</button>}
      </div>
    </div>
  )
}
