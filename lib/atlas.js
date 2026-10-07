/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Research Atlas data access. The ledgers in atlas-data/ are produced by
 * scripts/atlas/build_atlas.py from the manuscript; the site reads these
 * structured records and never the manuscript itself.
 *
 * Server-side only. Pages import what they need and pass trimmed props to
 * client components, so no ledger ends up inside a public JavaScript chunk.
 */
import project from '../atlas-data/project.json'
import chapters from '../atlas-data/chapters.json'
import claims from '../atlas-data/claims.json'
import sources from '../atlas-data/sources.json'
import challenges from '../atlas-data/challenges.json'
import terms from '../atlas-data/terms.json'
import gaps from '../atlas-data/gaps.json'

const chapterById = new Map(chapters.map((c) => [c.id, c]))
const claimById = new Map(claims.map((c) => [c.id, c]))
const sourceById = new Map(sources.map((s) => [s.id, s]))
const challengeById = new Map(challenges.map((x) => [x.id, x]))
const termById = new Map(terms.map((t) => [t.id, t]))
const mechanismById = new Map(project.mechanisms.map((m) => [m.id, m]))

export { project, chapters, claims, sources, challenges, terms, gaps }

export const getChapter = (id) => chapterById.get(id) || null
export const getClaim = (id) => claimById.get(id) || null
export const getSource = (id) => sourceById.get(id) || null
export const getChallenge = (id) => challengeById.get(id) || null
export const getTerm = (id) => termById.get(id) || null
export const getMechanism = (id) => mechanismById.get(id) || null

export const claimsFor = (chapterId) => claims.filter((c) => c.chapter_id === chapterId)
export const challengesFor = (chapterId) => challenges.filter((x) => x.chapter_id === chapterId)
export const sourcesFor = (chapterId) =>
  (getChapter(chapterId)?.source_ids || []).map((id) => sourceById.get(id)).filter(Boolean)

export const partOf = (chapter) => project.parts.find((p) => p.numeral === chapter.part.numeral)
export const stageLabel = (stageId) => project.stages.find((s) => s.id === stageId)?.label || stageId
export const mechanismLabel = (id) => mechanismById.get(id)?.label || id
export const groupLabel = (id) => project.mechanism_groups.find((g) => g.id === id)?.label || id

/** Glossary term whose name appears in a piece of text (longest match first). */
export function termsIn(text) {
  const t = (text || '').toLowerCase()
  return terms
    .filter((term) => {
      const name = term.term.split(',')[0].toLowerCase()
      return name.length > 3 && new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t)
    })
    .sort((a, b) => b.term.length - a.term.length)
}

/** "Lead (year)" without repeating a year the lead already shows. */
export function leadWithYear(s) {
  if (!s.year || (s.lead || '').includes(s.year)) return s.lead
  return `${s.lead} (${s.year})`
}

/** A trimmed claim for lists and the evidence ledger. */
export function compactClaim(c) {
  return {
    id: c.id,
    chapter_id: c.chapter_id,
    chapter_number: c.chapter_number,
    part: c.part,
    stage: c.stage,
    text: c.text,
    origin: c.text_origin,
    type: c.type,
    importance: c.importance,
    status: c.verification_status,
    sources: c.supporting_source_ids.length,
    qualifying: c.qualifying_source_ids.length,
    challenges: c.challenge_ids.length,
    mechanisms: c.mechanisms,
    section: c.location?.section || null,
  }
}

/** A trimmed source for lists. */
export function compactSource(s) {
  return {
    id: s.id,
    lead: s.lead,
    citation: s.citation,
    year: s.year,
    type: s.source_type,
    role: s.evidentiary_role,
    chapters: s.chapter_ids,
    claims: s.claims_supported.length,
    links: s.link_status.map((l) => l.result),
    urls: s.urls,
  }
}

/**
 * The global search index: one compact row per chapter, claim, source,
 * challenge, and term. Served through the protected /atlas/api/index route
 * and searched in the browser.
 */
export function searchIndex() {
  const rows = []
  for (const c of chapters) {
    rows.push({
      id: c.id, kind: 'chapter', href: `/atlas/chapter/${c.id}`,
      title: `${c.tag} · ${c.title}`,
      text: [c.thesis, c.summary.purpose, ...c.key_concepts].join(' '),
      chapter: c.id, part: c.part.numeral, stage: c.stage, tags: c.mechanisms.map((m) => m.id),
    })
  }
  for (const c of claims) {
    const ch = chapterById.get(c.chapter_id)
    rows.push({
      id: c.id, kind: 'claim', href: `/atlas/claim/${c.id}`,
      title: c.text.length > 110 ? c.text.slice(0, 107) + '…' : c.text,
      text: [c.text, c.establishes || '', c.competing_explanation || '', ch?.title || ''].join(' '),
      chapter: c.chapter_id, part: c.part, stage: c.stage, tags: c.mechanisms,
      type: c.type, status: c.verification_status, importance: c.importance,
    })
  }
  for (const s of sources) {
    rows.push({
      id: s.id, kind: 'source', href: `/atlas/source/${s.id}`,
      title: leadWithYear(s),
      text: [s.citation, s.use || '', s.notes || ''].join(' '),
      chapter: s.chapter_ids[0], part: chapterById.get(s.chapter_ids[0])?.part.numeral, stage: chapterById.get(s.chapter_ids[0])?.stage,
      tags: [], sourceType: s.source_type, role: s.evidentiary_role,
    })
  }
  for (const x of challenges) {
    const ch = chapterById.get(x.chapter_id)
    rows.push({
      id: x.id, kind: 'challenge', href: `/atlas/challenge?id=${x.id}`,
      title: `${ch?.tag || ''} ${x.label} · ${x.proposition.length > 90 ? x.proposition.slice(0, 87) + '…' : x.proposition}`,
      text: [x.proposition, x.objection, x.response || ''].join(' '),
      chapter: x.chapter_id, part: ch?.part.numeral, stage: ch?.stage, tags: x.mechanisms, resolution: x.resolution,
    })
  }
  for (const t of terms) {
    rows.push({
      id: t.id, kind: 'term', href: `/atlas/terms#${t.id}`,
      title: t.term,
      text: [t.working_definition, t.plain_language, t.what_it_is_not].join(' '),
      chapter: t.chapter_ids[0] || null, part: null, stage: null, tags: t.mechanism_ids,
    })
  }
  return rows
}
