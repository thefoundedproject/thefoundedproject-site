import { NextResponse } from 'next/server'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Password gate for the Research Atlas. HTTP Basic Auth on /atlas and every
 * path beneath it, including the data routes under /atlas/api.
 *
 * The password is the ATLAS_PASSWORD environment variable, set in the Railway
 * dashboard and never committed. The gate fails closed: when the variable is
 * missing the atlas answers 503 and serves nothing. The username is not
 * checked; there is one reader.
 *
 * Nothing atlas-related lives in public/, because files there are served
 * without passing through this file.
 */

const REALM = 'Research Atlas'

function denied(status, body) {
  return new NextResponse(body, {
    status,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}

/** Constant-time string comparison so response timing does not leak the password. */
function sameSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

export function middleware(request) {
  const expected = process.env.ATLAS_PASSWORD
  if (!expected) {
    return denied(503, 'The Research Atlas is not configured on this server.')
  }

  const header = request.headers.get('authorization') || ''
  if (!header.toLowerCase().startsWith('basic ')) {
    return denied(401, 'Authentication required.')
  }

  let supplied = ''
  try {
    const decoded = atob(header.slice(6).trim())
    const colon = decoded.indexOf(':')
    supplied = colon === -1 ? decoded : decoded.slice(colon + 1)
  } catch {
    return denied(401, 'Authentication required.')
  }

  if (!sameSecret(supplied, expected)) {
    return denied(401, 'Authentication required.')
  }

  const response = NextResponse.next()
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.headers.set('Cache-Control', 'private, no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}

export const config = {
  matcher: ['/atlas', '/atlas/:path*'],
}
