import './atlas.css'
import AtlasShell from './_components/AtlasShell'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * Research Atlas layout. Private: every page under /atlas is behind the
 * password middleware, marked noindex, kept out of the sitemap, and absent
 * from the public nav. This layout replaces the public site's chrome with
 * the atlas's own calm shell and loads no third-party scripts.
 */

export const metadata = {
  title: { default: 'Research Atlas', template: '%s · Research Atlas' },
  description: 'Private research companion to The Founded Project manuscript.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
}

export default function AtlasLayout({ children }) {
  return <AtlasShell>{children}</AtlasShell>
}
