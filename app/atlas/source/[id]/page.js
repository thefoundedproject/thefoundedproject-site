import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sources, getSource, getClaim, getChapter, getChallenge } from '../../../../lib/atlas'
import { COPY, ROLE_LABEL } from '../../_components/copy'
import { Crumbs, Pill, Basis, Empty, linkTone, linkLabel } from '../../_components/ui'
import { MarkButtons, BookmarkButton, NoteBox } from '../../_components/Controls'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * One source record: citation, classification with its basis, link state,
 * what it validates, and every claim it supports or qualifies.
 */

export function generateStaticParams() {
  return sources.map((s) => ({ id: s.id }))
}

export function generateMetadata({ params }) {
  const s = getSource(params.id)
  return { title: s ? `${s.id} · ${s.lead}` : 'Source' }
}

export default function SourcePage({ params }) {
  const s = getSource(params.id)
  if (!s) notFound()
  const T = COPY.source
  const supports = s.claims_supported.map(getClaim).filter(Boolean)
  const qualifies = s.claims_qualified.map(getClaim).filter(Boolean)
  const xs = s.challenge_ids.map(getChallenge).filter(Boolean)
  const target = s.points_to ? getSource(s.points_to) : null
  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ href: '/atlas/evidence', label: COPY.evidence.title }, { label: s.id }]} />
      <div className="a-two">
        <article className="a-stack-lg a-measure">
          <header className="a-stack">
            <div className="a-row">
              <span className="a-eyebrow">{T.eyebrow}</span>
              <span className="a-id">{s.id}</span>
              <Pill tone={s.evidentiary_role === 'direct' ? 'ok' : s.evidentiary_role === 'adversarial' ? 'warn' : undefined}>{ROLE_LABEL[s.evidentiary_role] || s.evidentiary_role}</Pill>
              <Pill>{s.source_type}</Pill>
              <Pill tone="mute">{s.designation}</Pill>
            </div>
            <h1 style={{ fontSize: '1.6rem' }}>{s.lead}{s.year && !s.lead.includes(s.year) ? <span className="a-muted"> ({s.year})</span> : null}</h1>
            <p className="a-cite">{s.citation}</p>
            <div className="a-stack a-small">
              <Basis>role: {s.role_basis}</Basis>
              <Basis>type: {s.source_type_basis}</Basis>
              <Basis>designation: {s.designation_basis}</Basis>
            </div>
            {target && <p className="a-small">{T.pointsTo} <Link href={`/atlas/source/${target.id}`}>{target.id} · {target.lead}</Link></p>}
          </header>

          <section className="a-stack" aria-labelledby="links-h">
            <div className="a-eyebrow" id="links-h">{T.linksLabel}</div>
            {s.urls.length === 0 && <Empty>{T.noLinks}</Empty>}
            <ul className="a-list">
              {s.urls.map((u) => {
                const ls = s.link_status.find((l) => l.url === u)
                return (
                  <li key={u} className="a-small">
                    <a href={u} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{u}</a>
                    {ls && <> {' '}<Pill tone={linkTone(ls.result)}>{linkLabel(ls.result)}{ls.status ? ` ${ls.status}` : ''}</Pill> <span className="a-tiny">checked {ls.checked_at}{ls.final_url && ls.final_url !== u ? ` · redirects to ${ls.final_url}` : ''}</span></>}
                  </li>
                )
              })}
            </ul>
            {s.pages_or_sections && <p className="a-small">Locator in citation: {s.pages_or_sections}</p>}
            {s.doi && <p className="a-small">DOI: {s.doi}</p>}
          </section>

          {(s.use || s.notes) && (
            <section className="a-stack" aria-labelledby="use-h">
              <div className="a-eyebrow" id="use-h">What it establishes</div>
              {s.use && <p><strong>{T.useLabel}.</strong> {s.use}</p>}
              {s.notes && <p><strong>{T.notesLabel}.</strong> {s.notes}</p>}
            </section>
          )}

          <section className="a-stack" aria-labelledby="claims-h">
            <div className="a-eyebrow" id="claims-h">{T.claimsLabel} · {supports.length}</div>
            {supports.length === 0 && <Empty>None yet.</Empty>}
            <ul className="a-list">{supports.map((c) => <li key={c.id}><span className="a-id">{c.id}</span> <Pill tone="mute">{getChapter(c.chapter_id)?.tag}</Pill><br /><Link href={`/atlas/claim/${c.id}`}>{c.text}</Link></li>)}</ul>
          </section>

          {qualifies.length > 0 && (
            <section className="a-stack" aria-labelledby="qual-h">
              <div className="a-eyebrow" id="qual-h">{T.qualifiesLabel} · {qualifies.length}</div>
              <ul className="a-list">{qualifies.map((c) => <li key={c.id}><span className="a-id">{c.id}</span><br /><Link href={`/atlas/claim/${c.id}`}>{c.text}</Link></li>)}</ul>
            </section>
          )}

          {xs.length > 0 && (
            <section className="a-stack" aria-labelledby="xs-h">
              <div className="a-eyebrow" id="xs-h">{T.challengesLabel} · {xs.length}</div>
              <ul className="a-list">{xs.map((x) => <li key={x.id}><Link href={`/atlas/challenge?id=${x.id}`}>{x.id} · {x.label}</Link> · {x.proposition}</li>)}</ul>
            </section>
          )}

          <details className="a-details"><summary>{T.appearancesLabel} · {s.appearances.length}</summary>
            <div className="a-details-body">
              <ul className="a-bullets a-small">{s.appearances.map((a, i) => <li key={i}><Link href={`/atlas/chapter/${a.chapter_id}`}>{getChapter(a.chapter_id)?.tag}</Link> · {a.origin} · {a.ident}<br /><span className="a-muted">{a.citation}</span></li>)}</ul>
            </div>
          </details>
          {s.possible_duplicates.length > 0 && (
            <p className="a-small a-muted">{T.duplicates} {s.possible_duplicates.map((id, i) => <span key={id}>{i > 0 && ', '}<Link href={`/atlas/source/${id}`}>{id}</Link></span>)}.</p>
          )}
        </article>

        <aside className="a-aside">
          <div className="a-card a-stack">
            <div className="a-eyebrow">Chapters</div>
            <div className="a-row">{s.chapter_ids.map((id) => <Link key={id} href={`/atlas/chapter/${id}#sources`} className="a-pill">{getChapter(id)?.tag}</Link>)}</div>
            <MarkButtons id={s.id} label={s.lead} href={`/atlas/source/${s.id}`} kind="source" compact />
            <BookmarkButton id={s.id} label={s.lead} href={`/atlas/source/${s.id}`} kind="source" />
          </div>
          <div className="a-card"><NoteBox id={s.id} /></div>
        </aside>
      </div>
    </div>
  )
}
