import Link from 'next/link'
import { project, chapters, claims, compactClaim } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import EvidenceTable from '../_components/EvidenceTable'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Evidence: the claim ledger. Each claim opens beside its sources.
 */

export const metadata = { title: COPY.evidence.title }

export default function EvidencePage() {
  const counts = { cited: 0, mapped: 0, 'mapped-cross-chapter': 0, argued: 0, unsupported: 0 }
  claims.forEach((c) => { counts[c.verification_status] = (counts[c.verification_status] || 0) + 1 })
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.evidence.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.evidence.title}</h1>
        <p className="a-lede">{COPY.evidence.lede}</p>
        <div className="a-row a-small a-muted">
          {Object.entries(counts).map(([k, n]) => <span key={k} className="a-pill" title={COPY.evidence.statusHelp[k]}>{k}: {n}</span>)}
          <Link href="/atlas/gaps" className="a-small">See the gap report</Link>
        </div>
      </header>
      <EvidenceTable
        claims={claims.map(compactClaim)}
        chapters={chapters.map((c) => ({ id: c.id, tag: c.tag, title: c.title, part: { numeral: c.part.numeral } }))}
        parts={project.parts.map((p) => ({ numeral: p.numeral, label: p.label }))}
        mechanisms={project.mechanisms.map((m) => ({ id: m.id, label: m.label }))}
      />
    </div>
  )
}
