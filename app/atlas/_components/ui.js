/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Presentational pieces shared by atlas pages. No state, no browser APIs,
 * so they render on the server and inside client components alike.
 */
import Link from 'next/link'
import { COPY, STATUS_LABEL, ROLE_LABEL } from './copy'

export function Crumbs({ items }) {
  return (
    <nav aria-label="You are here" className="a-small a-muted" style={{ marginBottom: 18 }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <li><Link href="/atlas">{COPY.brand.sub}</Link></li>
        {items.map((it, i) => (
          <li key={i} style={{ display: 'flex', gap: 6 }}>
            <span aria-hidden="true" style={{ color: 'var(--a-accent)' }}>›</span>
            {it.href && i < items.length - 1 ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Pill({ children, tone, title }) {
  const cls = ['a-pill', tone === 'kind' && 'a-pill-kind', tone === 'ok' && 'a-pill-ok', tone === 'warn' && 'a-pill-warn', tone === 'mute' && 'a-pill-mute']
    .filter(Boolean).join(' ')
  return <span className={cls} title={title}>{children}</span>
}

export function StatusPill({ status }) {
  const tone = status === 'cited' ? 'ok' : status === 'unsupported' ? 'warn' : status === 'argued' ? 'kind' : undefined
  return <Pill tone={tone} title={COPY.evidence.statusHelp[status]}>{STATUS_LABEL[status] || status}</Pill>
}

export function Basis({ children }) {
  if (!children) return null
  return <span className="a-basis">{COPY.claim.classificationBasis}: {children}</span>
}

export function Section({ id, eyebrow, title, children, aside }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="a-stack" style={{ marginTop: 32 }}>
      <div className="a-row" style={{ justifyContent: 'space-between' }}>
        <div>
          {eyebrow && <div className="a-eyebrow">{eyebrow}</div>}
          <h2 id={id ? `${id}-h` : undefined}>{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Empty({ children }) {
  return <p className="a-muted a-small" style={{ fontStyle: 'italic' }}>{children}</p>
}

export function linkTone(result) {
  if (result === 'reachable') return 'ok'
  if (result === 'blocked') return 'mute'
  return 'warn'
}

export function linkLabel(result) {
  if (!result) return ''
  if (result.startsWith('unreachable')) return COPY.source.linkStates.unreachable
  return COPY.source.linkStates[result] || result
}

export function SourceCard({ source, compact = false, showClaims = false }) {
  const s = source
  return (
    <article className="a-source-card" id={s.id}>
      <div className="a-row" style={{ marginBottom: 8 }}>
        <span className="a-id">{s.id}</span>
        <Pill tone={s.evidentiary_role === 'direct' ? 'ok' : s.evidentiary_role === 'adversarial' ? 'warn' : undefined} title={s.role_basis}>
          {ROLE_LABEL[s.evidentiary_role] || s.evidentiary_role}
        </Pill>
        <Pill title={s.source_type_basis}>{s.source_type}</Pill>
        {s.year && <Pill tone="mute">{s.year}</Pill>}
      </div>
      <p className="a-cite">
        <Link href={`/atlas/source/${s.id}`} style={{ fontWeight: 600 }}>{s.lead}</Link>
        {s.citation_core && s.citation_core !== s.lead ? <>{' '}<span className="a-muted">{s.citation_core.replace(s.lead, '').replace(/^[,.\s]+/, '')}</span></> : null}
      </p>
      {s.pages_or_sections && <p className="a-tiny">Locator: {s.pages_or_sections}</p>}
      {s.urls.length > 0 && (
        <ul className="a-list a-small" style={{ marginTop: 8 }}>
          {s.urls.map((u) => {
            const ls = s.link_status.find((l) => l.url === u)
            return (
              <li key={u} style={{ border: 0, padding: '2px 0' }}>
                <a href={u} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{u}</a>
                {ls && <> {' '}<Pill tone={linkTone(ls.result)} title={`checked ${ls.checked_at}`}>{linkLabel(ls.result)}{ls.status ? ` ${ls.status}` : ''}</Pill></>}
              </li>
            )
          })}
        </ul>
      )}
      {!compact && (s.use || s.notes) && (
        <details className="a-small" style={{ marginTop: 10 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--a-ink-2)' }}>What it establishes and where it is limited</summary>
          <div className="a-stack" style={{ marginTop: 8 }}>
            {s.use && <p><strong>{COPY.source.useLabel}.</strong> {s.use}</p>}
            {s.notes && <p><strong>{COPY.source.notesLabel}.</strong> {s.notes}</p>}
          </div>
        </details>
      )}
      {showClaims && s.claims_supported.length > 0 && (
        <p className="a-tiny" style={{ marginTop: 8 }}>
          Supports {s.claims_supported.length} claim{s.claims_supported.length === 1 ? '' : 's'}: {s.claims_supported.slice(0, 6).map((id, i) => <span key={id}>{i > 0 && ', '}<Link href={`/atlas/claim/${id}`}>{id}</Link></span>)}{s.claims_supported.length > 6 ? ' …' : ''}
        </p>
      )}
    </article>
  )
}

export function ClaimRow({ claim, chapterTag }) {
  const c = claim
  return (
    <li>
      <div className="a-row" style={{ marginBottom: 6 }}>
        <span className="a-id">{c.id}</span>
        {chapterTag && <Pill tone="mute">{chapterTag}</Pill>}
        <Pill tone="kind" title={COPY.evidence.typeHelp[c.type]}>{c.type}</Pill>
        <Pill title={COPY.evidence.importanceHelp[c.importance]}>{c.importance}</Pill>
        <StatusPill status={c.status || c.verification_status} />
      </div>
      <p><Link href={`/atlas/claim/${c.id}`}>{c.text}</Link></p>
      {(c.section || c.location?.section) && <p className="a-tiny">§ {c.section || c.location.section}</p>}
    </li>
  )
}

export function ChapterCard({ chapter, progress }) {
  const c = chapter
  const pct = progress?.total ? Math.round((progress.done / progress.total) * 100) : null
  return (
    <Link href={`/atlas/chapter/${c.id}`} className="a-door" style={{ padding: '16px 18px' }}>
      <div className="a-eyebrow">{c.tag} · Part {c.part.numeral}</div>
      <h2 style={{ fontSize: '1.15rem', marginTop: 4 }}>{c.title}</h2>
      <p className="a-small a-muted" style={{ marginTop: 6 }}>{c.counts.claims} {COPY.common.claims} · {c.counts.sources} {COPY.common.sources} · {c.counts.challenges} {COPY.common.challenges}</p>
      {pct != null && (
        <div style={{ marginTop: 10 }} aria-label={`${pct}% of study cards marked`}>
          <div className="a-progress"><span style={{ width: `${pct}%` }} /></div>
        </div>
      )}
    </Link>
  )
}
