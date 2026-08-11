/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * Consider Otherwise — the join door.
 *
 * Every path onto the show runs through this page, because the rules have to be
 * a gate rather than a notice. Agreeing is what produces the invite link, and
 * the link carries the queue parameter that lands a guest on a hold screen
 * instead of on air.
 */

import JoinGate from './JoinGate'

export const metadata = {
  title: 'Join the conversation | Consider Otherwise',
  description:
    'Consider Otherwise is a live conversation show with fact checking. Read the rules, agree to them, and get your link to join the room.',
}

export default function Join() {
  return (
    <main style={{ backgroundColor: '#F5F0E8' }} className="min-h-screen px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-3">
          Consider Otherwise · Life Conversations
        </p>
        <h1 style={{ color: '#0F1B1F' }} className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
          Bring me your argument.
        </h1>
        <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 620 }} className="mb-6">
          This is a live conversation show. Guests, callers, and whatever the day put in front of
          all of us. Everybody gets time. When a claim comes up that we can check, we stop and
          check it on air with RhetoricalPoints.
        </p>
        <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 620 }} className="mb-16">
          Three rules hold the room. They&apos;re short, they&apos;re not negotiable, and reading
          them is how you get in.
        </p>

        <JoinGate />

        <p style={{ color: 'rgba(15,27,31,0.45)', fontSize: 14, lineHeight: 1.7, maxWidth: 620 }} className="mt-16">
          Questions before you commit to anything?{' '}
          <a href="/contact" style={{ color: '#9E6F2C', fontWeight: 600, textDecoration: 'underline' }}>
            Ask first
          </a>
          . Nobody has to walk into a live room cold.
        </p>
      </div>
    </main>
  )
}
