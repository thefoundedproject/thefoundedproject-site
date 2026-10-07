import Link from 'next/link'
import { project, chapters } from '../../lib/atlas'
import { COPY } from './_components/copy'
import { ResumeButton, StudySnapshot } from './_components/Controls'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Start Here. One screen: the thesis, a resume button, three doors.
 */

export const metadata = { title: 'Start here' }

export default function AtlasStart() {
  const recent = [...chapters]
    .sort((a, b) => String(b.draft.revised_date || b.draft.date || '').localeCompare(String(a.draft.revised_date || a.draft.date || '')))
    .slice(0, 5)

  return (
    <div className="a-stack-lg">
      <header className="a-measure a-stack">
        <div className="a-eyebrow">{COPY.start.eyebrow}</div>
        <h1>{COPY.start.title}</h1>
        <p className="a-lede">{COPY.start.lede}</p>
        <ResumeButton />
      </header>

      <section aria-label="Doors" className="a-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {COPY.start.doors.map((d) => (
          <Link key={d.key} href={d.href} className="a-door">
            <h2>{d.title}</h2>
            <p className="a-door-when">{d.when}</p>
            <p className="a-door-arrow">{COPY.common.open} →</p>
          </Link>
        ))}
      </section>

      <section className="a-card a-card-deep a-stack" aria-labelledby="thesis-h">
        <div className="a-eyebrow" style={{ color: 'var(--a-gold)' }} id="thesis-h">{COPY.start.thesisLabel}</div>
        <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.5rem', lineHeight: 1.35 }}>{project.thesis}</p>
        <p className="a-small a-muted">{COPY.start.sequenceLabel}: {project.sequence.join(' → ')}</p>
        <p className="a-tiny" style={{ color: 'rgba(230,221,203,0.6)' }}>{COPY.common.sourceOfText} {project.thesis_source}</p>
      </section>

      <section className="a-two" aria-label="Where things stand">
        <div className="a-stack">
          <h2 style={{ fontSize: '1.2rem' }}>{COPY.start.recentLabel}</h2>
          <ul className="a-list">
            {recent.map((c) => (
              <li key={c.id}>
                <Link href={`/atlas/chapter/${c.id}`} style={{ fontWeight: 600 }}>{c.tag} · {c.title}</Link>
                <p className="a-tiny">{c.draft.status || 'Draft'} · {c.draft.revised_date || c.draft.date}</p>
              </li>
            ))}
          </ul>
          <StudySnapshot total={chapters.length} />
        </div>
        <aside className="a-aside a-stack">
          {COPY.start.secondary.map((s) => (
            <Link key={s.href} href={s.href} className="a-card" style={{ display: 'block', textDecoration: 'none' }}>
              <strong>{s.title}</strong>
              <p className="a-small a-muted" style={{ marginTop: 4 }}>{s.when}</p>
            </Link>
          ))}
          <p className="a-tiny">{project.edition} · updated {project.updated} · {project.counts.chapters} chapters · {project.counts.claims} claims · {project.counts.sources} sources</p>
        </aside>
      </section>

      <p className="a-tiny a-measure">{COPY.start.pauseLine}</p>
    </div>
  )
}
