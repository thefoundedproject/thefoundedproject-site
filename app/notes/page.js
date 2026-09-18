/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Field Notes — the blog and vlog surface. One chronological feed of
 * written notes and videos, filterable, with email + RSS subscription.
 * Two sources merge here: local notes in content/notes/*.md (publishing is a
 * git push) and Substack essays from its public feed, which link out to
 * Substack as the canonical home.
 */
import { getNotes } from '../../lib/notes'
import { getSubstackPosts } from '../../lib/substack'
import NotesList from './NotesList'
import NotesSubscribe from './NotesSubscribe'

export const metadata = {
  alternates: { canonical: '/notes' },
  title: 'Field Notes — The Founded Project',
  description:
    'Essays and video from Dr. Stephen Thompson on personal governance, agency, and building The Founded Project in the open.',
}

// Was force-static, which froze the list at build time. An hourly revalidate
// lets a new Substack essay appear here without anyone redeploying the site.
// Next needs this as a literal, so it must stay equal to SUBSTACK_REVALIDATE.
export const revalidate = 3600

export default async function NotesPage() {
  const local = getNotes()
  // An essay published here first and later sent through Substack exists in
  // both places. Show it once, from here: match on the substack: URL a note
  // records, with the title as a fallback for notes that don't record one.
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const claimedUrls = new Set(local.map((n) => n.substack).filter(Boolean))
  const claimedTitles = new Set(local.map((n) => norm(n.title)))
  const substack = (await getSubstackPosts()).filter(
    (s) => !claimedUrls.has(s.href) && !claimedTitles.has(norm(s.title))
  )
  const notes = [...local, ...substack].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <main className="pt-24 pb-24 px-6" style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#A66A3F' }}>
          Field Notes
        </p>
        <h1
          className="text-4xl md:text-5xl font-semibold mb-4"
          style={{ fontFamily: 'Newsreader, Georgia, serif', color: '#17110B' }}
        >
          Written and spoken, as the work happens.
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl">
          Essays and video on personal governance, agency, and building this
          ecosystem in the open. Essays publish on Substack and show up here
          on their own.
        </p>

        <NotesList notes={notes.map(({ body, ...rest }) => rest)} />
        <NotesSubscribe />
      </div>
    </main>
  )
}
