'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * The atlas chrome: a persistent header with the project name, a section
 * nav, reading settings, keyboard shortcuts, focus mode, a reading guide,
 * and a phone bottom bar. It also records the reader's last location so the
 * start page can offer "Continue where you stopped".
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { COPY } from './copy'
import { useSettings, rememberLocation, DEFAULT_SETTINGS } from './store'

const PRIMARY = [
  { href: '/atlas', label: COPY.nav.start, exact: true },
  { href: '/atlas/study', label: COPY.nav.study },
  { href: '/atlas/explore', label: COPY.nav.explore },
  { href: '/atlas/evidence', label: COPY.nav.evidence },
  { href: '/atlas/challenge', label: COPY.nav.challenge },
  { href: '/atlas/mechanisms', label: COPY.nav.mechanisms },
  { href: '/atlas/terms', label: COPY.nav.terms },
  { href: '/atlas/revisit', label: COPY.nav.revisit },
  { href: '/atlas/method', label: COPY.nav.method },
  { href: '/atlas/gaps', label: COPY.nav.gaps },
]

const BOTTOM = [
  { href: '/atlas', label: COPY.nav.start, exact: true, icon: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z' },
  { href: '/atlas/study', label: COPY.nav.study, icon: 'M4 5h7a3 3 0 013 3v12a2 2 0 00-2-2H4zM20 5h-7a3 3 0 00-3 3v12a2 2 0 012-2h8z' },
  { href: '/atlas/explore', label: COPY.nav.explore, icon: 'M11 4a7 7 0 105.2 11.7l4 4 1.4-1.4-4-4A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z' },
  { href: '/atlas/evidence', label: COPY.nav.evidence, icon: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5' },
  { href: '/atlas/revisit', label: COPY.nav.revisit, icon: 'M6 3h12v18l-6-4-6 4z' },
]

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

/** Study, chapter, claim, and source pages all belong to the Study or Evidence sections for highlighting. */
function sectionFor(pathname) {
  if (pathname.startsWith('/atlas/chapter') || pathname.startsWith('/atlas/study')) return '/atlas/study'
  if (pathname.startsWith('/atlas/claim') || pathname.startsWith('/atlas/source')) return '/atlas/evidence'
  return pathname
}

export default function AtlasShell({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [settings, setSettings, ready] = useSettings()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef(null)
  const section = sectionFor(pathname)

  // Apply reading settings as attributes on <html>, and clean up on leave.
  useEffect(() => {
    if (!ready) return
    const el = document.documentElement
    el.setAttribute('data-atlas-type', String(settings.type ?? 0))
    el.setAttribute('data-atlas-width', settings.width || 'medium')
    el.setAttribute('data-atlas-contrast', settings.contrast || 'default')
    el.setAttribute('data-atlas-motion', settings.motion || 'default')
    el.setAttribute('data-atlas-focus', settings.focus ? 'on' : 'off')
    return () => {
      ;['type', 'width', 'contrast', 'motion', 'focus'].forEach((k) => el.removeAttribute(`data-atlas-${k}`))
    }
  }, [settings, ready])

  // Remember where the reader is, for the resume button.
  useEffect(() => {
    if (!pathname || pathname === '/atlas' || pathname.startsWith('/atlas/revisit')) return
    const t = setTimeout(() => {
      const title = (document.title || '').replace(/\s*·\s*Research Atlas.*$/, '')
      rememberLocation(window.location.pathname + window.location.search, title || pathname)
    }, 400)
    return () => clearTimeout(t)
  }, [pathname])

  // Keyboard: / search, f focus mode, ? settings, Esc closes.
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
      if (e.key === 'Escape' && open) { setOpen(false); return }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return
      const isHelp = e.key === '?' || (e.key === '/' && e.shiftKey) || (e.code === 'Slash' && e.shiftKey)
      if (isHelp) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === '/' || e.code === 'Slash') {
        e.preventDefault()
        const box = document.getElementById('atlas-search')
        if (box) box.focus()
        else router.push('/atlas/explore?focus=1')
      } else if (e.key === 'f' || e.key === 'F') {
        setSettings((s) => ({ ...DEFAULT_SETTINGS, ...s, focus: !s.focus }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, router, setSettings])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const set = (patch) => setSettings((s) => ({ ...DEFAULT_SETTINGS, ...s, ...patch }))

  return (
    <div className="atlas">
      <a href="#atlas-main" className="a-skip">Skip to content</a>
      <header className="a-top">
        <div className="a-top-inner">
          <Link href="/atlas" className="a-brand" aria-label={`${COPY.brand.name} ${COPY.brand.sub}, start here`}>
            <img src="/brand/logo_mark_gold.png" alt="" />
            <span>
              <span className="a-brand-name">{COPY.brand.name}</span>
              <br />
              <span className="a-brand-sub">{COPY.brand.sub}</span>
            </span>
          </Link>
          <div className="a-crumbs" aria-hidden="true">
            <span>{COPY.brand.edition}</span>
            <span>{PRIMARY.find((p) => isActive(section, p))?.label || COPY.nav.start}</span>
          </div>
          <div className="a-top-actions">
            <Link href="/atlas/explore" className="a-iconbtn" aria-label="Search the atlas (press slash)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <span className="a-hide-sm">Search</span> <kbd>/</kbd>
            </Link>
            <button type="button" className="a-iconbtn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-label="Reading settings and keyboard shortcuts">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16" /><circle cx="17" cy="12" r="2" /></svg>
              Aa
            </button>
          </div>
        </div>
        <nav className="a-nav" aria-label="Atlas sections">
          <div className="a-nav-inner">
            {PRIMARY.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(section, item) ? 'page' : undefined}>{item.label}</Link>
            ))}
          </div>
        </nav>
      </header>

      {ready && settings.guide && <div className="a-reading-line" aria-hidden="true" />}

      <main id="atlas-main" className="a-main" tabIndex={-1}>
        {children}
      </main>

      <nav className="a-bottom" aria-label="Atlas sections">
        {BOTTOM.map((item) => (
          <Link key={item.href} href={item.href} aria-current={isActive(section, item) ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <dialog ref={dialogRef} className="a-dialog" onClose={() => setOpen(false)} aria-labelledby="atlas-settings-title">
        <div className="a-dialog-inner">
          <h2 id="atlas-settings-title" style={{ fontSize: '1.3rem' }}>{COPY.settings.title}</h2>
          <div className="a-field">
            <span id="s-type">{COPY.settings.type}</span>
            <div className="a-seg" role="group" aria-labelledby="s-type">
              {COPY.settings.typeOptions.map((label, i) => (
                <button key={label} type="button" aria-pressed={(settings.type ?? 0) === i} onClick={() => set({ type: i })}>{label}</button>
              ))}
            </div>
          </div>
          <div className="a-field">
            <span id="s-width">{COPY.settings.width}</span>
            <div className="a-seg" role="group" aria-labelledby="s-width">
              {Object.entries(COPY.settings.widthOptions).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={(settings.width || 'medium') === k} onClick={() => set({ width: k })}>{label}</button>
              ))}
            </div>
          </div>
          <div className="a-field">
            <span id="s-contrast">{COPY.settings.contrast}</span>
            <div className="a-seg" role="group" aria-labelledby="s-contrast">
              {Object.entries(COPY.settings.contrastOptions).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={(settings.contrast || 'default') === k} onClick={() => set({ contrast: k })}>{label}</button>
              ))}
            </div>
          </div>
          <div className="a-field">
            <span id="s-motion">{COPY.settings.motion}</span>
            <div className="a-seg" role="group" aria-labelledby="s-motion">
              {Object.entries(COPY.settings.motionOptions).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={(settings.motion || 'default') === k} onClick={() => set({ motion: k })}>{label}</button>
              ))}
            </div>
          </div>
          <label className="a-row" style={{ gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!settings.focus} onChange={(e) => set({ focus: e.target.checked })} />
            <span><strong>{COPY.settings.focus}</strong><br /><span className="a-tiny">{COPY.settings.focusHelp}</span></span>
          </label>
          <label className="a-row" style={{ gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!settings.guide} onChange={(e) => set({ guide: e.target.checked })} />
            <span><strong>{COPY.settings.guide}</strong><br /><span className="a-tiny">{COPY.settings.guideHelp}</span></span>
          </label>
          <div>
            <div className="a-eyebrow" style={{ marginBottom: 6 }}>{COPY.settings.shortcutsTitle}</div>
            <dl className="a-kv a-small" style={{ gridTemplateColumns: '90px 1fr' }}>
              {COPY.settings.shortcuts.map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}><dt><kbd style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{k}</kbd></dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="a-row" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="a-btn a-btn-sm" onClick={() => setOpen(false)}>{COPY.settings.close}</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
