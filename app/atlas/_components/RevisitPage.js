'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The revisit queue, bookmarks, notes, marks, and study progress, all read
 * from this browser's storage.
 */

import Link from 'next/link'
import { COPY } from './copy'
import { useRevisit, removeFromRevisit, useBookmarks, toggleBookmark, useNotes, setNote, useMarks, setMark, useProgress, clearAll } from './store'
import { Pill } from './ui'

function Item({ item, onRemove }) {
  return (
    <li className="a-row" style={{ justifyContent: 'space-between' }}>
      <span style={{ minWidth: 0 }}>
        {item.kind && <Pill tone="kind">{item.kind}</Pill>}{' '}
        {item.href ? <Link href={item.href}>{item.label || item.id}</Link> : (item.label || item.id)}
        {item.at && <span className="a-tiny"> · {new Date(item.at).toLocaleDateString()}</span>}
      </span>
      <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={onRemove}>{COPY.revisit.remove}</button>
    </li>
  )
}

export default function RevisitPage({ chapters }) {
  const [queue] = useRevisit()
  const [bookmarks] = useBookmarks()
  const [notes] = useNotes()
  const [marks] = useMarks()
  const [progress] = useProgress()
  const noteEntries = Object.entries(notes || {})
  const markEntries = Object.entries(marks || {}).filter(([, m]) => m.mark !== 'revisit')
  const progEntries = Object.entries(progress || {})
  const tagOf = (id) => chapters.find((c) => c.id === id)

  return (
    <div className="a-stack-lg">
      <section className="a-stack" aria-labelledby="rv-queue">
        <h2 id="rv-queue">{COPY.revisit.queue} <span className="a-muted a-small">({(queue || []).length})</span></h2>
        {(queue || []).length === 0 ? <p className="a-muted a-small">{COPY.revisit.empty}</p> : (
          <ul className="a-list">{queue.map((it) => <Item key={it.id} item={it} onRemove={() => { removeFromRevisit(it.id); if (marks?.[it.id]?.mark === 'revisit') setMark(it.id, null) }} />)}</ul>
        )}
      </section>

      <section className="a-stack" aria-labelledby="rv-progress">
        <h2 id="rv-progress">{COPY.revisit.progressTitle}</h2>
        {progEntries.length === 0 ? <p className="a-muted a-small">{COPY.revisit.empty}</p> : (
          <ul className="a-list">
            {progEntries.map(([cid, p]) => {
              const ch = tagOf(cid)
              const n = p.cards ? Object.keys(p.cards).length : 0
              return (
                <li key={cid} className="a-row" style={{ justifyContent: 'space-between' }}>
                  <span><Link href={`/atlas/study/${cid}?path=${p.path || 'five'}`}>{ch ? `${ch.tag} · ${ch.title}` : cid}</Link> <span className="a-tiny">· {COPY.study.pathLabels[p.path] || p.path} · {n} cards marked{p.done ? ' · finished' : ''}</span></span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="a-stack" aria-labelledby="rv-marks">
        <h2 id="rv-marks">{COPY.revisit.marks} <span className="a-muted a-small">({markEntries.length})</span></h2>
        {markEntries.length === 0 ? <p className="a-muted a-small">{COPY.revisit.empty}</p> : (
          <ul className="a-list">
            {markEntries.map(([id, m]) => (
              <li key={id} className="a-row" style={{ justifyContent: 'space-between' }}>
                <span><Pill tone={m.mark === 'reviewed' ? 'ok' : 'warn'}>{m.mark}</Pill> {m.href ? <Link href={m.href}>{m.label || id}</Link> : (m.label || id)}</span>
                <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={() => setMark(id, null)}>{COPY.revisit.remove}</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="a-stack" aria-labelledby="rv-bookmarks">
        <h2 id="rv-bookmarks">{COPY.revisit.bookmarks} <span className="a-muted a-small">({(bookmarks || []).length})</span></h2>
        {(bookmarks || []).length === 0 ? <p className="a-muted a-small">{COPY.revisit.empty}</p> : (
          <ul className="a-list">{bookmarks.map((it) => <Item key={it.id} item={it} onRemove={() => toggleBookmark(it)} />)}</ul>
        )}
      </section>

      <section className="a-stack" aria-labelledby="rv-notes">
        <h2 id="rv-notes">{COPY.revisit.notes} <span className="a-muted a-small">({noteEntries.length})</span></h2>
        {noteEntries.length === 0 ? <p className="a-muted a-small">{COPY.revisit.empty}</p> : (
          <ul className="a-list">
            {noteEntries.map(([id, n]) => (
              <li key={id}>
                <div className="a-row" style={{ justifyContent: 'space-between' }}>
                  <Link href={id.startsWith('FP-S') ? `/atlas/source/${id}` : id.includes('-C') ? `/atlas/claim/${id}` : `/atlas/chapter/${id}`}>{id}</Link>
                  <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={() => setNote(id, '')}>{COPY.revisit.remove}</button>
                </div>
                <p className="a-small" style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{n.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={() => { if (window.confirm(COPY.revisit.clearConfirm)) clearAll() }}>{COPY.revisit.clear}</button>
      </section>
    </div>
  )
}
