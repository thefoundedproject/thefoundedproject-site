'use client'
/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * Client list for Field Notes: All / Written / Video filter chips over a
 * chronological feed. Written notes link to their page; videos show the
 * YouTube thumbnail and link to their page, where the player embeds.
 */
import { useState } from 'react'

const GOLD = '#E0A45B'
const TEAL = '#17110B'

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function NotesList({ notes }) {
  const [filter, setFilter] = useState('all')
  const shown = notes.filter((n) =>
    filter === 'all' ? true : filter === 'post' ? n.type === 'post' : n.type === 'vlog'
  )

  const chips = [
    { key: 'all', label: 'All' },
    { key: 'post', label: 'Written' },
    { key: 'vlog', label: 'Video' },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-10">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors"
            style={
              filter === c.key
                ? { backgroundColor: TEAL, borderColor: TEAL, color: '#fff' }
                : { borderColor: '#d6cdbf', color: '#5b5245', backgroundColor: 'transparent' }
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-gray-500">
          {filter === 'vlog'
            ? 'The first video is on its way.'
            : 'The first note is on its way.'}
        </p>
      ) : (
        <div className="space-y-10">
          {shown.map((n) => (
            <a key={n.slug} href={`/notes/${n.slug}`} className="block group">
              <article className="grid md:grid-cols-5 gap-6 items-start">
                {n.type === 'vlog' && n.youtube ? (
                  <div className="md:col-span-2 relative rounded-lg overflow-hidden border border-black/10">
                    <img
                      src={`https://img.youtube.com/vi/${n.youtube}/hqdefault.jpg`}
                      alt=""
                      className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform"
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      aria-hidden
                    >
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: 'rgba(23,17,11,0.78)', color: GOLD }}
                      >
                        ▶
                      </span>
                    </span>
                  </div>
                ) : null}
                <div className={n.type === 'vlog' && n.youtube ? 'md:col-span-3' : 'md:col-span-5'}>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GOLD }}>
                    {n.type === 'vlog' ? 'Video' : 'Written'} · {fmtDate(n.date)}
                  </p>
                  <h2
                    className="text-2xl font-semibold mb-2 group-hover:underline underline-offset-4"
                    style={{ fontFamily: 'Newsreader, Georgia, serif', color: TEAL }}
                  >
                    {n.title}
                  </h2>
                  {n.excerpt ? (
                    <p className="text-gray-600 leading-relaxed">{n.excerpt}</p>
                  ) : null}
                  <p className="text-sm font-semibold mt-3" style={{ color: GOLD }}>
                    {n.type === 'vlog' ? 'Watch →' : 'Read →'}
                  </p>
                </div>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
