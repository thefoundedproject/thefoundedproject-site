import { Suspense } from 'react'
import { chapters, challenges } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import ChallengeRoom from '../_components/ChallengeRoom'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The Challenge Room, with the checklist beside it.
 */

export const metadata = { title: COPY.challenge.title }

export default function ChallengePage() {
  const compact = challenges.map((x) => ({
    id: x.id, chapter_id: x.chapter_id, origin: x.origin, label: x.label, kind: x.kind, topic: x.topic,
    proposition: x.proposition, objection: x.objection, evidence: x.evidence, response: x.response,
    revision: x.revision, remaining_uncertainty: x.remaining_uncertainty, resolution: x.resolution,
    claim_ids: x.claim_ids, applied_to: x.applied_to,
  }))
  const counts = {}
  challenges.forEach((x) => { counts[x.resolution] = (counts[x.resolution] || 0) + 1 })
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.challenge.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.challenge.title}</h1>
        <p className="a-lede">{COPY.challenge.lede}</p>
      </header>
      <div className="a-two">
        <Suspense fallback={<p className="a-muted a-small">Loading…</p>}>
          <ChallengeRoom challenges={compact} chapters={chapters.map((c) => ({ id: c.id, tag: c.tag, title: c.title }))} />
        </Suspense>
        <aside className="a-aside">
          <div className="a-card a-stack">
            <div className="a-eyebrow">{COPY.challenge.checklistTitle}</div>
            <ol className="a-ol a-small">{COPY.challenge.checklist.map((q, i) => <li key={i}>{q}</li>)}</ol>
          </div>
          <div className="a-card a-stack a-small">
            <div className="a-eyebrow">Where things stand</div>
            <dl className="a-kv" style={{ gridTemplateColumns: '1fr auto' }}>
              {Object.entries(COPY.challenge.resolutions).map(([k, label]) => <div key={k} style={{ display: 'contents' }}><dt>{label}</dt><dd>{counts[k] || 0}</dd></div>)}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
