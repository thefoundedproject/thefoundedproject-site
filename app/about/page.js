export const metadata = {
  title: 'About Dr. Stephen Thompson | The Founded Project',
  description: 'Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM. Survivor-scholar-clinician. He builds governance infrastructure for the people institutions extract from.',
}

// ─── Ecosystem Node Card ───────────────────────────────────────────────────────
function NodeCard({ tag, name, desc, href, status, statusColor }) {
  const statusColors = {
    'Live': '#3D8B5E',
    'Forthcoming': '#C88A00',
    'In Progress': '#C88A00',
    'Complete': '#3D8B5E',
    'Building': '#C88A00',
  }
  const dotColor = statusColors[status] || '#888'

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid rgba(15,27,31,0.09)',
      borderRadius: 8,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ color: '#D8AB69', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>{tag}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block' }} />
          <span style={{ color: dotColor, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{status}</span>
        </span>
      </div>
      <p style={{ color: '#0F1B1F', fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{name}</p>
      <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 12, lineHeight: 1.6, flexGrow: 1 }}>{desc}</p>
      {href && (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : '_self'}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          style={{
            color: '#0F1B1F',
            fontSize: 11,
            fontWeight: 700,
            textDecoration: 'none',
            borderBottom: '1px solid #D8AB69',
            paddingBottom: 1,
            width: 'fit-content',
            marginTop: 4,
          }}
        >
          Visit →
        </a>
      )}
    </div>
  )
}

