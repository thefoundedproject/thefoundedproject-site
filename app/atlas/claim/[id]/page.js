import Link from 'next/link'
import { notFound } from 'next/navigation'
import { project, claims, getClaim, getChapter, getSource, getChallenge, mechanismLabel } from '../../../../lib/atlas'
import { COPY, STATUS_LABEL, ROLE_LABEL } from '../../_components/copy'
import { Crumbs, Pill, StatusPill, Basis, SourceCard, Empty } from '../../_components/ui'
import { MarkButtons, BookmarkButton, RevisitButton, NoteBox } from '../../_components/Controls'
import ClaimPacket from '../../_components/ClaimPacket'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Evidence mode for one claim: the claim beside its sources and locators,
 * what the evidence establishes and does not, the strongest competing
 * explanation, and an exportable packet.
 */

export function generateStaticParams() {
  return claims.map((c) => ({ id: c.id }))
}

export function generateMetadata({ params }) {
  const c = getClaim(params.id)
  return { title: c ? `${c.id} · ${c.text.slice(0, 60)}` : 'Claim' }
}

function packetMarkdown(c, chapter, supporting, qualifying, challenges, related) {
  const L = []
  const line = (s = '') => L.push(s)
  line(`# Claim packet · ${c.id}`)
  line()
  line(`*${project.title}: ${project.subtitle} · Research Atlas, ${project.edition} · generated ${project.updated}*`)
  line()
  line(`**Chapter.** ${chapter.tag} · ${chapter.title} (Part ${chapter.part.numeral}: ${chapter.part.label})`)
  line()
  line(`## Claim`)
  line()
  line(`> ${c.text}`)
  line()
  line(`- Origin: ${c.text_origin}`)
  line(`- Type: ${c.type} (basis: ${c.type_basis})`)
  line(`- Importance: ${c.importance} (basis: ${c.importance_basis})`)
  line(`- Support: ${STATUS_LABEL[c.verification_status] || c.verification_status}. ${c.verification_detail}`)
  line(`- Review status: ${c.review_status}`)
  if (c.location) line(`- Location: ${c.location.section ? `“${c.location.section}”, paragraph ${c.location.paragraph}` : c.location.note || ''}${c.location.draft_version ? ` · ${c.location.draft_version}` : ''}${c.location_basis ? ` (basis: ${c.location_basis})` : ''}`)
  if (c.context) { line(); line(`## Paragraph around it`); line(); line(c.context) }
  line()
  line(`## Supporting sources (${supporting.length})`)
  line()
  if (!supporting.length) line('_None attached._')
  for (const s of supporting) {
    line(`- **${s.id}** [${ROLE_LABEL[s.evidentiary_role] || s.evidentiary_role} · ${s.source_type}] ${s.citation}`)
    if (s.pages_or_sections) line(`  - Locator: ${s.pages_or_sections}`)
    for (const u of s.urls) {
      const ls = s.link_status.find((l) => l.url === u)
      line(`  - ${u}${ls ? ` (${ls.result}${ls.status ? ` ${ls.status}` : ''}, checked ${ls.checked_at})` : ''}`)
    }
    if (s.use) line(`  - Validates: ${s.use}`)
    if (s.notes) line(`  - Footnote note: ${s.notes}`)
  }
  line()
  line(`## What the evidence establishes`)
  line()
  line(c.establishes || '_Not recorded yet._')
  line()
  line(`## What it does not establish`)
  line()
  line(c.does_not_establish || '_Not recorded yet._')
  line()
  line(`## Strongest competing explanation`)
  line()
  line(c.competing_explanation ? `${c.competing_explanation}${c.competing_explanation_basis ? ` _(basis: ${c.competing_explanation_basis})_` : ''}` : '_None mapped to this specific claim._')
  if (qualifying.length) {
    line(); line(`## Qualifying sources (${qualifying.length})`); line()
    for (const s of qualifying) line(`- **${s.id}** ${s.citation}`)
  }
  if (challenges.length) {
    line(); line(`## Challenge records (${challenges.length})`); line()
    for (const x of challenges) {
      line(`### ${x.id} · ${x.label} · ${x.resolution}`)
      line()
      line(`- Proposition: ${x.proposition}`)
      line(`- Objection: ${x.objection}`)
      if (x.response) line(`- Response: ${x.response}`)
      if (x.revision) line(`- Revision: ${x.revision}`)
      if (x.remaining_uncertainty) line(`- Remaining uncertainty: ${x.remaining_uncertainty}`)
      line()
    }
  }
  if (related.length) {
    line(`## Related claims`); line()
    for (const r of related) line(`- ${r.id}: ${r.text}`)
    line()
  }
  line(`---`)
  line(`Suggested citation: ${project.suggested_citation}`)
  return L.join('\n') + '\n'
}

