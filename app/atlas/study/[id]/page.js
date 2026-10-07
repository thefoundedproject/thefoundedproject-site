import { notFound } from 'next/navigation'
import { chapters, getChapter, claimsFor, challengesFor, sourcesFor, termsIn, leadWithYear } from '../../../../lib/atlas'
import { COPY, STATUS_LABEL } from '../../_components/copy'
import { Crumbs } from '../../_components/ui'
import StudyDeck from '../../_components/StudyDeck'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The study deck for one chapter. Cards are assembled here from the
 * structured records, so the manuscript text stays on the server side of
 * the password and only the cards for this chapter reach the browser.
 */

export function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }))
}

export function generateMetadata({ params }) {
  const c = getChapter(params.id)
  return { title: c ? `Study ${c.tag} · ${c.title}` : 'Study' }
}

const PATHS = ['five', 'fifteen', 'deep']

function conceptName(text) {
  const colon = text.indexOf(':')
  if (colon > 0 && colon < 90) return text.slice(0, colon).trim()
  const words = text.split(/\s+/)
  return words.length > 9 ? words.slice(0, 9).join(' ') + '…' : text
}

function buildCards(chapter, claims, challenges, sources, path) {
  const P = COPY.study.prompts
  const K = COPY.study.kinds
  const cards = []
  const push = (kind, prompt, reveal, extra = {}) => cards.push({ id: `${kind}-${cards.length + 1}`, kind, kindLabel: K[kind], prompt, reveal, ...extra })
  const chapterHref = `/atlas/chapter/${chapter.id}`
  const direct = sources.filter((s) => s.evidentiary_role === 'direct')

  // Five-minute path: the argument and the shape of the chapter.
  if (chapter.thesis) push('thesis', P.thesis, { paragraphs: [chapter.thesis], source: chapter.thesis_source })
  if (chapter.summary.purpose) push('purpose', P.purpose, { paragraphs: [chapter.summary.purpose], source: 'Overview › Chapter Purpose' })
  if (chapter.summary.reader_problem) push('readerProblem', P.readerProblem, { paragraphs: [chapter.summary.reader_problem], source: 'Overview › Reader Problem' })
  if (chapter.summary.movement) push('movement', P.movement, { paragraphs: [chapter.summary.movement], source: 'Overview › Chapter Movement' })
  if (chapter.summary.takeaway) push('takeaway', P.takeaway, { paragraphs: [chapter.summary.takeaway], source: 'Overview › Desired Reader Takeaway' })
  push('firstSource', P.firstSource, {
    bullets: (direct.length ? direct : sources).slice(0, 6).map((s) => `${s.id} · ${leadWithYear(s)}${s.use ? `. Validates: ${s.use}` : ''}`),
    links: [{ href: `${chapterHref}#sources`, label: 'Open the source inventory' }],
  })

  if (path === 'fifteen' || path === 'deep') {
    for (const concept of chapter.key_concepts) {
      const name = conceptName(concept)
      const term = termsIn(name)[0]
      push('concept', P.concept(name), {
        paragraphs: [concept],
        source: 'Overview › Key Concepts',
        plain: term ? { term: term.term, text: term.plain_language } : null,
      })
    }
    const nonCore = claims.filter((c) => c.text_origin !== 'overview-core-claim')
    const ranked = [...nonCore].sort((a, b) => {
      const w = (c) => (c.importance === 'load-bearing' ? 0 : 1) * 10 + (c.verification_status === 'cited' ? 0 : 1)
      return w(a) - w(b)
    })
    const chosen = path === 'deep' ? nonCore : ranked.slice(0, 3)
    for (const c of chosen) {
      const srcs = c.supporting_source_ids.map((id) => sources.find((s) => s.id === id)).filter(Boolean)
      push('claim', c.text, {
        pills: [c.type, c.importance, STATUS_LABEL[c.verification_status] || c.verification_status],
        paragraphs: [
          c.location?.section ? `Sits in “${c.location.section}”, paragraph ${c.location.paragraph}.` : 'Not pinned to a draft paragraph yet.',
          c.verification_detail,
          c.establishes ? `Establishes: ${c.establishes}` : null,
          c.competing_explanation ? `Competing explanation: ${c.competing_explanation}` : null,
        ].filter(Boolean),
        bullets: srcs.map((s) => `${s.id} · ${leadWithYear(s)}`),
        links: [{ href: `/atlas/claim/${c.id}`, label: COPY.study.openClaim }],
      }, { hint: P.claim, recordId: c.id, recordLabel: `${chapter.tag} · ${c.text.slice(0, 80)}`, recordHref: `/atlas/claim/${c.id}`, recordKind: 'claim' })
    }
    const counters = challenges.filter((x) => x.origin === 'research-map' && x.kind === 'counter')
    const flagged = challenges.filter((x) => x.resolution === 'needs-stephen')
    const pick = path === 'deep' ? challenges : [...counters, ...flagged].slice(0, 1)
    for (const x of pick) {
      push('challenge', P.challenge, {
        paragraphs: [
          `${x.label}: ${x.proposition}`,
          x.objection !== x.proposition ? x.objection : null,
          x.response ? `Response: ${x.response}` : null,
          x.revision ? `Revision: ${x.revision}` : null,
          `Status: ${COPY.challenge.resolutions[x.resolution] || x.resolution}.`,
        ].filter(Boolean),
        links: [{ href: `/atlas/challenge?id=${x.id}`, label: 'Open in the Challenge Room' }],
      }, { recordId: x.id, recordLabel: `${chapter.tag} ${x.label} · ${x.proposition.slice(0, 70)}`, recordHref: `/atlas/challenge?id=${x.id}`, recordKind: 'challenge' })
    }
    const qs = path === 'deep' ? chapter.study.diagnostic_questions : chapter.study.diagnostic_questions.slice(0, 3)
    for (const q of qs) push('question', q, { none: true })
  }

  if (path === 'deep') {
    for (const q of chapter.study.workbook_questions) push('workbook', q, { none: true })
    push('architecture', P.architecture, { bullets: chapter.draft.sections.map((s) => `${s.heading} (${s.paragraphs} paragraphs${s.footnotes.length ? `, notes: ${s.footnotes.join(', ')}` : ''})`), source: 'Draft headings' })
    if (chapter.related_chapter_ids.length) {
      push('related', P.related, {
        links: chapter.related_chapter_ids.map((id) => ({ href: `/atlas/chapter/${id}`, label: `${getChapter(id)?.tag} · ${getChapter(id)?.title}` })),
        bullets: chapter.related_core_theory,
      })
    }
    if (chapter.pull_quotes.length) {
      push('pullQuote', 'Which of these lines still stands in the current draft?', {
        bullets: chapter.pull_quotes.map((q) => `“${q.text}” (${COPY.chapter.pullQuoteState[q.in_draft]})`),
        source: 'Overview › Possible Pull Quotes',
      })
    }
  }
  return cards
}

