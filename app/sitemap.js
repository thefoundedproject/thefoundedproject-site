/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * /sitemap.xml. Tells search engines every page this site wants found, instead
 * of leaving them to discover pages by following links. Local Field Notes are
 * listed individually; Substack essays are not, because their URLs live on
 * substack.com and a sitemap may only list this domain's own pages.
 *
 * No lastModified on static routes: stamping "now" on every build claims a
 * change that never happened, and search engines learn to ignore a sitemap
 * whose dates lie.
 */
import { getNotes } from '../lib/notes'

const SITE = 'https://thefoundedproject.com'

const ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/books', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/notes', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/certification', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/golden-eight', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/speaking', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/store', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/consider-otherwise/join', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
]

export default function sitemap() {
  return [
    ...ROUTES.map((r) => ({
      url: `${SITE}${r.path}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...getNotes().map((n) => ({
      url: `${SITE}/notes/${n.slug}`,
      lastModified: new Date(`${n.date}T12:00:00Z`),
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ]
}
