'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Private, local state for the Research Atlas: reading settings, study
 * progress, marks, bookmarks, notes, the revisit queue, and the resume point.
 * Everything lives in this browser's localStorage. Every read and write is
 * wrapped so the atlas still works when storage is blocked, full, or absent.
 * Nothing here is sent anywhere.
 */

import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'founded-atlas:v1:'

export function readKey(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeKey(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('founded-atlas-store', { detail: { key } }))
    return true
  } catch {
    return false
  }
}

/** React state mirrored to localStorage and kept in sync across components. */
export function useStored(key, fallback) {
  const [value, setValue] = useState(fallback)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setValue(readKey(key, fallback))
    setReady(true)
    const onChange = (e) => {
      if (!e.detail || e.detail.key === key) setValue(readKey(key, fallback))
    }
    window.addEventListener('founded-atlas-store', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('founded-atlas-store', onChange)
      window.removeEventListener('storage', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? next(prev) : next
        writeKey(key, v)
        return v
      })
    },
    [key],
  )
  return [value, update, ready]
}

export const DEFAULT_SETTINGS = { type: 0, width: 'medium', contrast: 'default', motion: 'default', focus: false, guide: false }

export function useSettings() {
  return useStored('settings', DEFAULT_SETTINGS)
}

/** Resume point: the last place the reader was, with a label for the button. */
export function rememberLocation(href, label) {
  writeKey('last', { href, label, at: new Date().toISOString() })
}
export function useLastLocation() {
  return useStored('last', null)
}

/** Marks on any record: reviewed, uncertain, or revisit. Keyed by record id. */
export function useMarks() {
  return useStored('marks', {})
}
export function setMark(id, mark, meta) {
  const marks = readKey('marks', {})
  if (!mark) delete marks[id]
  else marks[id] = { mark, at: new Date().toISOString(), ...(meta || {}) }
  writeKey('marks', marks)
  if (mark === 'revisit' && meta) addToRevisit({ id, ...meta })
  if (mark !== 'revisit') removeFromRevisit(id)
}

/** The revisit queue: things to come back to, in the order they were added. */
export function useRevisit() {
  return useStored('revisit', [])
}
export function addToRevisit(item) {
  const q = readKey('revisit', [])
  if (q.some((x) => x.id === item.id)) return false
  q.push({ ...item, at: new Date().toISOString() })
  writeKey('revisit', q)
  return true
}
export function removeFromRevisit(id) {
  const q = readKey('revisit', []).filter((x) => x.id !== id)
  writeKey('revisit', q)
}

/** Bookmarks: saved places. */
export function useBookmarks() {
  return useStored('bookmarks', [])
}
export function toggleBookmark(item) {
  const b = readKey('bookmarks', [])
  const i = b.findIndex((x) => x.id === item.id)
  if (i >= 0) b.splice(i, 1)
  else b.push({ ...item, at: new Date().toISOString() })
  writeKey('bookmarks', b)
  return i < 0
}

/** Private notes keyed by record id. */
export function useNotes() {
  return useStored('notes', {})
}
export function setNote(id, text) {
  const n = readKey('notes', {})
  if (!text || !text.trim()) delete n[id]
  else n[id] = { text, at: new Date().toISOString() }
  writeKey('notes', n)
}

/** Study progress per chapter: card marks, last card, chosen path. */
export function useProgress() {
  return useStored('progress', {})
}
export function updateProgress(chapterId, patch) {
  const p = readKey('progress', {})
  p[chapterId] = { ...(p[chapterId] || {}), ...patch, updated: new Date().toISOString() }
  writeKey('progress', p)
}

export function clearAll() {
  try {
    const keys = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(PREFIX)) keys.push(k)
    }
    keys.forEach((k) => window.localStorage.removeItem(k))
    window.dispatchEvent(new CustomEvent('founded-atlas-store', { detail: null }))
  } catch {
    /* storage unavailable; nothing to clear */
  }
}

/** Download a text file from the browser. */
export function downloadText(filename, text, type = 'text/markdown') {
  try {
    const blob = new Blob([text], { type: `${type};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
