/**
 * Copyright 2026 The Founded Project
 *
 * Shared layout for the private proposal pages under /for/. Each page is a
 * letter to one person, reached only by a link Stephen sends, so every page
 * sets noindex and none of them appear in the sitemap or nav.
 */

const INK = '#0F1B1F'
const SOFT = 'rgba(15,27,31,0.72)'
const RULE = 'rgba(15,27,31,0.12)'
const GOLD = '#D8AB69'
const GOLD_TEXT = '#8F6A2E'
const ESPRESSO = '#17110B'

export function proposalMetadata(slug, title, description) {
  return {
    title: `${title} | The Founded Project`,
    description,
    alternates: { canonical: `/for/${slug}` },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: { title, description, url: `/for/${slug}`, type: 'article' },
  }
}

const ECOSYSTEM = [
  {
    name: 'The Founded',
    href: 'https://apps.apple.com/us/app/the-founded/id6786498112',
    body: (
      <>
        On iPhone since September 16, and on the web at{' '}
        <a href="https://thefounded.app" style={{ color: GOLD_TEXT }}>thefounded.app</a>. A personal board, a decision log, a
        daily and evening ritual, and a journal. We designed it for people who already feel overwhelmed, so every screen does one
        thing and the order never changes.
      </>
    ),
  },
  {
    name: 'Founded Emerging',
    href: 'https://apps.apple.com/us/app/emerging/id6786498515',
    body: 'The same structure for teenagers on iPhone. A parent consents before the app collects anything, crisis support sits one tap away, and journals stay on the device.',
  },
  {
    name: 'GroundedVote',
    href: 'https://groundedvote.com',
    body: "A voter compares her priorities with candidates in 31 federal races, and sees where an incumbent's legislative record and public statements part ways.",
  },
  {
    name: 'RhetoricalPoints',
    href: 'https://rhetoricalpoints.com',
    body: 'You paste in a claim from any speaker, and RhetoricalPoints checks it against the same standard it uses for everyone else.',
  },
  {
    name: 'Consider Otherwise',
    href: 'https://www.youtube.com/@considerotherwise',
    body: 'A live show where people who disagree talk it through. RhetoricalPoints checks every claim on air, mine included.',
  },
  {
    name: 'The book',
    body: (
      <>
        <em>The Founded Project: A Theory of Human Flourishing</em>, 45 chapters, now in line edits. Part I opens with The System
        Is Breaking Down, The Crisis of Agency, and Why Humans Drift Toward Extremes.
      </>
    ),
  },
  {
    name: 'Founded Family and Rooted Reclaimers',
    body: 'Family governance, in private testing, and a hands-on arm for the person who needs more than a plan.',
  },
]

function H2({ children }) {
  return (
    <h2
      style={{ color: INK, fontSize: 24, fontWeight: 500, lineHeight: 1.25, margin: '48px 0 18px', paddingTop: 32, borderTop: `1px solid ${RULE}`, textWrap: 'balance' }}
    >
      {children}
    </h2>
  )
}

export function P({ children }) {
  return <p style={{ color: SOFT, fontSize: 17, lineHeight: 1.7, margin: '0 0 18px', maxWidth: 640 }}>{children}</p>
}

export function Pairs({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map(([label, body]) => (
        <div key={label} className="proposal-row">
          <span style={{ color: INK, fontWeight: 600 }}>{label}</span>
          <span style={{ color: SOFT, fontSize: 16, lineHeight: 1.65 }}>{body}</span>
        </div>
      ))}
    </div>
  )
}

export function Steps({ items }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((t, i) => (
        <li key={i} style={{ position: 'relative', paddingLeft: 42, color: SOFT, fontSize: 16.5, lineHeight: 1.65, maxWidth: 620 }}>
          <span
            style={{ position: 'absolute', left: 0, top: 1, width: 27, height: 27, borderRadius: '50%', border: `1.5px solid ${GOLD}`, color: GOLD_TEXT, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {i + 1}
          </span>
          {t}
        </li>
      ))}
    </ol>
  )
}

export default function Proposal({ recipient, title, date, intro, alignment, project, ask }) {
  return (
    <main style={{ backgroundColor: '#F5F0E8' }} className="min-h-screen px-4 sm:px-6 pt-24 pb-24">
      <article className="max-w-3xl mx-auto" style={{ backgroundColor: '#FFFDF8', border: `1px solid ${RULE}`, borderRadius: 6, overflow: 'hidden' }}>
        <header style={{ backgroundColor: ESPRESSO, padding: '40px clamp(22px, 5vw, 48px) 34px' }}>
          <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 18px' }}>
            The Founded Project · for {recipient}
          </p>
          <h1 style={{ color: '#F2EBDD', fontSize: 'clamp(30px, 5.4vw, 44px)', fontWeight: 400, lineHeight: 1.12, margin: '0 0 12px', textWrap: 'balance' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(242,235,221,0.65)', fontSize: 15, margin: 0 }}>From Stephen Thompson · {date}</p>
        </header>

        <div style={{ padding: '38px clamp(22px, 5vw, 48px) 48px' }}>
          {intro}

          {alignment}

          <H2>What exists today</H2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {ECOSYSTEM.map((e) => (
              <div key={e.name} className="proposal-row">
                <span style={{ color: INK, fontWeight: 600 }}>
                  {e.href ? (
                    <a href={e.href} style={{ color: INK, textDecoration: 'none', borderBottom: `1px solid ${GOLD}` }}>{e.name}</a>
                  ) : (
                    e.name
                  )}
                </span>
                <span style={{ color: SOFT, fontSize: 16, lineHeight: 1.65 }}>{e.body}</span>
              </div>
            ))}
          </div>

          <H2>Where we are</H2>
          <p style={{ color: SOFT, fontSize: 17, lineHeight: 1.7, margin: 0, maxWidth: 640, borderLeft: `3px solid ${GOLD}`, paddingLeft: 18 }}>
            The apps went live on September 16. Revenue is zero, and the web app has five users. For now, the iPhone app&apos;s AI
            features ask people to bring their own key. The book is in edits. The theory and the tools are further along than the
            business, and I&apos;d rather you hear that from me first.
          </p>

          <H2>{project.heading}</H2>
          {project.body}

          <section style={{ marginTop: 48, backgroundColor: ESPRESSO, borderRadius: 4, padding: '26px 28px' }}>
            <h2 style={{ color: '#F2EBDD', fontSize: 24, fontWeight: 500, margin: '0 0 10px' }}>The ask</h2>
            <p style={{ color: 'rgba(242,235,221,0.75)', fontSize: 17, lineHeight: 1.65, margin: '0 0 18px', maxWidth: 580 }}>{ask}</p>
            <p style={{ color: '#F2EBDD', fontWeight: 600, margin: 0 }}>Stephen Thompson</p>
            <a href="/contact" style={{ color: GOLD, fontSize: 15 }}>thefoundedproject.com/contact</a>
          </section>
        </div>
      </article>
    </main>
  )
}

export { H2 }