// ─── Domain Section ────────────────────────────────────────────────────────────
function DomainSection({ eyebrow, title, nodes }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ borderBottom: '1px solid rgba(15,27,31,0.1)', paddingBottom: 12, marginBottom: 24 }}>
        <span style={{ color: '#D8AB69', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{eyebrow}</span>
        <span style={{ color: '#0F1B1F', fontSize: 15, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {nodes.map(node => <NodeCard key={node.name} {...node} />)}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
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

      {/* ── BIO ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              This work came from survival. It grew into a system. The destination is a life you govern on your own terms.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              The question Dr. Thompson has been answering his entire career: what changes when survivors get the same structural tools institutions use every day?
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He comes from three generations of healers. He trained in integrative medicine, Traditional Chinese Medicine, and chiropractic at Pacific College of Health and Science and Northwestern Health Sciences University. But the clinical work was never the full answer. It was the entry point.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He survived things that would have ended most careers. That survival became his research. He stopped treating it as backstory and started treating it as data. The data showed this: the same people modern systems exploit have the least access to the governance tools that would protect them.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              So he built it. Books, platforms, civic tools, coaching frameworks, AI systems, and a personal governance app. Not for the institution. For the people institutions extract from.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He teaches at Northwestern Health Sciences University. He practices at Stockheart Whole Health. He consults with organizations on corporate wellness and AI readiness through GreyDoc Consulting. He publishes. He codes. He advocates for civic truth through RhetoricalPoints and GroundedVote.
            </p>

            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed">
              The throughline across all of it is a single conviction: survivors deserve the tools to govern. Survival is genius. The goal is to give that genius somewhere to go.
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
              <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-4">Quick Links</p>
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
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'rgba(245,240,232,0.6)', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(216,171,105,0.2)', paddingBottom: '2px', display: 'inline-block' }}>
                      {item.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL ECOSYSTEM MAP ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-3">The Full Ecosystem</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-4xl font-light mb-4">Every node. One architecture.</h2>
          <p style={{ color: 'rgba(15,27,31,0.55)' }} className="text-lg max-w-2xl mb-16 leading-relaxed">
            Every project below is an attempt to answer the same question from a different angle: what changes when underserved people get the same structural intelligence institutions use every day?
          </p>

          <DomainSection
            eyebrow="The Platform"
            title="Apps & Digital Tools"
            nodes={[
              { tag: 'Governance · Daily Ritual · Decision', name: 'The Founded App', status: 'Live', desc: 'You\'re already governing your life. This gives you the structure to do it intentionally. Mission. Decisions. Continuity. Built around the life you\'re actually living.', href: 'https://thefounded.app' },
              { tag: 'Youth · Governance · Leadership', name: 'Founded Emerging', status: 'Live', desc: 'Human Enterprise Theory applied to emerging adults. Six modules teaching them the structural tools that school never gets to.', href: 'https://thefoundedemerging.app' },
              { tag: 'Civic · Democracy · Alignment', name: 'GroundedVote', status: 'Live', desc: 'Your vote should reflect what you actually believe. Honest, bias-audited questions show you which candidates match your values.', href: 'https://groundedvote.com' },
              { tag: 'Civic Accountability · Speech Analysis', name: 'RhetoricalPoints', status: 'Live', desc: 'Public discourse runs on disorientation. Four AI models score political speech in real time. Hear what people are actually saying. Signal restored.', href: 'https://rhetoricalpoints.com' },
            ]}
          />

          <DomainSection
            eyebrow="The Voice"
            title="Books & Manuscripts"
            nodes={[
              { tag: 'Memoir · Trauma · Reclamation', name: 'Journey from the Edge', status: 'Live', desc: 'The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice. On Amazon now.', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
              { tag: 'Somatic · Clinical · Practitioner', name: 'P/AIRS Bodywork', status: 'Forthcoming', desc: 'A practitioner manual for daily somatic work. Touch. Conversation. Nervous system practice you can pick up between clients.' },
              { tag: 'Civic · History · Culture', name: 'The South Never Lost', status: 'In Progress', desc: 'The algorithmic plantation, democratic integrity, and what the South has always known. An unfinished reckoning.' },
              { tag: 'Governance · Theory · Framework', name: 'Founded: Human Enterprise Theory', status: 'Forthcoming', desc: 'Reclaimed agency deserves somewhere to live. Human Enterprise Theory is the structure. Built for survivors ready to protect what they built.' },
              { tag: 'Coaching · Method · Practice', name: 'Thompson Coaching Method', status: 'Complete', desc: 'The complete practitioner framework for the Thompson Coaching Method. Internal and trainer editions.' },
            ]}
          />

          <DomainSection
            eyebrow="The Practice"
            title="Clinical & Consulting Services"
            nodes={[
              { tag: 'Clinical · Integrative · Whole Person', name: 'Stockheart Whole Health', status: 'Live', desc: 'Integrative clinical practice in Minneapolis. Chiropractic, acupuncture, and whole-person health for patients in the community.' },
              { tag: 'Corporate Wellness · AI Training', name: 'GreyDoc Consulting', status: 'Live', desc: 'Clinician, author, and builder of systems for human reclamation. Corporate wellness, integrative health consulting, and responsible AI deployment for organizations.', href: 'https://greydoc.com' },
            ]}
          />

          <DomainSection
            eyebrow="The Community"
            title="Programs & Spaces"
            nodes={[
              { tag: 'Community · Healing · Reclamation', name: 'Rooted Reclaimers', status: 'Live', desc: 'The community layer of the Thompson Ecosystem. Trauma-informed education, movement, breathwork, nutrition, and connection. Daily work, done together.' },
              { tag: 'Reset · Structure · Accountability', name: 'Rooted Reset', status: 'Live', desc: 'A 21-day structured reset program. Daily worksheets, breathwork protocols, and community accountability. 21 days of rebuilding from the ground up.' },
              { tag: 'Retreat · Healing · Brotherhood', name: 'BLACC Retreats', status: 'Building', desc: 'Healing-centered retreat experiences for Black men and communities. Space. Brotherhood. Practice. The conditions reclamation needs.' },
            ]}
          />

          <DomainSection
            eyebrow="The Signal"
            title="Civic Infrastructure"
            nodes={[
              { tag: 'Media Literacy · AI · Debate', name: 'ChatWithMe Debates', status: 'Live', desc: 'Watch two AIs argue. Notice who you believe. That is the lesson. That is the literacy.' },
              { tag: 'Civic · Community · Education', name: 'Youth AI Training', status: 'In Progress', desc: 'AI literacy training for young people. They will live in a world tech founders, governments, and ad platforms are designing right now. They deserve the language to understand it and the skill to respond. Transitioning to nonprofit.' },
            ]}
          />

          {/* Destination callout */}
          <div style={{ backgroundColor: '#0F1B1F', borderRadius: 12, padding: '40px 48px', textAlign: 'center', marginTop: 16 }}>
            <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Destination</p>
            <p style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 300, lineHeight: 1.5, maxWidth: 560, margin: '0 auto 28px' }}>
              Every node in this ecosystem points to one place. Where reclaimed agency becomes personal governance.
            </p>
            <a href="https://thefounded.app" target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '14px 40px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              The Founded App →
            </a>
          </div>
        </div>
      </section>

      {/* ── THE ARC ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">The Thompson Ecosystem</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-3xl font-light mb-4">One question. Many answers.</h2>
          <p style={{ color: '#0F1B1F' }} className="text-lg opacity-60 max-w-2xl mb-12">
            Every project in this ecosystem is an attempt to answer the same question from a different angle: what changes when underserved people get the same structural intelligence institutions use every day?
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                theme: 'Name the survival.',
                name: 'Journey from the Edge',
                desc: 'The body learns to survive. This book names those patterns, honors them as the intelligence they are, and begins the walk back to choice.',
                link: { label: 'Buy on Amazon', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
              },
              {
                theme: 'Find your people.',
                name: 'Rooted Reclaimers',
                desc: 'The community layer. Trauma-informed education, movement, breathwork, nutrition, and connection. Daily work, done together.',
                link: null,
              },
              {
                theme: 'Build the governance.',
                name: 'The Founded App',
                desc: 'You\'re already governing your life. This gives you the structure to do it intentionally. The destination for every node in this ecosystem.',
                link: { label: 'The Founded App', href: 'https://thefounded.app' },
              },
            ].map((layer) => (
              <div key={layer.name} className="border-t-2 pt-6" style={{ borderColor: '#D8AB69' }}>
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{layer.theme}</p>
                <h3 style={{ color: '#0F1B1F' }} className="text-lg font-semibold mb-4">{layer.name}</h3>
                <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-70 mb-4">{layer.desc}</p>
                {layer.link && (
                  <a href={layer.link.href} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#0F1B1F', fontSize: '12px', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #D8AB69', paddingBottom: '1px' }}>
                    {layer.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
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
            <a href="https://greydoc.com" target="_blank" rel="noopener noreferrer"
              style={{ border: '1px solid rgba(216,171,105,0.4)', color: '#D8AB69' }}
              className="px-6 py-3 text-sm font-semibold rounded hover:bg-white/5 transition-colors">
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
