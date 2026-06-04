export const metadata = {
  title: 'About Dr. Stephen Thompson | The Founded Project',
  description: 'Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM, survivor-scholar-clinician building the governance infrastructure for the people most likely to be extracted from.',
}

export default function About() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">
            Dr. Stephen Thompson
          </h1>
          <p style={{ color: '#D8AB69' }} className="text-lg mb-2">DC · DACM · BCTMB · FAIHM</p>
          <p className="text-gray-400">Survivor · Scholar · Clinician · Builder</p>
        </div>
      </section>

      {/* Bio */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              The question Dr. Stephen Thompson has been answering his entire career is this: what happens when you give the most extracted-from people the same structural tools as institutions?
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He comes from three generations of healers. He trained in integrative medicine, Traditional Chinese Medicine, and chiropractic at Pacific College of Health and Science and Northwestern Health Sciences University. But the clinical work was never the full answer. It was the entry point.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He survived things that would have ended most careers. That survival became his research. He stopped treating it as backstory and started treating it as data. What the data showed was consistent: the people most likely to be exploited by modern systems were also the least likely to have access to the governance infrastructure that would protect them.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              So he built it. Books, platforms, civic tools, coaching frameworks, AI systems, and a personal governance app. Not for the institution. For the person the institution was designed to extract from.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He teaches at Northwestern Health Sciences University. He practices at Stockheart Whole Health. He consults with organizations on corporate wellness and AI readiness through GreyDoc Consulting. He publishes. He codes. He advocates for civic truth through RhetoricalPoints and GroundedVote.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed">
              The throughline across all of it is a single conviction: the people who were taught to survive deserve the tools to govern. Survival is genius. The goal is to give that genius somewhere to go.
            </p>
          </div>

          <div>
            <div style={{ backgroundColor: '#0F1B1F' }} className="p-8 rounded-sm mb-6">
              <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-6">Credentials</p>
              <ul className="space-y-4">
                {[
                  { abbr: 'DC', full: 'Doctor of Chiropractic' },
                  { abbr: 'DACM', full: 'Doctor of Acupuncture & Chinese Medicine' },
                  { abbr: 'BCTMB', full: 'Board Certified in Therapeutic Massage & Bodywork' },
                  { abbr: 'FAIHM', full: 'Fellow, Academy of Integrative Health & Medicine' },
                ].map((cred) => (
                  <li key={cred.abbr}>
                    <p style={{ color: '#D8AB69' }} className="text-sm font-semibold">{cred.abbr}</p>
                    <p className="text-gray-300 text-xs">{cred.full}</p>
                  </li>
                ))}
              </ul>
              <div style={{ height: '1px', backgroundColor: '#D8AB69' }} className="my-6 opacity-30" />
              <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-4">Institutions</p>
              <ul className="space-y-2 text-gray-300 text-xs">
                <li>Pacific College of Health and Science</li>
                <li>Northwestern Health Sciences University</li>
                <li>AIHM Fellowship</li>
                <li>Stockheart Whole Health</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#0F1B1F' }} className="p-8 rounded-sm">
              <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-4">The Work</p>
              <ul className="space-y-3">
                {[
                  { label: 'The Founded App', href: 'https://thefounded.app' },
                  { label: 'Journey from the Edge', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
                  { label: 'GroundedVote', href: 'https://groundedvote.com' },
                  { label: 'RhetoricalPoints', href: 'https://rhetoricalpoints.com' },
                  { label: 'GreyDoc Consulting', href: 'https://greydoc.com' },
                  { label: 'Founded Emerging', href: 'https://thefoundedemerging.app' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,240,232,0.6)', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(216,171,105,0.2)', paddingBottom: '2px', display: 'inline-block' }}>
                      {item.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Arc */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">The Thompson Ecosystem</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-3xl font-light mb-4">One question. Many answers.</h2>
          <p style={{ color: '#0F1B1F' }} className="text-lg opacity-60 max-w-2xl mb-12">
            Every project in this ecosystem is an attempt to answer the same question from a different angle: what does it look like when you give the most underserved people the same structural intelligence that institutions use every day?
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Journey from the Edge',
                theme: 'Name the survival.',
                desc: 'The body learns to survive. This book names those patterns, honors them as the intelligence they are, and begins the walk back to choice. Available on Amazon now.',
                link: { label: 'Buy on Amazon', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
              },
              {
                name: 'Rooted Reclaimers',
                theme: 'Reclaim the agency.',
                desc: 'The community layer. Trauma-informed education, movement, breathwork, nutrition, and connection — for people rebuilding, on their own terms.',
                link: null,
              },
              {
                name: 'The Founded App',
                theme: 'Build the governance.',
                desc: 'Healing creates possibility. The Founded gives that possibility structure: mission, board, six capitals, decisions, and continuity. The destination for every node in this ecosystem.',
                link: { label: 'The Founded App', href: 'https://thefounded.app' },
              },
            ].map((layer) => (
              <div key={layer.name} className="border-t-2 pt-6" style={{ borderColor: '#D8AB69' }}>
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{layer.theme}</p>
                <h3 style={{ color: '#0F1B1F' }} className="text-lg font-semibold mb-4">{layer.name}</h3>
                <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-70 mb-4">{layer.desc}</p>
                {layer.link && (
                  <a href={layer.link.href} target="_blank" rel="noopener noreferrer" style={{ color: '#0F1B1F', fontSize: '12px', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #D8AB69', paddingBottom: '1px' }}>
                    {layer.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-white text-2xl font-light mb-2">Connect with the work.</h2>
            <p className="text-gray-400 text-sm">Publishers, media, speaking invitations, clinical inquiries, and partnership conversations welcome.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <a href="/speaking" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="px-6 py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity">
              Speaking
            </a>
            <a href="https://greydoc.com" target="_blank" rel="noopener noreferrer" style={{ border: '1px solid rgba(216,171,105,0.4)', color: '#D8AB69' }} className="px-6 py-3 text-sm font-semibold rounded hover:bg-white/5 transition-colors">
              GreyDoc Consulting
            </a>
            <a href="/contact" style={{ border: '1px solid #D8AB69', color: '#D8AB69' }} className="px-6 py-3 text-sm font-semibold rounded hover:bg-white/5 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
