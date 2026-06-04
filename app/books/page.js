export const metadata = {
  title: 'Books | The Founded Project',
  description: 'Books by Dr. Stephen Thompson — The South Never Lost, Journey from the Edge, P/AIRS Bodywork, The Founded: A Human Enterprise Project, and more.',
}

const books = [
  {
    title: 'The South Never Lost',
    status: 'Complete',
    category: 'Civic · History · Culture',
    description: 'The algorithmic plantation, democratic integrity, and the truth about what the South has always known. What the South has always known and protected. An unfinished reckoning.',
    themes: ['Civic truth-telling', 'Algorithmic governance', 'Black Southern resilience', 'Democratic integrity'],
  },
  {
    title: 'Journey from the Edge',
    status: 'Forthcoming',
    category: 'Memoir · Trauma · Reclamation',
    description: 'A survival architecture memoir. The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice.',
    themes: ['Nervous system', 'Survival plasticity', 'Reclamation', 'Lived experience'],
  },
  {
    title: 'P/AIRS Bodywork',
    status: 'Forthcoming',
    category: 'Clinical · Somatic · Practitioner',
    description: 'A practitioner manual for trauma-informed somatic care and relational healing. Designed for clinicians, bodyworkers, and healers who work at the intersection of body, memory, and relationship. Grounded in Traditional Chinese Medicine, chiropractic, and the Thompson Coaching Method.',
    themes: ['Somatic care', 'Trauma-informed practice', 'Relational healing', 'TCM integration'],
  },
  {
    title: 'The Founded: A Human Enterprise Project',
    status: 'Forthcoming',
    category: 'Governance · Community · Agency',
    description: 'The governance framework that protects reclaimed agency through structure, counsel, data stewardship, and community coordination. Humanizing the corporation, not corporatizing the human. For individuals, families, and communities navigating the AI era.',
    themes: ['Personal governance', 'Community power', 'Privilege plasticity', 'AI era navigation'],
  },
  {
    title: 'The Guide to Perfect Touch',
    status: 'In Development',
    category: 'Clinical · Relationship · Body',
    description: 'A clinical and relational guide to embodied presence in healing touch. What it means to be present with another body — how to listen with your hands, read what the nervous system is signaling, and respond with care rather than technique.',
    themes: ['Clinical touch', 'Embodied presence', 'Relational care', 'Nervous system'],
  },
  {
    title: '1 to 5: The Business of Healing',
    status: 'In Development',
    category: 'Business · Consulting · Practitioners',
    description: 'A consulting and business framework for healing practitioners who are ready to scale. The financial architecture, decision systems, and leadership structures that allow mission-driven clinicians to build without burning out.',
    themes: ['Practitioner business', 'Revenue architecture', 'Mission-driven scaling', 'Sustainable practice'],
  },
]

export default function Books() {
  const available = books.filter(b => b.status === 'Complete')
  const forthcoming = books.filter(b => b.status !== 'Complete')

  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Written Work</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">The Books</h1>
          <p className="text-gray-300 text-lg max-w-2xl">Six active book projects. Each one a different entry point into the same urgent question: what does it take for people — all people — to build lives of real agency and durable flourishing?</p>
        </div>
      </section>

      {available.length > 0 && (
        <section style={{ backgroundColor: '#D8AB69' }} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p style={{ color: '#0F1B1F' }} className="text-sm font-semibold uppercase tracking-widest mb-8">Available Now</p>
            {available.map((book) => (
              <div key={book.title} style={{ backgroundColor: '#0F1B1F' }} className="p-10 rounded-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{book.category}</p>
                    <h2 className="text-white text-2xl font-semibold">{book.title}</h2>
                  </div>
                  <span style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="text-xs font-semibold px-3 py-1 rounded">
                    {book.status}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">{book.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {book.themes.map(t => (
                    <span key={t} style={{ border: '1px solid #D8AB69', color: '#D8AB69' }} className="text-xs px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <a href="/contact" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="inline-block px-6 py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity">
                  Inquire About This Book
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-10">Forthcoming & In Development</p>
          <div className="grid md:grid-cols-2 gap-8">
            {forthcoming.map((book) => (
              <div key={book.title} className="border-t-2 pt-6" style={{ borderColor: '#D8AB69' }}>
                <div className="flex items-start justify-between mb-3">
                  <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider">{book.category}</p>
                  <span style={{ color: '#0F1B1F', border: '1px solid #0F1B1F' }} className="text-xs px-2 py-0.5 rounded opacity-50">{book.status}</span>
                </div>
                <h3 style={{ color: '#0F1B1F' }} className="text-xl font-semibold mb-4">{book.title}</h3>
                <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed mb-4 opacity-80">{book.description}</p>
                <div className="flex flex-wrap gap-2">
                  {book.themes.map(t => (
                    <span key={t} style={{ backgroundColor: '#0F1B1F', color: '#D8AB69' }} className="text-xs px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#0F1B1F' }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-light mb-2">Publishers and literary agents welcome.</h2>
            <p className="text-gray-400 text-sm">All six manuscripts are at varying stages of development with existing frameworks, canvases, and research.</p>
          </div>
          <a href="/contact" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="px-6 py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity whitespace-nowrap">
            Publisher Inquiries
          </a>
        </div>
      </section>
    </>
  )
}
