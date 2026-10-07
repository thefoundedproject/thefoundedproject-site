import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { project, chapters, claims, sources, challenges, terms, gaps, searchIndex } from '../../../../lib/atlas'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Protected data route for the Research Atlas. Everything here sits under
 * /atlas, so the password middleware runs first. Responses are never cached
 * and never indexed.
 *
 *   /atlas/api/index            search index (compact rows)
 *   /atlas/api/project|chapters|claims|sources|challenges|terms|gaps
 *   /atlas/api/claims.csv       (and sources.csv, chapters.csv, challenges.csv, terms.csv)
 *   /atlas/api/master-dossier.md, gap-report.md, link-validation.json, id-registry.json
 */

export const dynamic = 'force-dynamic'

const JSON_SETS = { project, chapters, claims, sources, challenges, terms, gaps }
const FILES = {
  'claims.csv': 'text/csv',
  'sources.csv': 'text/csv',
  'chapters.csv': 'text/csv',
  'challenges.csv': 'text/csv',
  'terms.csv': 'text/csv',
  'master-dossier.md': 'text/markdown',
  'gap-report.md': 'text/markdown',
  'link-validation.json': 'application/json',
  'id-registry.json': 'application/json',
}

const HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

export function GET(_request, { params }) {
  const name = params.name
  if (name === 'index') {
    return NextResponse.json(searchIndex(), { headers: HEADERS })
  }
  if (name in JSON_SETS) {
    return NextResponse.json(JSON_SETS[name], { headers: HEADERS })
  }
  if (name in FILES) {
    const file = path.join(process.cwd(), 'atlas-data', name)
    if (!fs.existsSync(file)) {
      return new NextResponse('Not generated yet. Run scripts/atlas/build_atlas.py.', { status: 404, headers: HEADERS })
    }
    return new NextResponse(fs.readFileSync(file, 'utf8'), {
      headers: {
        ...HEADERS,
        'Content-Type': `${FILES[name]}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="founded-atlas-${name}"`,
      },
    })
  }
  return new NextResponse('Not found', { status: 404, headers: HEADERS })
}
