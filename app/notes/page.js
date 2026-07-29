/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Field Notes — the blog and vlog surface. One chronological feed of
 * written notes and videos, filterable, with email + RSS subscription.
 * Content lives in content/notes/*.md; publishing is a git push.
 */
import { getNotes } from '../../lib/notes'
import NotesList from './NotesList'
import NotesSubscribe from './NotesSubscribe'

export const metadata = {
  title: 'Field Notes — The Founded Project',
  description:
    'Essays and video from Dr. Stephen Thompson on personal governance, agency, and building The Founded Project in the open.',
}

export const dynamic = 'force-static'

export default function NotesPage() {
  const notes = getNotes()
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
          ecosystem in the open. New entries publish here first.
        </p>

        <NotesList notes={notes.map(({ body, ...rest }) => rest)} />
        <NotesSubscribe />
      </div>
    </main>
  )
}
