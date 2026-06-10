export const metadata = {
  title: 'Projects | The Founded Project Ecosystem',
  description: 'The full ecosystem of The Founded Project. Platforms, civic tools, community programs, and consulting services. Human Enterprise Theory grounds all of it.',
}

const PLATFORMS = [
  {
    name: 'The Founded App',
    url: 'https://thefounded.app',
    domain: 'thefounded.app',
    tag: 'Human Enterprise · Personal Governance',
    audience: 'Entrepreneurs · Emerging adults · Black men · Community builders',
    description: 'You\'re already governing your life. This gives you the structure to do it intentionally. Mission. Decisions. Continuity. Built around the life you\'re actually living. The destination for every node in this ecosystem.',
    features: ['Human Enterprise Theory overview', 'Personal governance board', 'Thompson Coaching Method', 'Six capitals tracking', 'Evening ritual + daily check-in', 'Crisis support integration'],
    color: '#0F1B1F',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
  {
    name: 'Founded Emerging',
    url: 'https://thefoundedemerging.app',
    domain: 'thefoundedemerging.app',
    tag: 'Youth Leadership · Emerging Adult Governance',
    audience: 'High school & college students · Youth orgs · Leadership programs · Educators',
    description: 'Human Enterprise Theory applied to emerging adults. For young people building serious lives without a map. Youth-safe and crisis-aware. Parental consent comes with it.',
    features: ['Emerging adult governance curriculum', 'Youth program partnerships', 'Educator resources', 'Parental consent + youth safety', '988 crisis integration', 'Youth cohort enrollment'],
    color: '#1A3A42',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
  {
    name: 'GroundedVote',
    url: 'https://groundedvote.com',
    domain: 'groundedvote.com',
    tag: 'Civic Alignment · Democratic Integrity',
    audience: 'Voters · Organizers · Civic educators · HBCU communities · First-generation voters',
    description: 'Your vote should reflect what you actually believe. GroundedVote asks honest, bias-audited questions and gives you an honest answer. RhetoricalPoints built the AI underneath.',
    features: ['AI-powered voter alignment quiz', 'Bias-audited question pipeline', 'Media literacy toolkit', 'Methodology whitepaper', 'Non-partisan design', 'Civic educator resources'],
    color: '#0D2233',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
  {
    name: 'RhetoricalPoints',
    url: 'https://rhetoricalpoints.com',
    domain: 'rhetoricalpoints.com',
    tag: 'Civic Accountability · Speech Analysis · AI',
    audience: 'Civic educators · Journalists · Voters · Organizations · Students',
    description: 'Public discourse runs on disorientation. Four AI models score political speech in real time. Hear what people are actually saying. Signal restored. The engine that powers GroundedVote.',
    features: ['Real-time speech analysis', 'Four-model AI pipeline', 'Integrity scoring', 'Violation flagging', 'Debate fact-checking', 'Integration with GroundedVote'],
    color: '#1C1C2E',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
]

const SERVICES = [
  {
    name: 'GreyDoc Consulting',
    url: 'https://greydoc.com',
    domain: 'greydoc.com',
    tag: 'Corporate Wellness · AI Training · Integrative Health',
    audience: 'Organizations · Enterprises · Healthcare institutions · Leadership teams',
    description: 'Clinician, author, and builder of systems for human reclamation. Corporate wellness, integrative health consulting, and responsible AI deployment for organizations. Burnout prevention, moral distress, and professional sustainability.',
    features: ['Corporate wellness programs', 'AI literacy and readiness training', 'Integrative health consultation', 'Burnout prevention frameworks', 'Professional sustainability strategy', 'Thompson Coaching Method for teams'],
    color: '#1A1A2E',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
]

const COMMUNITY = [
  {
    name: 'Rooted Reclaimers',
    tag: 'Community · Healing · Reclamation',
    audience: 'Trauma survivors · People in reclamation · Black and Brown communities',
    description: 'The community layer of the Thompson Ecosystem. Trauma-informed education, movement, breathwork, nutrition, and connection. Daily work, done together.',
    features: ['Trauma-informed education', 'Movement + breathwork', 'Nutrition and wellness', 'Community connection', 'Rooted Reset 21-day program', 'Integration with The Founded App'],
    color: '#1B2D1E',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
  {
    name: 'Founded Emerging (Youth Program)',
    url: 'https://thefoundedemerging.app',
    tag: 'Youth · Governance · Leadership',
    audience: 'High school students · College students · Alpha Phi Alpha chapters · Youth orgs',
    description: 'Six governance modules teaching young people the structural tools that school never gets to. Built for high schoolers and college students ready to govern serious lives.',
    features: ['Six governance modules', 'Human Enterprise Theory for youth', 'Emerging adult stewardship', 'HBCU chapter programs', 'Youth leadership curriculum', 'Founded Emerging app access'],
    color: '#2A5A66',
    status: 'Live',
    statusColor: '#3D8B5E',
  },
  {
    name: 'BLACC Retreats',
    tag: 'Healing · Brotherhood · Reclamation',
    audience: 'Black men · Community leaders · People in reclamation',
    description: 'Healing-centered retreat experiences for Black men and communities. Space. Brotherhood. Practice. The conditions reclamation needs.',
    features: ['Healing-centered programming', 'Brotherhood cohorts', 'Breathwork + somatic practice', 'Governance workshops', 'Community building', 'Thompson method integration'],
    color: '#1F1F1F',
    status: 'Building',
    statusColor: '#C88A00',
  },
]

function ProjectCard({ name, url, domain, tag, audience, description, features, color, status, statusColor }) {
  return (
    <div className="grid md:grid-cols-5 gap-0 overflow-hidden rounded-sm" style={{ border: '1px solid rgba(15,27,31,0.08)' }}>
      <div className="md:col-span-2 p-10 flex flex-col justify-between" style={{ backgroundColor: color }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
            <p style={{ color: statusColor, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{status}</p>
          </div>
          <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-3">{tag}</p>
          <h2 className="text-white text-2xl font-semibold mb-2">{name}</h2>
          {domain && <p className="text-gray-400 text-xs">{domain}</p>}
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }}
            className="inline-block mt-8 px-5 py-2.5 text-sm font-semibold rounded hover:opacity-90 transition-opacity w-fit">
            Visit Site →
          </a>
        )}
      </div>
      <div className="md:col-span-3 p-10" style={{ backgroundColor: '#F5F0E8' }}>
        {audience && (
          <>
            <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">Audience</p>
            <p style={{ color: '#0F1B1F' }} className="text-sm mb-6 opacity-70">{audience}</p>
          </>
        )}
        <p style={{ color: '#0F1B1F' }} className="leading-relaxed mb-6 text-sm">{description}</p>
        <ul className="space-y-2">
          {features.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#0F1B1F' }}>
              <span style={{ color: '#D8AB69' }}>→</span> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Ecosystem</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">The Full Ecosystem.</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Every platform, service, and community program in The Founded Project. Human Enterprise Theory grounds all of it. Each one points toward the same destination.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-6">

          <div style={{ borderBottom: '1px solid rgba(15,27,31,0.1)', paddingBottom: 12, marginBottom: 24 }}>
            <span style={{ color: '#D8AB69', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>The Platform</span>
            <h2 style={{ color: '#0F1B1F', fontSize: 22, fontWeight: 300, marginTop: 4 }}>Apps & Digital Tools</h2>
          </div>
          {PLATFORMS.map(p => <ProjectCard key={p.name} {...p} />)}

          <div style={{ borderBottom: '1px solid rgba(15,27,31,0.1)', paddingBottom: 12, marginTop: 48, marginBottom: 24 }}>
            <span style={{ color: '#D8AB69', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>The Practice</span>
            <h2 style={{ color: '#0F1B1F', fontSize: 22, fontWeight: 300, marginTop: 4 }}>Clinical & Consulting Services</h2>
          </div>
          {SERVICES.map(p => <ProjectCard key={p.name} {...p} />)}

          <div style={{ borderBottom: '1px solid rgba(15,27,31,0.1)', paddingBottom: 12, marginTop: 48, marginBottom: 24 }}>
            <span style={{ color: '#D8AB69', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>The Community</span>
            <h2 style={{ color: '#0F1B1F', fontSize: 22, fontWeight: 300, marginTop: 4 }}>Programs & Spaces</h2>
          </div>
          {COMMUNITY.map(p => <ProjectCard key={p.name} {...p} />)}

          {/* Destination */}
          <div style={{ backgroundColor: '#0F1B1F', borderRadius: 8, padding: '48px', textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Destination</p>
            <p style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 300, lineHeight: 1.5, maxWidth: 500, margin: '0 auto 28px' }}>
              Every node in this ecosystem points to one place.
            </p>
            <a href="https://thefounded.app" target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '16px 48px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              The Founded App →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
