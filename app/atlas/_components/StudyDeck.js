'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * The study deck: one card per screen, a recall prompt first, the answer on
 * request, then a mark (reviewed, uncertain, revisit) and the next card.
 * Progress is saved per chapter on this device. Finishing shows what was
 * marked and where to go next. No streaks, no scores, no shame.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { COPY } from './copy'
import { useProgress, updateProgress, setMark, addToRevisit } from './store'

function Reveal({ reveal }) {
  const [plain, setPlain] = useState(false)
  if (!reveal) return null
  if (reveal.none) return <p className="a-muted">{COPY.study.prompts.question}</p>
  return (
    <div className="a-deck-reveal">
      {reveal.source && <p className="a-tiny">{COPY.common.sourceOfText} {reveal.source}</p>}
      {reveal.plain && (
        <div className="a-row">
          <button type="button" className="a-btn a-btn-secondary a-btn-sm" aria-pressed={plain} onClick={() => setPlain((p) => !p)}>{COPY.study.plainLanguage}</button>
          {plain && <span className="a-tiny">{COPY.common.sourceOfText} Founded Glossary · {reveal.plain.term}</span>}
        </div>
      )}
      {plain && reveal.plain ? <p className="a-lede">{reveal.plain.text}</p> : null}
      {reveal.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {reveal.bullets?.length > 0 && <ul className="a-bullets">{reveal.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
      {reveal.pills?.length > 0 && <div className="a-row">{reveal.pills.map((p, i) => <span key={i} className="a-pill">{p}</span>)}</div>}
      {reveal.links?.length > 0 && (
        <div className="a-row">
          {reveal.links.map((l) => <Link key={l.href} href={l.href} className="a-btn a-btn-secondary a-btn-sm">{l.label}</Link>)}
        </div>
      )}
    </div>
  )
}

export default function StudyDeck({ chapter, path, cards, nextChapter }) {
  const [progress, , ready] = useProgress()
  const saved = progress?.[chapter.id]
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(false)
  const [cardMarks, setCardMarks] = useState({})
  const total = cards.length
  const card = cards[Math.min(i, total - 1)]

  // Resume inside the chapter if the same path was in progress.
  useEffect(() => {
    if (!ready) return
    if (saved?.path === path && saved.cards) {
      setCardMarks(saved.cards)
      if (!saved.done && typeof saved.lastCard === 'number' && saved.lastCard < total) setI(saved.lastCard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const persist = (patch) => updateProgress(chapter.id, { path, lastCard: i, cards: cardMarks, ...patch })

  const go = (j) => {
    if (j >= total) {
      setDone(true)
      persist({ done: true, lastCard: 0 })
      return
    }
    const k = Math.max(0, j)
    setI(k)
    setShown(false)
    persist({ lastCard: k })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const mark = (m) => {
    const next = { ...cardMarks }
    if (next[card.id] === m) delete next[card.id]
    else next[card.id] = m
    setCardMarks(next)
    updateProgress(chapter.id, { path, lastCard: i, cards: next })
    if (card.recordId) {
      setMark(card.recordId, next[card.id] || null, { label: card.recordLabel, href: card.recordHref, kind: card.recordKind })
    } else if (m === 'revisit' && next[card.id] === 'revisit') {
      addToRevisit({ id: `${chapter.id}:${card.id}`, label: `${chapter.tag} · ${card.kindLabel}: ${card.prompt}`, href: `/atlas/study/${chapter.id}?path=${path}`, kind: 'card' })
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (done) return
      if (e.key === 'ArrowRight' || e.key === ']') { e.preventDefault(); go(i + 1) }
      else if (e.key === 'ArrowLeft' || e.key === '[') { e.preventDefault(); go(i - 1) }
      else if (e.key === ' ' || e.key === 'Enter') { if (t && t.tagName === 'BUTTON') return; e.preventDefault(); setShown((s) => !s) }
      else if (e.key === 'r' || e.key === 'R') mark('reviewed')
      else if (e.key === 'u' || e.key === 'U') mark('uncertain')
      else if (e.key === 'v' || e.key === 'V') mark('revisit')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, done, cardMarks, card])

  const summary = useMemo(() => {
    const c = { reviewed: 0, uncertain: 0, revisit: 0 }
    Object.values(cardMarks).forEach((m) => { if (c[m] != null) c[m]++ })
    return c
  }, [cardMarks])

  if (done) {
    const flagged = cards.filter((c) => cardMarks[c.id] && cardMarks[c.id] !== 'reviewed')
    return (
      <div className="a-deck a-stack-lg">
        <div className="a-deck-card">
          <div className="a-eyebrow">{chapter.tag} · {COPY.study.pathLabels[path]}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{COPY.study.done.title}</h1>
          <p className="a-muted">{COPY.study.done.body}</p>
          <div className="a-row">
            <span className="a-pill a-pill-ok">{summary.reviewed} {COPY.study.markReviewed.toLowerCase()}</span>
            <span className="a-pill a-pill-warn">{summary.uncertain} {COPY.study.markUncertain.toLowerCase()}</span>
            <span className="a-pill">{summary.revisit} {COPY.study.markRevisit.toLowerCase()}</span>
            <span className="a-pill a-pill-mute">{total - Object.keys(cardMarks).length} unmarked</span>
          </div>
          {flagged.length > 0 && (
            <ul className="a-bullets a-small">
              {flagged.map((c) => <li key={c.id}><strong>{cardMarks[c.id]}</strong>: {c.kindLabel} · {c.prompt}</li>)}
            </ul>
          )}
          <div className="a-deck-actions">
            {nextChapter && <Link href={`/atlas/study/${nextChapter.id}?path=${path}`} className="a-btn a-btn-gold">{COPY.study.done.next}: {nextChapter.tag}</Link>}
            <button type="button" className="a-btn a-btn-secondary" onClick={() => { setDone(false); setI(0); setShown(false); persist({ done: false, lastCard: 0 }) }}>{COPY.study.done.again}</button>
            <Link href={`/atlas/chapter/${chapter.id}`} className="a-btn a-btn-secondary">{COPY.study.openChapter}</Link>
            <Link href="/atlas/study" className="a-btn a-btn-secondary">{COPY.study.done.backToPaths}</Link>
          </div>
        </div>
      </div>
    )
  }

  const current = cardMarks[card.id]
  return (
    <div className="a-deck">
      <div className="a-deck-top">
        <span>{COPY.study.cardOf(i + 1, total)} · {COPY.study.pathLabels[path]}</span>
        <div className="a-progress" style={{ flex: 1, maxWidth: 220 }} aria-hidden="true"><span style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
      </div>
      <article className="a-deck-card" aria-live="polite" aria-atomic="true">
        <div className="a-row" style={{ justifyContent: 'space-between' }}>
          <span className="a-eyebrow">{card.kindLabel}</span>
          {card.recordId && <span className="a-id">{card.recordId}</span>}
        </div>
        <p className="a-deck-prompt">{card.prompt}</p>
        {card.hint && <p className="a-muted a-small">{card.hint}</p>}
        {shown ? <Reveal reveal={card.reveal} /> : null}
        <div className="a-deck-actions">
          {!card.reveal?.none && (
            <button type="button" className="a-btn" onClick={() => setShown((s) => !s)} aria-expanded={shown}>
              {shown ? COPY.study.hide : COPY.study.reveal} <kbd>Space</kbd>
            </button>
          )}
          {(shown || card.reveal?.none) && (
            <div className="a-row" role="group" aria-label="Mark this card">
              <button type="button" className="a-mark" data-mark="reviewed" aria-pressed={current === 'reviewed'} onClick={() => mark('reviewed')}>{COPY.study.markReviewed} <kbd>R</kbd></button>
              <button type="button" className="a-mark" data-mark="uncertain" aria-pressed={current === 'uncertain'} onClick={() => mark('uncertain')}>{COPY.study.markUncertain} <kbd>U</kbd></button>
              <button type="button" className="a-mark" data-mark="revisit" aria-pressed={current === 'revisit'} onClick={() => mark('revisit')}>{COPY.study.markRevisit} <kbd>V</kbd></button>
            </div>
          )}
        </div>
      </article>
      <div className="a-deck-nav">
        <button type="button" className="a-btn a-btn-secondary" onClick={() => go(i - 1)} disabled={i === 0}>← {COPY.study.prev}</button>
        <button type="button" className="a-btn" onClick={() => go(i + 1)}>{i + 1 === total ? COPY.study.finish : COPY.study.next} →</button>
      </div>
      <p className="a-tiny" style={{ textAlign: 'center', marginTop: 14 }}>{COPY.start.pauseLine}</p>
    </div>
  )
}
