import { chapters, terms } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import TermsList from '../_components/TermsList'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The glossary, from Founded Glossary v1.0.
 */

export const metadata = { title: COPY.terms.title }

export default function TermsPage() {
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.terms.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.terms.title}</h1>
        <p className="a-lede">{COPY.terms.lede}</p>
      </header>
      <div className="a-measure">
        <TermsList terms={terms} chapters={chapters.map((c) => ({ id: c.id, tag: c.tag }))} />
      </div>
    </div>
  )
}
