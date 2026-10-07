'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The glossary, filterable, each term closed until opened; the plain-language
 * version is one click away on every entry.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { COPY } from './copy'

export default function TermsList({ terms, chapters }) {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return terms.filter((t) => !n || `${t.term} ${t.working_definition} ${t.plain_language}`.toLowerCase().includes(n))
  }, [terms, q])
  useEffect(() => {
    const h = (window.location.hash || '').slice(1)
    if (!h) return
    const el = document.getElementById(h)
    if (el) { el.open = true; el.scrollIntoView({ block: 'start' }) }
  }, [])
  const tagOf = (id) => chapters.find((c) => c.id === id)?.tag || id
  return (
    <div className="a-stack">
      <label className="a-field" style={{ maxWidth: 420 }}>{COPY.terms.filter}
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <p className="a-muted a-small" aria-live="polite">{rows.length} of {terms.length} terms</p>
      <div className="a-stack">
        {rows.map((t) => (
          <details key={t.id} id={t.id} className="a-details">
            <summary><span>{t.term}</span></summary>
            <div className="a-details-body">
              <p>{t.working_definition}</p>
              {t.plain_language && <p className="a-quote" style={{ fontStyle: 'normal' }}><strong>{COPY.terms.plain}.</strong> {t.plain_language}</p>}
              {t.what_it_is_not && <p><strong>{COPY.terms.notLabel}.</strong> {t.what_it_is_not}</p>}
              {t.where_it_appears && <p className="a-small a-muted"><strong>{COPY.terms.whereLabel}.</strong> {t.where_it_appears}</p>}
              {t.chapter_ids?.length > 0 && (
                <p className="a-row a-small"><span className="a-muted">{COPY.terms.chaptersLabel}:</span>{t.chapter_ids.map((id) => <Link key={id} href={`/atlas/chapter/${id}`} className="a-pill">{tagOf(id)}</Link>)}</p>
              )}
              {t.mechanism_ids?.length > 0 && (
                <p className="a-row a-small"><span className="a-muted">Mechanisms:</span>{t.mechanism_ids.map((id) => <Link key={id} href={`/atlas/mechanisms/${id}`} className="a-pill">{id}</Link>)}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
