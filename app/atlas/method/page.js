import Link from 'next/link'
import { project } from '../../../lib/atlas'
import { COPY } from '../_components/copy'
import { METHOD } from '../_components/method'
import { Crumbs } from '../_components/ui'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Methodology: definitions, inclusion rules, inference standards, and the
 * correction procedure, plus the edition and suggested citation.
 */

export const metadata = { title: METHOD.title }

const DOWNLOADS = [
  ['claims.csv', 'Claim ledger (CSV)'], ['sources.csv', 'Source ledger (CSV)'], ['chapters.csv', 'Chapter guide (CSV)'],
  ['challenges.csv', 'Challenge records (CSV)'], ['terms.csv', 'Glossary (CSV)'],
  ['claims', 'Claims (JSON)'], ['sources', 'Sources (JSON)'], ['chapters', 'Chapters (JSON)'], ['challenges', 'Challenges (JSON)'], ['project', 'Project (JSON)'],
  ['master-dossier.md', 'Master dossier (Markdown)'], ['gap-report.md', 'Gap report (Markdown)'], ['link-validation.json', 'Link validation (JSON)'],
]

export default function MethodPage() {
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ label: METHOD.title }]} />
      <header className="a-measure a-stack">
        <h1>{METHOD.title}</h1>
        <p className="a-lede">{METHOD.lede}</p>
      </header>
      <div className="a-two">
        <article className="a-prose a-measure">
          {METHOD.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {s.list && <ul>{s.list.map((p, i) => <li key={i}>{p}</li>)}</ul>}
              {s.definitions && <dl>{s.definitions.map(([k, v]) => <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
            </section>
          ))}
          <section>
            <h2>Edition and citation</h2>
            <dl>
              <dt>Edition</dt><dd>{project.edition}</dd>
              <dt>Updated</dt><dd>{project.updated}</dd>
              <dt>Scope</dt><dd>{project.scope}</dd>
              <dt>Author</dt><dd>{project.author}</dd>
              <dt>Records</dt><dd>{project.counts.chapters} chapters · {project.counts.claims} claims · {project.counts.sources} sources · {project.counts.challenges} challenge records · {project.counts.terms} terms · {project.counts.links_checked} links checked</dd>
              <dt>Suggested citation</dt><dd>{project.suggested_citation}</dd>
            </dl>
          </section>
          <section>
            <h2>The thesis, as the Canon states it</h2>
            <blockquote className="a-quote">{project.canon_core_thesis.map((l, i) => <span key={i}>{l}<br /></span>)}</blockquote>
          </section>
        </article>
        <aside className="a-aside">
          <div className="a-card a-stack">
            <div className="a-eyebrow">{COPY.gaps.downloads}</div>
            <ul className="a-list a-small">
              {DOWNLOADS.map(([name, label]) => <li key={name} style={{ padding: '6px 0' }}><a href={`/atlas/api/${name}`}>{label}</a></li>)}
            </ul>
            <p className="a-tiny">All downloads go through the protected route.</p>
          </div>
          <div className="a-card a-stack a-small">
            <div className="a-eyebrow">See also</div>
            <Link href="/atlas/gaps">{COPY.gaps.title}</Link>
            <Link href="/atlas/mechanisms">{COPY.mechanisms.title}</Link>
            <Link href="/atlas/terms">{COPY.terms.title}</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
