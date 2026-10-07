import Link from 'next/link'
import { gaps, chapters } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs, Pill } from '../_components/ui'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The audit dashboard: unsupported claims, missing locators, broken links,
 * and unresolved counterpoints, in priority order.
 */

export const metadata = { title: COPY.gaps.title }

function hrefFor(ref, chapterId) {
  if (!ref) return chapterId ? `/atlas/chapter/${chapterId}` : null
  if (/^FP-S\d+/.test(ref)) return `/atlas/source/${ref}`
  if (/-X\d+$/.test(ref)) return `/atlas/challenge?id=${ref}`
  if (/-C\d+$/.test(ref)) return `/atlas/claim/${ref}`
  return chapterId ? `/atlas/chapter/${chapterId}` : null
}

export default function GapsPage() {
  const tagOf = (id) => chapters.find((c) => c.id === id)?.tag || ''
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.gaps.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.gaps.title}</h1>
        <p className="a-lede">{COPY.gaps.lede}</p>
        <p className="a-small a-muted">Generated {gaps.generated}. {COPY.gaps.regenerate} <a href="/atlas/api/gap-report.md">Download the report.</a></p>
        <div className="a-row">
          {Object.entries(gaps.by_priority).map(([p, rows]) => <Pill key={p} tone={p === 'P1' ? 'warn' : undefined}>{p}: {rows.length}</Pill>)}
        </div>
      </header>
      {Object.entries(gaps.by_priority).map(([p, rows]) => {
        const byKind = {}
        rows.forEach((g) => { (byKind[g.kind] = byKind[g.kind] || []).push(g) })
        return (
          <section key={p} className="a-stack" aria-labelledby={`gp-${p}`}>
            <h2 id={`gp-${p}`}>{p}. {gaps.priorities[p]} <span className="a-muted a-small">({rows.length})</span></h2>
            {rows.length === 0 && <p className="a-muted a-small">Nothing in this priority.</p>}
            {Object.entries(byKind).map(([kind, items]) => (
              <details key={kind} className="a-details" open={p === 'P1'}>
                <summary>{kind} <span className="a-muted">· {items.length}</span></summary>
                <div className="a-details-body">
                  <ul className="a-bullets a-small">
                    {items.map((g, i) => {
                      const href = hrefFor(g.ref, g.chapter_id)
                      return <li key={i}>{g.chapter_id && <Pill tone="mute">{tagOf(g.chapter_id)}</Pill>} {href ? <Link href={href}>{g.text}</Link> : g.text}</li>
                    })}
                  </ul>
                </div>
              </details>
            ))}
          </section>
        )
      })}
    </div>
  )
}
