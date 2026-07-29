/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 * A single Field Note: written notes render markdown; vlogs embed the
 * YouTube player above any written companion text.
 */
import { getNote, getNotes, renderMarkdown } from '../../../lib/notes'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getNotes().map((n) => ({ slug: n.slug }))
}

export function generateMetadata({ params }) {
  const note = getNote(params.slug)
  if (!note) return { title: 'Field Notes — The Founded Project' }
  return {
    title: `${note.title} — The Founded Project`,
    description: note.excerpt || undefined,
  }
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function NotePage({ params }) {
  const note = getNote(params.slug)
  if (!note) {
    return (
      <main className="pt-32 pb-24 px-6 text-center" style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>
        <p className="text-gray-600">That note isn&apos;t here. <a href="/notes" className="underline">Back to Field Notes</a>.</p>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-24 px-6" style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>
      <article className="max-w-3xl mx-auto">
        <a href="/notes" className="text-sm text-gray-500 hover:text-gray-800">← Field Notes</a>
        <p className="text-xs font-bold tracking-[0.2em] uppercase mt-6 mb-2" style={{ color: '#A66A3F' }}>
          {note.type === 'vlog' ? 'Video' : 'Written'} · {fmtDate(note.date)}
        </p>
        <h1
          className="text-3xl md:text-5xl font-semibold mb-8"
          style={{ fontFamily: 'Newsreader, Georgia, serif', color: '#17110B' }}
        >
          {note.title}
        </h1>

        {note.type === 'vlog' && note.youtube ? (
          <div className="rounded-lg overflow-hidden border border-black/10 mb-10 aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${note.youtube}`}
              title={note.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}

        <div
          className="note-body text-[17px] leading-[1.8] text-gray-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(note.body) }}
        />

        <div className="mt-14 pt-8 border-t" style={{ borderColor: 'rgba(23,17,11,0.12)' }}>
          <p className="text-sm text-gray-500">
            Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM · The Founded Project
          </p>
        </div>
      </article>
    </main>
  )
}