export default function StudyChapter({ params, searchParams }) {
  const chapter = getChapter(params.id)
  if (!chapter) notFound()
  const path = PATHS.includes(searchParams?.path) ? searchParams.path : 'five'
  const cards = buildCards(chapter, claimsFor(chapter.id), challengesFor(chapter.id), sourcesFor(chapter.id), path)
  const next = chapter.next_id ? getChapter(chapter.next_id) : null
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ href: '/atlas/study', label: COPY.study.title }, { href: `/atlas/chapter/${chapter.id}`, label: chapter.tag }, { label: COPY.study.pathLabels[path] }]} />
      <header className="a-deck" style={{ marginBottom: 8 }}>
        <div className="a-eyebrow">{chapter.tag} · Part {chapter.part.numeral}</div>
        <h1 style={{ fontSize: '1.5rem' }}>{chapter.title}</h1>
        <div className="a-row" style={{ marginTop: 8 }} role="group" aria-label="Change the time budget">
          {PATHS.map((p) => (
            <a key={p} href={`/atlas/study/${chapter.id}?path=${p}`} className="a-chip" aria-pressed={p === path} style={{ textDecoration: 'none' }}>{COPY.study.pathLabels[p]}</a>
          ))}
        </div>
      </header>
      <StudyDeck chapter={{ id: chapter.id, tag: chapter.tag, title: chapter.title }} path={path} cards={cards} nextChapter={next ? { id: next.id, tag: next.tag } : null} />
    </div>
  )
}
