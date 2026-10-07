import Link from 'next/link'
import { notFound } from 'next/navigation'
import { chapters, getChapter, claimsFor, challengesFor, sourcesFor, mechanismLabel, stageLabel } from '../../../../lib/atlas'
import { COPY } from '../../_components/copy'
import { Crumbs, Pill, SourceCard, ClaimRow, Section, Empty } from '../../_components/ui'
import { Tabs, MarkButtons, BookmarkButton, RevisitButton, NoteBox, ChapterProgressBar } from '../../_components/Controls'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * The chapter atlas: overview first, then claims, sources, challenge, and
 * study prompts behind tabs, so nothing exposes the whole record at once.
 */

export function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }))
}

export function generateMetadata({ params }) {
  const c = getChapter(params.id)
  return { title: c ? `${c.tag} · ${c.title}` : 'Chapter' }
}

const VERDICT = { holds: 'ok', watch: undefined, 'needs-stephen': 'warn', 'not-applicable': 'mute', unparsed: 'mute' }
const VERDICT_LABEL = { holds: 'holds', watch: 'watch', 'needs-stephen': 'needs your decision', 'not-applicable': 'n/a', unparsed: 'unparsed' }

export default function ChapterPage({ params }) {
  const c = getChapter(params.id)
  if (!c) notFound()
  const claims = claimsFor(c.id)
  const challenges = challengesFor(c.id)
  const sources = sourcesFor(c.id)
  const prev = c.prev_id ? getChapter(c.prev_id) : null
  const next = c.next_id ? getChapter(c.next_id) : null
  const byRole = (role) => sources.filter((s) => s.evidentiary_role === role)
  const T = COPY.chapter

  const overview = (
    <div className="a-stack-lg a-measure">
      <section className="a-stack" aria-labelledby="th-h">
        <div className="a-eyebrow" id="th-h">{T.thesis}</div>
        <p className="a-claim-text">{c.thesis || <Empty>No core claim in the Overview.</Empty>}</p>
        <p className="a-tiny">{COPY.common.sourceOfText} {c.thesis_source}</p>
      </section>
      <section className="a-stack" aria-labelledby="fm-h">
        <div className="a-eyebrow" id="fm-h">{T.fiveMinute}</div>
        <dl className="a-kv" style={{ gridTemplateColumns: '120px 1fr' }}>
          <dt>{T.purpose}</dt><dd>{c.summary.purpose}</dd>
          <dt>{T.readerProblem}</dt><dd>{c.summary.reader_problem}</dd>
          <dt>{T.movement}</dt><dd>{c.summary.movement}</dd>
          <dt>{T.takeaway}</dt><dd>{c.summary.takeaway}</dd>
        </dl>
        <p className="a-tiny">{COPY.common.sourceOfText} {c.summary.source}</p>
      </section>
      <section className="a-stack" aria-labelledby="kc-h">
        <div className="a-eyebrow" id="kc-h">{T.keyConcepts}</div>
        <ul className="a-bullets">{c.key_concepts.map((k, i) => <li key={i}>{k}</li>)}</ul>
      </section>
      <section className="a-stack" aria-labelledby="mech-h">
        <div className="a-eyebrow" id="mech-h">{T.mechanisms}</div>
        <div className="a-row">{c.mechanisms.map((m) => <Link key={m.id} href={`/atlas/mechanisms/${m.id}`} className="a-pill" title={`Tagged from ${m.basis}`}>{mechanismLabel(m.id)}</Link>)}</div>
      </section>
      {c.related_chapter_ids.length > 0 && (
        <section className="a-stack" aria-labelledby="rel-h">
          <div className="a-eyebrow" id="rel-h">{T.related}</div>
          <div className="a-row">{c.related_chapter_ids.map((id) => <Link key={id} href={`/atlas/chapter/${id}`} className="a-pill">{getChapter(id)?.tag} · {getChapter(id)?.title}</Link>)}</div>
        </section>
      )}
      <details className="a-details"><summary>{T.architecture} · {c.draft.sections.length} sections · {c.draft.word_count} {COPY.common.words}</summary>
        <div className="a-details-body"><ol className="a-ol">{c.draft.sections.map((s, i) => <li key={i}>{s.heading} <span className="a-tiny">({s.paragraphs} ¶{s.footnotes.length ? `, notes: ${s.footnotes.join(', ')}` : ''})</span></li>)}</ol>
          {c.draft.editor_flags_stripped > 0 && <p className="a-tiny">{c.draft.editor_flags_stripped} editor markers were stripped from this chapter's text in the atlas.</p>}
        </div>
      </details>
      <details className="a-details"><summary>{T.coreTheory} and ecosystem connections</summary>
        <div className="a-details-body">
          <ul className="a-bullets">{c.related_core_theory.map((x, i) => <li key={i}>{x}</li>)}</ul>
          {c.ecosystem_connections.length > 0 && <ul className="a-bullets">{c.ecosystem_connections.map((x, i) => <li key={i}>{x}</li>)}</ul>}
        </div>
      </details>
      {c.pull_quotes.length > 0 && (
        <details className="a-details"><summary>{T.pullQuotes} · {c.pull_quotes.length}</summary>
          <div className="a-details-body">
            <ul className="a-bullets">{c.pull_quotes.map((q, i) => <li key={i}><em>“{q.text}”</em> <Pill tone={q.in_draft === 'yes' ? 'ok' : q.in_draft === 'no' ? 'warn' : undefined}>{T.pullQuoteState[q.in_draft]}</Pill></li>)}</ul>
          </div>
        </details>
      )}
      {c.opening_story.items.length > 0 && (
        <details className="a-details"><summary>Opening story candidates <Pill tone="mute">author-private</Pill></summary>
          <div className="a-details-body"><p className="a-tiny">{COPY.common.authorOnly}</p><ul className="a-bullets">{c.opening_story.items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        </details>
      )}
      <NoteBox id={c.id} />
    </div>
  )

  const claimsTab = (
    <div className="a-stack a-measure">
      <p className="a-small a-muted">{claims.length} claims: the core claim, every footnoted sentence in the draft, and every row of the Research Map's claim table. Open one to see it beside its sources.</p>
      <ul className="a-list">{claims.map((cl) => <ClaimRow key={cl.id} claim={cl} />)}</ul>
    </div>
  )

  const sourcesTab = (
    <div className="a-stack-lg a-measure" id="sources">
      {[['direct', 'Cited in the draft'], ['corroborating', 'In the Research Map, not cited inline'], ['adversarial', 'Evidence for a counterpoint'], ['contextual', 'Pointers to other chapters']].map(([role, label]) => {
        const rows = byRole(role)
        if (!rows.length) return null
        return (
          <section key={role} className="a-stack" aria-label={label}>
            <div className="a-eyebrow">{label} · {rows.length}</div>
            {rows.map((s) => <SourceCard key={s.id} source={s} showClaims />)}
          </section>
        )
      })}
      <details className="a-details"><summary>{T.research}: {c.research.pass_date || 'undated'} · {c.research.bucket_count} source threads</summary>
        <div className="a-details-body">
          <p className="a-small">{c.research.status}</p>
          <ol className="a-ol a-small">{c.research.buckets.map((b) => <li key={b.n}><strong>{b.title}</strong>{b.use ? <> · <span className="a-muted">{b.use}</span></> : null} <span className="a-tiny">{b.source_ids.join(', ')}</span></li>)}</ol>
        </div>
      </details>
    </div>
  )

  const challengeTab = (
    <div className="a-stack-lg a-measure" id="challenge">
      {c.contrarian_pressure && <p className="a-quote">{c.contrarian_pressure} <span className="a-tiny">(Overview › Contrarian Pressure Points)</span></p>}
      <div className="a-stack">
        {challenges.map((x) => (
          <details key={x.id} id={x.id} className="a-details">
            <summary>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="a-row"><span className="a-id">{x.id}</span><Pill tone="mute">{x.label}</Pill><Pill tone={x.resolution === 'no-change-needed' ? 'ok' : (x.resolution === 'needs-stephen' || x.resolution === 'open') ? 'warn' : undefined}>{COPY.challenge.resolutions[x.resolution] || x.resolution}</Pill></span>
                <span style={{ fontWeight: 500 }}>{x.proposition}</span>
              </span>
            </summary>
            <div className="a-details-body">
              <dl className="a-kv">
                <dt>{COPY.challenge.fields.objection}</dt><dd>{x.objection}</dd>
                {x.response && <><dt>{COPY.challenge.fields.response}</dt><dd>{x.response}</dd></>}
                {x.revision && <><dt>{COPY.challenge.fields.revision}</dt><dd>{x.revision}</dd></>}
                {x.remaining_uncertainty && <><dt>{COPY.challenge.fields.remaining}</dt><dd>{x.remaining_uncertainty}</dd></>}
                {x.claim_ids.length > 0 && <><dt>{COPY.challenge.fields.claims}</dt><dd className="a-row">{x.claim_ids.map((id) => <Link key={id} href={`/atlas/claim/${id}`} className="a-pill">{id}</Link>)}</dd></>}
              </dl>
            </div>
          </details>
        ))}
        {challenges.length === 0 && <Empty>No challenge record for this chapter.</Empty>}
      </div>
      <details className="a-details"><summary>{T.review} · applied to {c.review.applied_to || 'an earlier draft'}</summary>
        <div className="a-details-body">
          <ol className="a-ol a-small">{c.review.checks.map((k) => <li key={k.n}>{k.question} <Pill tone={VERDICT[k.verdict]}>{VERDICT_LABEL[k.verdict] || k.verdict}</Pill></li>)}</ol>
          {c.review.revisions.length > 0 && <><div className="a-eyebrow">{T.revisions}</div><ol className="a-ol a-small">{c.review.revisions.map((r, i) => <li key={i}>{r}</li>)}</ol></>}
          {c.review.open_issues.length > 0 && <><div className="a-eyebrow">{T.openIssues} <Pill tone="mute">author-private</Pill></div><ul className="a-bullets a-small">{c.review.open_issues.map((r, i) => <li key={i}>{r}</li>)}</ul></>}
        </div>
      </details>
    </div>
  )

  const studyTab = (
    <div className="a-stack-lg a-measure">
      <div className="a-row">
        {Object.entries(COPY.study.pathLabels).map(([k, label]) => <Link key={k} href={`/atlas/study/${c.id}?path=${k}`} className="a-btn a-btn-secondary a-btn-sm">{T.studyThis}: {label}</Link>)}
      </div>
      <section className="a-stack"><div className="a-eyebrow">{T.diagnostic}</div><ol className="a-ol">{c.study.diagnostic_questions.map((q, i) => <li key={i}>{q}</li>)}</ol></section>
      <section className="a-stack"><div className="a-eyebrow">{T.workbook}</div><ol className="a-ol">{c.study.workbook_questions.map((q, i) => <li key={i}>{q}</li>)}</ol></section>
      {c.study.inquiry_questions.items.length > 0 && (
        <details className="a-details"><summary>{T.inquiry} <Pill tone="mute">author-private</Pill></summary>
          <div className="a-details-body"><p className="a-tiny">{COPY.common.authorOnly}</p><ul className="a-bullets a-small">{c.study.inquiry_questions.items.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
        </details>
      )}
    </div>
  )

  return (
    <div className="a-stack-lg">
      <Crumbs items={[{ href: '/atlas/study', label: COPY.study.title }, { href: '/atlas/study', label: `Part ${c.part.numeral}` }, { label: c.tag }]} />
      <header className="a-stack">
        <div className="a-eyebrow">{c.tag} · Part {c.part.numeral}: {c.part.label} · {stageLabel(c.stage)}</div>
        <h1>{c.title}</h1>
        <div className="a-row">
          <Pill tone="mute">{c.draft.status || 'Draft'}</Pill>
          <Pill tone="mute">{c.draft.revised_date || c.draft.date}</Pill>
          <Pill>{c.counts.claims} {COPY.common.claims}</Pill>
          <Pill>{c.counts.sources} {COPY.common.sources}</Pill>
          <Pill>{c.counts.challenges} {COPY.common.challenges}</Pill>
          {c.counts.unsupported_claims > 0 && <Pill tone="warn">{c.counts.unsupported_claims} unsupported</Pill>}
        </div>
        <div className="a-row">
          <Link href={`/atlas/study/${c.id}?path=five`} className="a-btn a-btn-gold a-btn-sm">{T.studyThis} · {COPY.study.pathLabels.five}</Link>
          <MarkButtons id={c.id} label={`${c.tag} · ${c.title}`} href={`/atlas/chapter/${c.id}`} kind="chapter" compact />
          <BookmarkButton id={c.id} label={`${c.tag} · ${c.title}`} href={`/atlas/chapter/${c.id}`} kind="chapter" />
        </div>
        <ChapterProgressBar chapterId={c.id} total={6 + c.key_concepts.length + Math.min(3, Math.max(0, claims.length - 1)) + 1 + Math.min(3, c.study.diagnostic_questions.length)} />
      </header>

      <Tabs
        tabs={[
          { key: 'overview', label: T.tabs.overview, content: overview },
          { key: 'claims', label: T.tabs.claims, count: claims.length, content: claimsTab },
          { key: 'sources', label: T.tabs.sources, count: sources.length, content: sourcesTab },
          { key: 'challenge', label: T.tabs.challenge, count: challenges.length, content: challengeTab },
          { key: 'study', label: T.tabs.study, count: c.study.diagnostic_questions.length + c.study.workbook_questions.length, content: studyTab },
        ]}
      />

      <nav aria-label="Neighbouring chapters" className="a-row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--a-line)', paddingTop: 18 }}>
        {prev ? <Link href={`/atlas/chapter/${prev.id}`}>← {prev.tag} · {prev.title}</Link> : <span />}
        {next ? <Link href={`/atlas/chapter/${next.id}`}>{next.tag} · {next.title} →</Link> : <span />}
      </nav>
    </div>
  )
}
