export default function Home() {
  const nodes = [
    {
      name: 'The Founded App',
      url: 'https://thefounded.app',
      tag: 'Human Enterprise Theory',
      description: 'A governance framework for your life. Structure, agency, and continuity for the AI era.',
      color: '#1A3A42',
    },
    {
      name: 'Founded Emerging',
      url: 'https://thefoundedemerging.app',
      tag: 'Youth Leadership',
      description: 'Emerging adult governance. For high school and college students ready to lead themselves before they lead the world.',
      color: '#2A5A66',
    },
    {
      name: 'GroundedVote',
      url: 'https://groundedvote.com',
      tag: 'Civic Alignment',
      description: 'A nonpartisan civic mirror. Discover which candidates actually match your values — not your tribe.',
      color: '#0F1B1F',
    },
  ]

  const books = [
    { title: 'The South Never Lost', status: 'Available', desc: 'The algorithmic plantation, democratic integrity, and the truth about what the South is still fighting for.' },
    { title: 'Journey from the Edge', status: 'Forthcoming', desc: 'Survival architecture, nervous system adaptation, and the road back to agency.' },
    { title: 'P/AIRS Bodywork', status: 'Forthcoming', desc: 'A practitioner manual for trauma-informed somatic care and relational healing.' },
    { title: 'Human Enterprise Theory', status: 'Forthcoming', desc: 'The governance framework that protects reclaimed agency through structure, counsel, and community.' },
  ]

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0F1B1F', minHeight: '90vh' }} className="flex items-center px-6 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-3xl">
            <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-6">
              The Founded Project
            </p>
            <h1 className="text-white text-5xl md:text-6xl font-light leading-tight mb-8">
              Get humans<br />
              <span style={{ color: '#D8AB69' }}>organized</span> and<br />
              reinforced.
            </h1>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />
            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mb-12">
              The Founded Project is the ecosystem of Dr. Stephen Thompson — survivor-scholar-clinician, DACM, DC, FAIHM. Books, platforms, civic tools, and healing infrastructure built for the questions society isn&apos;t asking yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/about" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="inline-block px-8 py-4 font-semibold text-sm rounded hover:opacity-90 transition-opacity">
                Meet Dr. Thompson
              </a>
              <a href="/projects" style={{ border: '1px solid #D8AB69', color: '#D8AB69' }} className="inline-block px-8 py-4 font-semibold text-sm rounded hover:bg-white/5 transition-colors">
                Explore the Ecosystem
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">The Work</p>
            <h2 style={{ color: '#0F1B1F' }} className="text-3xl md:text-4xl font-light leading-relaxed mb-6">
              Modern life is not randomly traumatizing.<br />
              It is <em>organized</em> that way.
            </h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              Some communities inherit governance structures before they even know those structures have a name. Mentorship, financial literacy, institutional fluency, protected experimentation. That inheritance is called privilege plasticity.
            </p>
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-8">
              Others develop survival plasticity — adapting to endure threat and uncertainty. The Founded Project is built for those people. The tools, frameworks, and platforms here translate the protective intelligence of governance into human-centered life architecture.
            </p>
            <a href="/about" style={{ color: '#0F1B1F', borderBottom: '1px solid #D8AB69' }} className="text-sm font-semibold pb-1 hover:opacity-70 transition-opacity">
              Read the full framework
            </a>
          </div>
        </div>
      </section>

      {/* Ecosystem Nodes */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">The Ecosystem</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-3xl font-light mb-12">Three nodes. One mission.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <a
                key={node.name}
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 rounded-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: node.color }}
              >
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-3">{node.tag}</p>
                <h3 className="text-white text-xl font-semibold mb-4">{node.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{node.description}</p>
                <span style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider">Visit site →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Books */}
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Published & Forthcoming</p>
          <h2 className="text-white text-3xl font-light mb-12">The Books</h2>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: '#D8AB69' }}>
            {books.map((book) => (
              <div key={book.title} className="p-8" style={{ backgroundColor: '#0F1B1F' }}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">{book.title}</h3>
                  <span
                    style={{
                      backgroundColor: book.status === 'Available' ? '#D8AB69' : 'transparent',
                      color: book.status === 'Available' ? '#0F1B1F' : '#D8AB69',
                      border: book.status !== 'Available' ? '1px solid #D8AB69' : 'none',
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded ml-4 whitespace-nowrap"
                  >
                    {book.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{book.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href="/books" style={{ color: '#D8AB69', borderBottom: '1px solid #D8AB69' }} className="text-sm font-semibold pb-1 hover:opacity-70 transition-opacity">
              View all books
            </a>
          </div>
        </div>
      </section>

      {/* Credentials strip */}
      <section style={{ backgroundColor: '#D8AB69' }} className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p style={{ color: '#0F1B1F' }} className="font-semibold text-lg">Dr. Stephen Thompson</p>
            <p style={{ color: '#0F1B1F' }} className="text-sm opacity-80">DC · DACM · FAIHM · Northwestern Health Sciences University · AIHM Fellow</p>
          </div>
          <a href="/speaking" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69' }} className="px-6 py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity whitespace-nowrap">
            Invite Dr. Thompson to Speak
          </a>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto max-w-2xl">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Connect</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-3xl font-light mb-6">Publishers. Media. Partners. Readers.</h2>
          <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-8 opacity-80">
            The Founded Project is growing. If you are a publisher, journalist, academic institution, civic organization, or aligned individual — this is the place to begin.
          </p>
          <a href="/contact" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69' }} className="inline-block px-8 py-4 font-semibold text-sm rounded hover:opacity-90 transition-opacity">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  )
}