export default function ClaimPage({ params }) {
  const c = getClaim(params.id)
  if (!c) notFound()
  const chapter = getChapter(c.chapter_id)
  const supporting = c.supporting_source_ids.map(getSource).filter(Boolean)
  const qualifying = c.qualifying_source_ids.map(getSource).filter(Boolean)
  const xs = c.challenge_ids.map(getChallenge).filter(Boolean)
  const related = c.related_claim_ids.map(getClaim).filter(Boolean)
  const md = packetMarkdown(c, chapter, supporting, qualifying, xs, related)
  const T = COPY.claim

  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ href: '/atlas/evidence', label: COPY.evidence.title }, { href: `/atlas/chapter/${chapter.id}`, label: chapter.tag }, { label: c.id }]} />
      <div className="a-two">
        <article className="a-stack-lg">
          <header className="a-stack">
            <div className="a-row">
              <span className="a-eyebrow">{T.eyebrow}</span>
              <span className="a-id">{c.id}</span>
              <Pill tone="mute">{c.text_origin}</Pill>
            </div>
            <p className="a-claim-text">{c.text}</p>
            <div className="a-row">
              <span><Pill tone="kind" title={COPY.evidence.typeHelp[c.type]}>{c.type}</Pill><Basis>{c.type_basis}</Basis></span>
              <span><Pill title={COPY.evidence.importanceHelp[c.importance]}>{c.importance}</Pill><Basis>{c.importance_basis}</Basis></span>
              <span><StatusPill status={c.verification_status} /><Basis>{c.verification_detail}</Basis></span>
            </div>
            <p className="a-tiny">{T.unreviewedNote}</p>
          </header>

          <section className="a-stack" aria-labelledby="loc-h">
            <div className="a-eyebrow" id="loc-h">{T.locationLabel}</div>
            <p>
              <Link href={`/atlas/chapter/${chapter.id}`}>{chapter.tag} · {chapter.title}</Link>
              {c.location?.section ? <> › “{c.location.section}”, paragraph {c.location.paragraph}</> : c.location?.note ? <> · {c.location.note}</> : <> · not pinned to a paragraph</>}
              {c.location?.draft_version && <span className="a-tiny"> · {c.location.draft_version}</span>}
            </p>
            {c.location_basis && <Basis>{c.location_basis}</Basis>}
            {c.context && (
              <details className="a-details"><summary>{T.contextLabel}</summary><div className="a-details-body"><p>{c.context}</p></div></details>
            )}
          </section>

          <section className="a-stack" aria-labelledby="sup-h">
            <div className="a-eyebrow" id="sup-h">{T.supportLabel} · {supporting.length}</div>
            {supporting.length ? supporting.map((s) => <SourceCard key={s.id} source={s} />) : <Empty>{T.noSources}</Empty>}
          </section>

          <section className="a-stack" aria-labelledby="est-h">
            <div className="a-eyebrow" id="est-h">{T.establishesLabel}</div>
            <p>{c.establishes || <Empty>{T.notRecorded}</Empty>}</p>
            <div className="a-eyebrow">{T.notEstablishesLabel}</div>
            <p>{c.does_not_establish || <Empty>{T.notRecorded}</Empty>}</p>
          </section>

          <section className="a-stack" aria-labelledby="comp-h">
            <div className="a-eyebrow" id="comp-h">{T.competingLabel}</div>
            {c.competing_explanation ? <><p>{c.competing_explanation}</p><Basis>{c.competing_explanation_basis}</Basis></> : <Empty>{T.noCompeting}</Empty>}
          </section>

          {qualifying.length > 0 && (
            <section className="a-stack" aria-labelledby="qual-h">
              <div className="a-eyebrow" id="qual-h">{T.qualifyingLabel} · {qualifying.length}</div>
              {qualifying.map((s) => <SourceCard key={s.id} source={s} compact />)}
            </section>
          )}

          <section className="a-stack" aria-labelledby="chal-h">
            <div className="a-eyebrow" id="chal-h">{T.challengesLabel} · {xs.length}</div>
            {xs.length === 0 && <Empty>None mapped.</Empty>}
            {xs.map((x) => (
              <details key={x.id} className="a-details">
                <summary><span className="a-row"><span className="a-id">{x.id}</span><Pill tone="mute">{x.label}</Pill><Pill>{COPY.challenge.resolutions[x.resolution] || x.resolution}</Pill><span>{x.proposition}</span></span></summary>
                <div className="a-details-body">
                  <p>{x.objection}</p>
                  {x.response && <p><strong>{COPY.challenge.fields.response}.</strong> {x.response}</p>}
                  {x.revision && <p><strong>{COPY.challenge.fields.revision}.</strong> {x.revision}</p>}
                  <Link href={`/atlas/challenge?id=${x.id}`} className="a-small">Open in the Challenge Room</Link>
                </div>
              </details>
            ))}
          </section>

          {related.length > 0 && (
            <section className="a-stack" aria-labelledby="rel-h">
              <div className="a-eyebrow" id="rel-h">{T.relatedLabel}</div>
              <ul className="a-bullets">{related.map((r) => <li key={r.id}><Link href={`/atlas/claim/${r.id}`}>{r.id}</Link> · {r.text}</li>)}</ul>
            </section>
          )}
        </article>

        <aside className="a-aside">
          <div className="a-card a-stack">
            <ClaimPacket filename={`${c.id}-claim-packet.md`} markdown={md} />
            <MarkButtons id={c.id} label={`${chapter.tag} · ${c.text.slice(0, 80)}`} href={`/atlas/claim/${c.id}`} kind="claim" compact />
            <div className="a-row">
              <BookmarkButton id={c.id} label={`${chapter.tag} · ${c.text.slice(0, 80)}`} href={`/atlas/claim/${c.id}`} kind="claim" />
              <RevisitButton id={c.id} label={`${chapter.tag} · ${c.text.slice(0, 80)}`} href={`/atlas/claim/${c.id}`} kind="claim" />
            </div>
          </div>
          {c.mechanisms.length > 0 && (
            <div className="a-card a-stack">
              <div className="a-eyebrow">Mechanisms</div>
              <div className="a-row">{c.mechanisms.map((m) => <Link key={m} href={`/atlas/mechanisms/${m}`} className="a-pill">{mechanismLabel(m)}</Link>)}</div>
            </div>
          )}
          <div className="a-card"><NoteBox id={c.id} /></div>
        </aside>
      </div>
    </div>
  )
}
