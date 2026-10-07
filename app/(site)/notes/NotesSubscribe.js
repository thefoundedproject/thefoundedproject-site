'use client'
/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 * Light-surface subscribe box for the Field Notes page. Posts to the same
 * /api/subscribe endpoint as the homepage form.
 */
import { useState } from 'react'

export default function NotesSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
    setStatus('sending')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
    } catch {}
    setStatus('success')
  }

  return (
    <div className="mt-16 rounded-lg border p-6 md:p-8" style={{ borderColor: 'rgba(224,164,91,0.4)', backgroundColor: 'rgba(224,164,91,0.06)' }}>
      {status === 'success' ? (
        <p className="text-gray-700">
          You&apos;re on the list. New notes and videos come to your inbox when they publish.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Newsreader, Georgia, serif', color: '#17110B' }}>
            Get new notes by email
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Essays and videos as they publish. No spam, unsubscribe anytime. Prefer a reader?{' '}
            <a href="/feed.xml" className="underline" style={{ color: '#A66A3F' }}>RSS feed</a>.
          </p>
          <form onSubmit={submit} className="flex gap-2 flex-wrap">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-[220px] rounded border px-4 py-2.5 text-sm"
              style={{ borderColor: '#d6cdbf', backgroundColor: '#fff' }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-5 py-2.5 rounded text-sm font-semibold"
              style={{ backgroundColor: '#E0A45B', color: '#17110B' }}
            >
              {status === 'sending' ? '…' : 'Subscribe'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
