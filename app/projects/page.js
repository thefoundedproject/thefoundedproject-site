export const metadata = {
  title: 'Projects | The Founded Project Ecosystem',
  description: 'The Founded Project: The Founded App, Founded Emerging, and GroundedVote. Three platforms built on Human Enterprise Theory.',
}

export default function Projects() {
  const projects = [
    {
      name: 'The Founded App',
      url: 'https://thefounded.app',
      domain: 'thefounded.app',
      tag: 'Human Enterprise · Personal Governance',
      audience: 'Entrepreneurs · Emerging adults · Black men · Community builders',
      description: 'The flagship platform. The personal governance platform. Mission, board, six capitals, decisions, and continuity built around the life you're actually living.',
      features: ['Human Enterprise Theory overview', 'Thompson Coaching Method', 'Rooted Reclaimers community', 'App download (iOS + Android)'],
      color: '#1A3A42',
    },
    {
      name: 'Founded Emerging',
      url: 'https://thefoundedemerging.app',
      domain: 'thefoundedemerging.app',
      tag: 'Youth Leadership · Emerging Adult Governance',
      audience: 'High school & college students · Youth orgs · Leadership programs · Educators',
      description: 'Human Enterprise Theory applied to emerging adults. For young people building serious lives before anyone handed them the map.',
      features: ['Emerging adult governance curriculum', 'Youth program partnerships', 'Educator resources', 'Youth cohort enrollment'],
      color: '#2A5A66',
    },
    {
      name: 'GroundedVote',
      url: 'https://groundedvote.com',
      domain: 'groundedvote.com',
      tag: 'Civic Alignment · Democratic Integrity',
      audience: 'Voters · Organizers · Civic educators · HBCU communities · First-generation voters',
      description: 'A nonpartisan civic tool. GroundedVote shows you which candidates match what you actually believe. Built on bias-audited AI developed through RhetoricalPoints.',
      features: ['AI-powered voter alignment quiz', 'Bias-audited question pipeline', 'Media literacy toolkit', 'Methodology whitepaper'],
      color: '#0F1B1F',
    },
  ]

  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Ecosystem</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">Three Platforms.<br />One Framework.</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Every platform in The Founded Project is built on Human Enterprise Theory. The conviction that ordinary people deserve the structural intelligence that institutions use every day.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {projects.map((project, i) => (
            <div
              key={project.name}
              className="grid md:grid-cols-5 gap-0 overflow-hidden rounded-sm"
            >
              <div
                className="md:col-span-2 p-10 flex flex-col justify-between"
                style={{ backgroundColor: project.color }}
              >
                <div>
                  <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-3">{project.tag}</p>
                  <h2 className="text-white text-2xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-gray-400 text-xs">{project.domain}</p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }}
                  className="inline-block mt-8 px-5 py-2.5 text-sm font-semibold rounded hover:opacity-90 transition-opacity w-fit"
                >
                  Visit Site →
                </a>
              </div>
              <div className="md:col-span-3 p-10" style={{ backgroundColor: '#F5F0E8' }}>
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">Audience</p>
                <p style={{ color: '#0F1B1F' }} className="text-sm mb-6 opacity-70">{project.audience}</p>
                <p style={{ color: '#0F1B1F' }} className="leading-relaxed mb-6 text-sm">{project.description}</p>
                <ul className="space-y-2">
                  {project.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#0F1B1F' }}>
                      <span style={{ color: '#D8AB69' }}>→</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
