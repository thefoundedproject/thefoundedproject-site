'use client'

/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * The agreement gate. The rules are the door rather than a disclaimer, so the
 * invite link does not exist on the page until the box is checked. That is the
 * whole mechanism: agreeing is what produces the link.
 */

import { useState } from 'react'
import { RULES, RETENTION_MONTHS, inviteLink } from './config'

const GOLD = '#D8AB69'
const INK = '#0F1B1F'
const DEEP = '#17110B'

function Rule({ index, rule, gloss }) {
  return (
    <li style={{ borderTop: '1px solid rgba(15,27,31,0.12)', padding: '26px 0', listStyle: 'none' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <span style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <p style={{ color: INK, fontSize: 20, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{rule}</p>
          <p style={{ color: 'rgba(15,27,31,0.62)', fontSize: 15, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{gloss}</p>
        </div>
      </div>
    </li>
  )
}

/**
 * Shown instead of the gate when no retention period is set. A caller sees
 * something calm and true. Locally, the exact fix comes with it, so this can
 * never ship as a mystery.
 */
function NotOpenYet() {
  return (
    <div style={{ backgroundColor: 'rgba(15,27,31,0.04)', border: '1px solid rgba(15,27,31,0.12)', borderRadius: 6, padding: '28px 26px' }}>
      <p style={{ color: INK, fontSize: 17, fontWeight: 600, margin: 0 }}>Call-in isn&apos;t open yet.</p>
      <p style={{ color: 'rgba(15,27,31,0.62)', fontSize: 15, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
        The show is still in production. When callers open, this is where the link will be.
      </p>
      {process.env.NODE_ENV !== 'production' && (
        <p style={{ color: '#9E6F2C', fontSize: 13, lineHeight: 1.6, marginTop: 18, marginBottom: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
          Dev note: set RETENTION_MONTHS in config.js. The gate stays closed until a caller
          can be told how long their note is kept.
        </p>
      )}
    </div>
  )
}

export default function JoinGate() {
  const [agreed, setAgreed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  if (RETENTION_MONTHS === null || RETENTION_MONTHS === undefined) return <NotOpenYet />

  const link = inviteLink()

  return (
    <div>
      <ol style={{ margin: '0 0 40px', padding: 0 }}>
        {RULES.map((r, i) => <Rule key={r.rule} index={i} {...r} />)}
      </ol>

      <div style={{ borderTop: '1px solid rgba(15,27,31,0.12)', paddingTop: 32, marginBottom: 40 }}>
        <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          The same rules apply to the host
        </p>
        <p style={{ color: 'rgba(15,27,31,0.72)', fontSize: 16, lineHeight: 1.75, margin: 0, maxWidth: 620 }}>
          When Stephen makes a claim we can check, we check it the same way, with the same
          instrument, on air. That is not a courtesy extended to guests. It is the reason the
          show exists.
        </p>
      </div>

      <div style={{ borderTop: '1px solid rgba(15,27,31,0.12)', paddingTop: 32, marginBottom: 40 }}>
        <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          What we keep
        </p>
        <p style={{ color: 'rgba(15,27,31,0.72)', fontSize: 16, lineHeight: 1.75, margin: 0, maxWidth: 620 }}>
          The show is recorded and broadcast. Afterward we keep a short note: what we discussed
          and which claims we checked. If you come back, that note is what we read, so you don&apos;t
          have to start over. We keep it for {RETENTION_MONTHS} months. We don&apos;t keep a
          judgment about you, and on air you are only ever first name, your city if you agree to
          it, and your topic.
        </p>
      </div>

      {!revealed ? (
        <div>
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 22 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: 20, height: 20, marginTop: 2, accentColor: GOLD, flexShrink: 0, cursor: 'pointer' }}
            />
            <span style={{ color: INK, fontSize: 16, lineHeight: 1.6 }}>
              I&apos;ve read the rules and I agree to them.
            </span>
          </label>
          <button
            type="button"
            disabled={!agreed}
            onClick={() => setRevealed(true)}
            style={{
              backgroundColor: agreed ? DEEP : 'rgba(15,27,31,0.12)',
              color: agreed ? '#F5F0E8' : 'rgba(15,27,31,0.4)',
              border: 'none',
              borderRadius: 4,
              padding: '15px 30px',
              fontSize: 15,
              fontWeight: 600,
              cursor: agreed ? 'pointer' : 'not-allowed',
              transition: 'background-color 160ms ease',
            }}
          >
            Get my link
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: DEEP, borderRadius: 6, padding: '32px 28px' }}>
          <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
            Your link
          </p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#F5F0E8', fontSize: 17, fontWeight: 600, textDecoration: 'underline', wordBreak: 'break-all', lineHeight: 1.5 }}
          >
            {link}
          </a>
          <p style={{ color: 'rgba(245,240,232,0.72)', fontSize: 15, lineHeight: 1.75, marginTop: 24, marginBottom: 0 }}>
            Open it when you&apos;re ready. Your browser will ask for your camera and microphone,
            then you&apos;ll land on a hold screen. You are not on air there. Stephen can see and
            hear you while you wait, and he brings you in when it&apos;s your turn.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 14, lineHeight: 1.7, marginTop: 16, marginBottom: 0 }}>
            Use headphones. Chrome, Edge, or Safari. The link is yours, so please don&apos;t pass
            it on; whoever you send it to hasn&apos;t agreed to anything.
          </p>
        </div>
      )}
    </div>
  )
}
