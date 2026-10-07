'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Small interactive pieces: marks, bookmarks, notes, the resume button,
 * accessible tabs, and a study snapshot. All state is local to the browser.
 */

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { COPY } from './copy'
import {
  useMarks, setMark, useBookmarks, toggleBookmark, useNotes, setNote,
  useLastLocation, useProgress, useRevisit, addToRevisit, removeFromRevisit,
} from './store'

export function Toast({ message }) {
  if (!message) return null
  return <div className="a-toast" role="status">{message}</div>
}

export function useToast() {
  const [msg, setMsg] = useState('')
  const show = (m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 1800)
  }
  return [msg, show]
}

/** Reviewed / uncertain / revisit for one record. */
export function MarkButtons({ id, label, href, kind, compact = false }) {
  const [marks] = useMarks()
  const current = marks?.[id]?.mark || null
  const meta = { label, href, kind }
  const options = [
    ['reviewed', COPY.study.markReviewed, 'R'],
    ['uncertain', COPY.study.markUncertain, 'U'],
    ['revisit', COPY.study.markRevisit, 'V'],
  ]
  return (
    <div className="a-row" role="group" aria-label="Mark this">
      {options.map(([m, text, key]) => (
        <button
          key={m}
          type="button"
          className="a-mark"
          data-mark={m}
          aria-pressed={current === m}
          onClick={() => setMark(id, current === m ? null : m, meta)}
        >
          {text}{!compact && <kbd style={{ fontSize: '0.7rem', opacity: 0.7 }}>{key}</kbd>}
        </button>
      ))}
    </div>
  )
}

export function BookmarkButton({ id, label, href, kind }) {
  const [bookmarks] = useBookmarks()
  const on = (bookmarks || []).some((b) => b.id === id)
  return (
    <button type="button" className="a-btn a-btn-secondary a-btn-sm" aria-pressed={on} onClick={() => toggleBookmark({ id, label, href, kind })}>
      {on ? COPY.common.bookmarked : COPY.common.bookmark}
    </button>
  )
}

export function RevisitButton({ id, label, href, kind }) {
  const [queue] = useRevisit()
  const on = (queue || []).some((b) => b.id === id)
  return (
    <button type="button" className="a-btn a-btn-secondary a-btn-sm" aria-pressed={on} onClick={() => (on ? removeFromRevisit(id) : addToRevisit({ id, label, href, kind }))}>
      {on ? COPY.common.inRevisit : COPY.common.addRevisit}
    </button>
  )
}

export function NoteBox({ id }) {
  const [notes, , ready] = useNotes()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const uid = useId()
  useEffect(() => {
    if (ready) setText(notes?.[id]?.text || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, id])
  return (
    <div className="a-field">
      <label htmlFor={uid}>{COPY.common.noteLabel}</label>
      <textarea
        id={uid}
        className="a-textarea"
        value={text}
        placeholder={COPY.common.notePlaceholder}
        onChange={(e) => { setText(e.target.value); setSaved(false) }}
        onBlur={() => { setNote(id, text); setSaved(true) }}
      />
      {saved && <span className="a-tiny" role="status">{COPY.common.saved}</span>}
    </div>
  )
}

export function ResumeButton() {
  const [last, , ready] = useLastLocation()
  if (!ready) return <div className="a-btn a-btn-gold" aria-hidden="true" style={{ visibility: 'hidden' }}>{COPY.start.continueLabel}</div>
  if (!last?.href) return <p className="a-muted a-small">{COPY.start.continueNone}</p>
  return (
    <Link href={last.href} className="a-btn a-btn-gold">
      {COPY.start.continueLabel}
      <span style={{ fontWeight: 400, opacity: 0.85 }}>· {last.label}</span>
    </Link>
  )
}

/** How many chapters have any study marks, and how many cards are marked. */
export function StudySnapshot({ total }) {
  const [progress, , ready] = useProgress()
  const [marks] = useMarks()
  if (!ready) return null
  const chapters = Object.values(progress || {}).filter((p) => p.done)
  const marked = Object.values(marks || {})
  const counts = { reviewed: 0, uncertain: 0, revisit: 0 }
  marked.forEach((m) => { if (counts[m.mark] != null) counts[m.mark]++ })
  return (
    <div className="a-row a-small a-muted">
      <span>{chapters.length} of {total} chapters finished in study mode</span>
      <span aria-hidden="true">·</span>
      <span>{counts.reviewed} reviewed</span>
      <span>{counts.uncertain} uncertain</span>
      <span>{counts.revisit} to revisit</span>
    </div>
  )
}

export function ChapterProgressBar({ chapterId, total }) {
  const [progress, , ready] = useProgress()
  if (!ready) return null
  const p = progress?.[chapterId]
  const n = p?.cards ? Object.keys(p.cards).length : 0
  if (!n) return null
  const pct = total ? Math.min(100, Math.round((n / total) * 100)) : 0
  return (
    <div className="a-small a-muted" style={{ marginTop: 10 }}>
      <div className="a-progress" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
      <span>{n} of {total} cards marked{p?.done ? ' · finished' : ''}</span>
    </div>
  )
}

/** Accessible tabs with URL hash sync and arrow-key movement. */
export function Tabs({ tabs, defaultKey }) {
  const [active, setActive] = useState(defaultKey || tabs[0].key)
  const refs = useRef({})
  useEffect(() => {
    const h = (window.location.hash || '').slice(1)
    if (h && tabs.some((t) => t.key === h)) setActive(h)
  }, [tabs])
  const choose = (key) => {
    setActive(key)
    try { history.replaceState(null, '', `#${key}`) } catch { /* ignore */ }
  }
  const onKey = (e, i) => {
    const n = tabs.length
    let j = null
    if (e.key === 'ArrowRight') j = (i + 1) % n
    if (e.key === 'ArrowLeft') j = (i - 1 + n) % n
    if (e.key === 'Home') j = 0
    if (e.key === 'End') j = n - 1
    if (j != null) {
      e.preventDefault()
      choose(tabs[j].key)
      refs.current[tabs[j].key]?.focus()
    }
  }
  return (
    <div>
      <div role="tablist" aria-label="Chapter views" className="a-chipbar" style={{ marginBottom: 18 }}>
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => { refs.current[t.key] = el }}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            className="a-chip"
            aria-pressed={active === t.key}
            onClick={() => choose(t.key)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}{t.count != null ? ` · ${t.count}` : ''}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.key} role="tabpanel" id={`panel-${t.key}`} aria-labelledby={`tab-${t.key}`} hidden={active !== t.key} tabIndex={0}>
          {active === t.key ? t.content : null}
        </div>
      ))}
    </div>
  )
}
