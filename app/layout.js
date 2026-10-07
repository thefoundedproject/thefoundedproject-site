import './globals.css'

/**
 * Root layout: the document shell only (html, body, global CSS, structured
 * data, site-wide metadata). The public site's nav, footer, and concierge
 * widget live in app/(site)/layout.js so that the private Research Atlas
 * under /atlas can render its own calm chrome and never load third-party
 * scripts behind the password.
 */

const SITE = 'https://thefoundedproject.com'

// Structured data. Search engines and AI assistants read this to know who is
// behind the site and what it publishes, instead of guessing from page copy.
// Name without the prefix, credentials as post-nominals: the settled byline rule.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'The Founded Project',
      url: SITE,
      logo: `${SITE}/icon.png`,
      founder: { '@id': `${SITE}/#stephen-thompson` },
      sameAs: ['https://thefoundedproject.substack.com'],
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#stephen-thompson`,
      name: 'Stephen Thompson',
      honorificSuffix: 'DC, DACM, FAIHM',
      url: `${SITE}/about`,
      jobTitle: 'Founder, The Founded Project',
      knowsAbout: ['Human Enterprise Theory', 'personal governance', 'trauma-informed care', 'somatic practice', 'civic media literacy'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'The Founded Project',
      publisher: { '@id': `${SITE}/#organization` },
    },
  ],
}

export const metadata = {
  // metadataBase turns every relative URL in page metadata into an absolute one.
  // Without it, share cards and canonical tags point nowhere useful.
  metadataBase: new URL(SITE),
  // iOS Smart App Banner: Safari on iPhone shows Apple's own Open/Get bar for
  // the App Store listing. Mobile-first routing starts here.
  itunes: { appId: '6786498112' },
  // No canonical here: a layout-level canonical is inherited by every page that
  // doesn't set its own, which would mark the whole site a copy of the homepage.
  // Each page declares its own canonical instead.
  title: 'The Founded Project | Stephen Thompson',
  description: 'The Founded Project is the ecosystem of Dr. Stephen Thompson. Survivor-scholar-clinician, author, and founder of Human Enterprise Theory. Books, platforms, civic tools, and healing infrastructure. All working to get humans organized and reinforced.',
  keywords: 'Human Enterprise Theory, Dr. Stephen Thompson, Founded Project, GroundedVote, trauma-informed, survivor scholar, Black healing, civic alignment',
  openGraph: {
    title: 'The Founded Project',
    description: 'Get humans organized and reinforced.',
    url: 'https://thefoundedproject.com',
    siteName: 'The Founded Project',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Founded Project',
    description: 'Get humans organized and reinforced.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  )
}
