import Link from 'next/link'
import { project, chapters, claims } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The mechanism map: the book's recurring mechanisms, grouped the way the
 * book groups them, with how many chapters and claims use each.
 */

export const metadata = { title: COPY.mechanisms.title }

export default function MechanismsPage() {
  const chapterCount = (id) => chapters.filter((c) => c.mechanisms.some((m) => m.id === id)).length
  const claimCount = (id) => claims.filter((c) => c.mechanisms.includes(id)).length
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.mechanisms.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.mechanisms.title}</h1>
        <p className="a-lede">{COPY.mechanisms.lede}</p>
      </header>
      {project.mechanism_groups.map((g) => (
        <section key={g.id} className="a-stack" aria-labelledby={`g-${g.id}`}>
          <div>
            <h2 id={`g-${g.id}`}>{g.label}</h2>
            <p className="a-tiny">{COPY.common.sourceOfText} {g.source}</p>
          </div>
          <div className="a-grid">
            {project.mechanisms.filter((m) => m.group === g.id).map((m) => (
              <Link key={m.id} href={`/atlas/mechanisms/${m.id}`} className="a-door" style={{ padding: '14px 16px' }}>
                <h2 style={{ fontSize: '1.05rem' }}>{m.label}</h2>
                <p className="a-tiny">{chapterCount(m.id)} {COPY.mechanisms.chapters.toLowerCase()} · {claimCount(m.id)} {COPY.mechanisms.claims.toLowerCase()}{m.glossary_term ? ` · ${m.glossary_term}` : ''}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
