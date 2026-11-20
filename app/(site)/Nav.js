'use client'

import { useState } from 'react'

const LINKS = [
  ['About', '/about'],
  ['Books', '/books'],
  ['Projects', '/projects'],
  ['Field Notes', '/notes'],
  ['Certification', '/certification'],
  ['Golden Eight', '/golden-eight'],
  ['Store', '/store'],
  ['Speaking', '/speaking'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: '#17110B' }} className="fixed top-0 left-0 right-0 z-50 px-6 py-3.5 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 text-white font-semibold text-lg tracking-wide" onClick={() => setOpen(false)}>
          <img src="/brand/logo_mark_gold.png" alt="" className="h-8 w-auto" />
          <span style={{ fontFamily: 'Newsreader, Georgia, serif' }}>The Founded Project</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="text-gray-300 hover:text-white text-sm transition-colors">{label}</a>
          ))}
          <a href="/contact" style={{ backgroundColor: '#E0A45B', color: '#17110B' }} className="px-4 py-2 text-sm font-semibold rounded hover:opacity-90 transition-opacity">
            Connect
          </a>
        </div>
        <button
          className="md:hidden text-white p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(value => !value)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      {open && (
        <div id="mobile-navigation" className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2">
          <div className="flex flex-col gap-1">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-gray-200 hover:text-white text-base py-3">
                {label}
              </a>
            ))}
            <a href="/contact" onClick={() => setOpen(false)} style={{ backgroundColor: '#E0A45B', color: '#17110B' }} className="mt-2 px-4 py-3 text-sm font-semibold rounded text-center">
              Connect
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
