import { Suspense } from 'react'
import { project, chapters } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { Crumbs } from '../_components/ui'
import Search from '../_components/Search'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Explore: global search with filters. The index itself is fetched by the
 * client through the protected data route.
 */

export const metadata = { title: COPY.explore.title }

export default function ExplorePage() {
  const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, { tag: c.tag, title: c.title }]))
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: COPY.explore.title }]} />
      <header className="a-measure a-stack">
        <h1>{COPY.explore.title}</h1>
        <p className="a-lede">{COPY.explore.lede}</p>
      </header>
      <Suspense fallback={<p className="a-muted a-small">Loading…</p>}>
        <Search
          synonyms={project.search_synonyms}
          mechanisms={project.mechanisms.map((m) => ({ id: m.id, label: m.label }))}
          parts={project.parts.map((p) => ({ numeral: p.numeral, label: p.label }))}
          stages={project.stages}
          chapters={chapterMap}
        />
      </Suspense>
    </div>
  )
}
