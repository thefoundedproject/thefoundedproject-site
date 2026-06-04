export const metadata = {
  title: 'Contact | The Founded Project',
  description: 'Connect with Dr. Stephen Thompson and The Founded Project. Publishers, media, partners, speaking invitations, and patient inquiries welcome.',
}

export default function Contact() {
  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">Contact</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">Get in Touch</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Publishers. Media. Partners. Speaking invitations. Clinical inquiries. The door is open for aligned conversations.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />
            <div className="space-y-10">
              {[
                {
                  type: 'Publishers & Literary Agents',
                  desc: 'Six manuscripts in active development. Existing frameworks, research canvases, and complete drafts available for review. Ready to discuss all projects.',
                },
                {
                  type: 'Media & Press',
                  desc: 'Available for interviews, podcasts, documentary work, and written features. Topics: Human Enterprise Theory, trauma-informed care, civic alignment, Black healing, integrative medicine.',
                },
                {
                  type: 'Speaking & Events',
                  desc: 'Keynote, panel, workshop, and university engagement available. Use the speaking page for full topic list and booking form.',
                },
                {
                  type: 'Partnership & Collaboration',
                  desc: 'Civic organizations, HBCUs, Greek-letter organizations, academic institutions, and aligned funders. Let&apos;s talk about what we can build together.',
                },
                {
                  type: 'Clinical Inquiries',
                  desc: 'For existing and prospective patients of Stockheart Whole Health and associated practices. Chiropractic, acupuncture, integrative care.',
                },
              ].map((item) => (
                <div key={item.type} className="border-l-2 pl-6" style={{ borderColor: '#D8AB69' }}>
                  <p style={{ color: '#0F1B1F' }} className="font-semibold mb-2">{item.type}</p>
                  <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <form className="space-y-5">
              <div>
                <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Name *</label>
                <input
                  type="text"
                  required
                  style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none focus:ring-2"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Organization</label>
                <input
                  type="text"
                  style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                  placeholder="Publisher, institution, media outlet, organization..."
                />
              </div>
              <div>
                <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Reason for Contact *</label>
                <select
                  style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none"
                >
                  <option value="">Select one...</option>
                  <option>Publisher / Literary Agent</option>
                  <option>Media / Press</option>
                  <option>Speaking / Event</option>
                  <option>Partnership / Collaboration</option>
                  <option>Clinical Inquiry</option>
                  <option>General</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Message *</label>
                <textarea
                  rows={5}
                  required
                  style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }}
                  className="w-full px-4 py-3 text-sm rounded outline-none resize-none"
                  placeholder="Tell us what you have in mind."
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#0F1B1F', color: '#D8AB69' }}
                className="w-full py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
