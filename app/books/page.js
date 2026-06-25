/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * Books page — overview of the published, in-progress, and forthcoming titles.
 */

export const metadata = {
  title: 'Books | The Founded Project',
  description: 'Books by Dr. Stephen Thompson. Memoir, theory, somatic practice, civic analysis. Published, in-progress, and forthcoming titles from The Founded Project.',
}

function BookCard({ title, status, year, kind, blurb, link }) {
  const statusColor = status === 'Available' ? '#2A5C30'
    : status === 'In revision' ? '#9E6F2C'
    : status === 'Drafted' ? '#9E6F2C'
    : status === 'In progress' ? '#5C6770'
    : status === 'Concept' ? '#5C6770'
    : '#5C6770'
  return (
    <article style={{ borderTop: '1px solid rgba(15,27,31,0.12)', padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
        <h3 style={{ color: '#0F1B1F', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
        <span style={{ color: statusColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {status}{year ? ` · ${year}` : ''}
        </span>
      </div>
      <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{kind}</p>
      <p style={{ color: 'rgba(15,27,31,0.78)', fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>{blurb}</p>
      {link && (
        <a href={link} target={link.startsWith('http') ? '_blank' : '_self'} rel={link.startsWith('http') ? 'noreferrer' : undefined} style={{ color: '#9E6F2C', fontSize: 13, fontWeight: 700, textDecoration: 'underline' }}>
          {link.startsWith('http') ? 'Buy on Amazon →' : 'Read more →'}
        </a>
      )}
    </article>
  )
}

export default function BooksPage() {
  return (
    <main style={{ backgroundColor: '#F5F0E8' }} className="min-h-screen px-6 py-24">
      <article className="max-w-3xl mx-auto">
        <a href="/" style={{ color: 'rgba(15,27,31,0.5)' }} className="text-xs uppercase tracking-widest mb-6 inline-block hover:opacity-80">
          ← Home
        </a>
        <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-3">Books</p>
        <h1 style={{ color: '#0F1B1F' }} className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
          The body of work.
        </h1>
        <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 620 }} className="mb-16">
          Eight titles across memoir, theory, somatic practice, and civic analysis. Some are out, some are close, some are still becoming. The arc is one body of work: name what extracts from a modern life, give the reader the architecture to take it back.
        </p>

        <BookCard
          title="Journey from the Edge"
          kind="Memoir"
          status="Available"
          year="2023"
          blurb="The survivor account. A clinician&apos;s passage through what should have ended a career and didn&apos;t. The seed text the rest of the work grew from."
          link="https://www.amazon.com/dp/B0GTXBZGJY"
        />

        <BookCard
          title="The Founded Project"
          kind="Theory · 45 chapters · the flagship"
          status="In revision"
          year="Target 2027"
          blurb="Human Enterprise Theory in book form. The full architecture of extraction, reclamation, agency, governance, discernment, and contribution. Built for the reader who wants the diagnosis and the destination in one place."
        />

        <BookCard
          title="The South Never Lost"
          kind="Civic analysis"
          status="Drafted"
          year="Target 2026"
          blurb="The algorithmic dimension of American civic life, with the South as the proving ground. How extraction at scale shapes belief, vote, and self-image, and the literacy that protects against it."
        />

        <BookCard
          title="Thompson Coaching Method"
          kind="Practitioner manual"
          status="Available"
          year="2024"
          blurb="The clinical and coaching framework underneath the Founded apps. Internal Master Edition and Trainer Edition compiled. Used in active practice and in training programs."
        />

        <BookCard
          title="P/AIRS Bodywork"
          kind="Somatic practice · 12 regional chapters"
          status="In revision"
          year="Target 2026"
          blurb="The body-first half of the work. The fascia stores patterns from before the patient could name them. P/AIRS is the framework for meeting the body where it actually lives."
        />

        <BookCard
          title="The Body Integrative"
          kind="Story medicine"
          status="In progress"
          year="Target 2027"
          blurb="A translation of integrative medicine through the language of story rather than biomedical pathology. The book the clinic was waiting for."
        />

        <BookCard
          title="1 to 5: The Founded Business Book"
          kind="Practitioner business"
          status="In progress"
          year="Target 2027"
          blurb="The five years between starting a serious practice and reaching the version of it that finally works. Strategy, money, mistakes, what no one teaches in school."
        />

        <BookCard
          title="The Manufactured Knight"
          kind="Cultural critique"
          status="Concept"
          year="Target 2028"
          blurb="What gets made when a culture engineers its protector class. The manufactured masculine ideal and what it costs."
        />

        <div style={{ marginTop: 64, padding: '32px 36px', backgroundColor: '#0F1B1F', borderRadius: 10 }}>
          <p style={{ color: '#D8AB69', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Coming Soon</p>
          <h3 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 400, marginBottom: 12, lineHeight: 1.35 }}>
            Pre-orders, excerpts, and direct purchase links arrive as each title moves into production.
          </h3>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, lineHeight: 1.65, marginBottom: 18 }}>
            For early access, advance copy requests, foreign rights inquiries, or speaking around any of these titles, reach out directly.
          </p>
          <a href="/contact" style={{ color: '#D8AB69', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.4)', paddingBottom: 2 }}>
            Contact for press, partnerships, and pre-orders →
          </a>
        </div>

        <p style={{ color: 'rgba(15,27,31,0.5)' }} className="text-sm italic mt-12">
          Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM
        </p>
      </article>
    </main>
  )
}
