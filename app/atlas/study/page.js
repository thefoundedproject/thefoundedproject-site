import Link from 'next/link'
import { project, chapters } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import { StudySnapshot } from '../_components/Controls'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Study: six paths, one per Part, each listing its chapters with the three
 * time budgets.
 */

export const metadata = { title: COPY.study.title }

export default function StudyIndex() {
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.study.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.study.title}</h1>
        <p className="a-lede">{COPY.study.lede}</p>
        <StudySnapshot total={chapters.length} />
      </header>

      <section className="a-card a-stack" aria-labelledby="paths-h">
        <h2 id="paths-h" style={{ fontSize: '1.1rem' }}>Three time budgets</h2>
        <dl className="a-kv">
          {Object.entries(COPY.study.pathLabels).map(([k, label]) => (
            <div key={k} style={{ display: 'contents' }}><dt><strong>{label}</strong></dt><dd>{COPY.study.pathWhen[k]}</dd></div>
          ))}
        </dl>
      </section>

      {project.parts.map((part) => (
        <section key={part.numeral} className="a-stack" aria-labelledby={`part-${part.numeral}`}>
          <div>
            <div className="a-eyebrow">Part {part.numeral} · {project.stages.find((s) => s.id === part.stage)?.label}</div>
            <h2 id={`part-${part.numeral}`}>{part.label}</h2>
          </div>
          <ul className="a-list">
            {part.chapter_ids.map((id) => {
              const c = chapters.find((x) => x.id === id)
              return (
                <li key={id}>
                  <div className="a-row" style={{ justifyContent: 'space-between' }}>
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/atlas/chapter/${id}`} style={{ fontWeight: 600 }}>{c.tag} · {c.title}</Link>
                      <p className="a-tiny">{c.counts.claims} {COPY.common.claims} · {c.counts.sources} {COPY.common.sources} · {c.counts.challenges} {COPY.common.challenges}</p>
                    </div>
                    <div className="a-row" role="group" aria-label={`Study ${c.tag}`}>
                      {Object.entries(COPY.study.pathLabels).map(([k, label]) => (
                        <Link key={k} href={`/atlas/study/${id}?path=${k}`} className="a-btn a-btn-secondary a-btn-sm">{label}</Link>
                      ))}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
