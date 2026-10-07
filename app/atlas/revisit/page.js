import { chapters } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import RevisitPage from '../_components/RevisitPage'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The revisit queue and everything else saved on this device.
 */

export const metadata = { title: COPY.revisit.title }

export default function Revisit() {
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.revisit.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.revisit.title}</h1>
        <p className="a-lede">{COPY.revisit.lede}</p>
      </header>
      <div className="a-measure">
        <RevisitPage chapters={chapters.map((c) => ({ id: c.id, tag: c.tag, title: c.title }))} />
      </div>
    </div>
  )
}
