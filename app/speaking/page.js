export const metadata = {
  title: 'Speaking | Dr. Stephen Thompson | The Founded Project',
  description: 'Invite Dr. Stephen Thompson to speak. Topics include Human Enterprise Theory, trauma-informed leadership, civic alignment, Black healing, and integrative medicine.',
}

const topics = [
  {
    title: 'Human Enterprise Theory',
    audience: 'Corporations · Universities · Conferences',
    desc: 'How governance structures shape who thrives and who is extracted — and what organizations can do to change that. Bridges structural critique with practical, embodied action.',
  },
  {
    title: 'Survival as Genius',
    audience: 'Healing Communities · Conferences · Faith Spaces',
    desc: 'Reframing trauma adaptation as intelligence. A survivor-scholar-clinician perspective on the nervous system, chronic stress, and what it looks like to truly reclaim agency.',
  },
  {
    title: 'The Algorithmic Plantation',
    audience: 'Civic · Academic · Media',
    desc: 'A deep examination of how digital systems replicate the structural mechanisms of racial exploitation — and how communities build counter-architectures of truth and power.',
  },
  {
    title: 'Integrative Medicine & Whole-Person Care',
    audience: 'Medical · Clinical · Academic',
    desc: 'The intersection of Traditional Chinese Medicine, chiropractic care, trauma-informed practice, and nervous system science. What true whole-person healing looks like in clinical settings.',
  },
  {
    title: 'Civic Alignment in the AI Era',
    audience: 'Civic Organizations · HBCUs · Youth',
    desc: 'How AI-powered tools like GroundedVote can restore trust in democratic participation — and why civic infrastructure needs to be built for those most harmed by the current system.',
  },
  {
    title: 'Emerging Adult Governance',
    audience: 'Greek Organizations · Youth · Educators',
    desc: 'Applied Human Enterprise Theory for high school and college students. Governance of self before governance of the world — the framework for Alpha Phi Alpha and youth leadership programs.',
  },
]

export default function Speaking() {
  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Speaking</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">
            Invite Dr. Thompson
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Dr. Stephen Thompson speaks at the intersection of clinical medicine, civic infrastructure, Black healing, and human governance. He brings the survivor-scholar-clinician perspective to conferences, universities, corporations, and community spaces.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-10">Speaking Topics</p>
          <div className="grid md:grid-cols-2 gap-8">
            {topics.map((topic) => (
              <div key={topic.title} className="border-t-2 pt-6" style={{ borderColor: '#D8AB69' }}>
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{topic.audience}</p>
                <h3 style={{ color: '#0F1B1F' }} className="text-xl font-semibold mb-3">{topic.title}</h3>
                <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-80">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#0F1B1F' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-6">Speaker Bio</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dr. Stephen Thompson is a Doctor of Chiropractic (DC), Doctor of Acupuncture and Chinese Medicine (DACM), and Fellow of the Academy of Integrative Health and Medicine (FAIHM). He is an assistant professor at Northwestern Health Sciences University and the founder of The Founded Project ecosystem.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              His work spans clinical practice, civic technology, book authorship, and youth leadership development. He is the creator of Human Enterprise Theory, the Thompson Coaching Method, and GroundedVote — a nonpartisan civic alignment engine designed to restore policy-based democratic participation.
            </p>
            <p className="text-gray-300 leading-relaxed">
              He speaks from lived experience, clinical depth, and institutional fluency — never from above, always from alongside.
            </p>
          </div>
          <div>
            <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-6">Booking Inquiry</p>
            <form className="space-y-4">
              <div>
                <label className="text-gray-300 text-xs uppercase tracking-wider block mb-1">Name</label>
                <input
                  type="text"
                  style={{ backgroundColor: '#1A3A42', border: '1px solid #2A5A66', color: 'white' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none focus:border-yellow-600 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-gray-300 text-xs uppercase tracking-wider block mb-1">Organization</label>
                <input
                  type="text"
                  style={{ backgroundColor: '#1A3A42', border: '1px solid #2A5A66', color: 'white' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none focus:border-yellow-600 transition-colors"
                  placeholder="Organization or institution"
                />
              </div>
              <div>
                <label className="text-gray-300 text-xs uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  style={{ backgroundColor: '#1A3A42', border: '1px solid #2A5A66', color: 'white' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-gray-300 text-xs uppercase tracking-wider block mb-1">Event Details</label>
                <textarea
                  rows={4}
                  style={{ backgroundColor: '#1A3A42', border: '1px solid #2A5A66', color: 'white' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none resize-none"
                  placeholder="Event type, audience size, date, topic of interest"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }}
                className="w-full py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
