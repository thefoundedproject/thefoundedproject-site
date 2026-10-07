import Link from 'next/link'
import { notFound } from 'next/navigation'
import { project, chapters, claims, terms, getMechanism, groupLabel, compactClaim } from '../../../../lib/atlas'
import { COPY } from '../../_components/copy'
import { Crumbs, ClaimRow, Pill, Empty } from '../../_components/ui'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * One mechanism: where the book defines it, which chapters and claims use
 * it, and the glossary terms behind it.
 */

export function generateStaticParams() {
  return project.mechanisms.map((m) => ({ id: m.id }))
}

export function generateMetadata({ params }) {
  const m = getMechanism(params.id)
  return { title: m ? m.label : 'Mechanism' }
}

export default function MechanismPage({ params }) {
  const m = getMechanism(params.id)
  if (!m) notFound()
  const chs = chapters.filter((c) => c.mechanisms.some((x) => x.id === m.id))
  const cls = claims.filter((c) => c.mechanisms.includes(m.id))
  const ts = terms.filter((t) => t.mechanism_ids.includes(m.id) || t.term === m.glossary_term)
  const group = project.mechanism_groups.find((g) => g.id === m.group)
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ href: '/atlas/mechanisms', label: COPY.mechanisms.title }, { label: m.label }]} />
      <header className="a-measure a-stack">
        <div className="a-eyebrow">{groupLabel(m.group)}</div>
        <h1>{m.label}</h1>
        <p className="a-tiny">{COPY.common.sourceOfText} {group?.source}. {COPY.mechanisms.basis}: {m.patterns.join(', ')}</p>
      </header>
      {ts.length > 0 && (
        <section className="a-stack a-measure" aria-labelledby="t-h">
          <div className="a-eyebrow" id="t-h">{COPY.mechanisms.terms}</div>
          {ts.map((t) => (
            <div key={t.id} className="a-card a-stack">
              <strong><Link href={`/atlas/terms#${t.id}`}>{t.term}</Link></strong>
              <p className="a-small">{t.working_definition}</p>
              {t.plain_language && <p className="a-small a-quote" style={{ fontStyle: 'normal' }}>{t.plain_language}</p>}
            </div>
          ))}
        </section>
      )}
      <section className="a-stack" aria-labelledby="c-h">
        <div className="a-eyebrow" id="c-h">{COPY.mechanisms.chapters} · {chs.length}</div>
        {chs.length === 0 && <Empty>No chapter is tagged with this mechanism.</Empty>}
        <ul className="a-list">{chs.map((c) => <li key={c.id}><Link href={`/atlas/chapter/${c.id}`} style={{ fontWeight: 600 }}>{c.tag} · {c.title}</Link> <Pill tone="mute">Part {c.part.numeral}</Pill><p className="a-tiny">Tagged from {c.mechanisms.find((x) => x.id === m.id)?.basis}</p></li>)}</ul>
      </section>
      <section className="a-stack a-measure" aria-labelledby="cl-h">
        <div className="a-eyebrow" id="cl-h">{COPY.mechanisms.claims} · {cls.length}</div>
        {cls.length === 0 && <Empty>No claim mentions this mechanism.</Empty>}
        <ul className="a-list">{cls.map((c) => <ClaimRow key={c.id} claim={compactClaim(c)} chapterTag={chapters.find((x) => x.id === c.chapter_id)?.tag} />)}</ul>
      </section>
    </div>
  )
}
