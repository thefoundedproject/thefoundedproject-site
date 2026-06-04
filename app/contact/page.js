'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', reason: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

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
                { type: 'Publishers & Literary Agents', desc: 'Six manuscripts in active development. Existing frameworks, research canvases, and complete drafts available for review.' },
                { type: 'Media & Press', desc: 'Available for interviews, podcasts, documentary work, and written features. Topics: Human Enterprise Theory, trauma-informed care, civic alignment, Black healing, integrative medicine.' },
                { type: 'Speaking & Events', desc: 'Keynote, panel, workshop, and university engagement available. See the speaking page for full topic list.' },
                { type: 'Partnership & Collaboration', desc: 'Civic organizations, HBCUs, Greek-letter organizations, academic institutions, and aligned funders.' },
                { type: 'Clinical Inquiries', desc: 'For existing and prospective patients of Stockheart Whole Health and associated practices.' },
              ].map((item) => (
                <div key={item.type} className="border-l-2 pl-6" style={{ borderColor: '#D8AB69' }}>
                  <p style={{ color: '#0F1B1F' }} className="font-semibold mb-2">{item.type}</p>
                  <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div style={{ backgroundColor: '#0F1B1F', borderRadius: '12px' }} className="p-10 text-center">
                <p style={{ color: '#D8AB69' }} className="text-4xl mb-4">✦</p>
                <p className="text-white text-xl font-semibold mb-3">Message received.</p>
                <p className="text-gray-300 text-sm leading-relaxed">Dr. Thompson or a member of the team will be in touch. Thank you for reaching out.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Name *</label>
                  <input required value={form.name} onChange={set('name')} type="text" style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }} className="w-full px-4 py-3 text-sm rounded outline-none" placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Email *</label>
                  <input required value={form.email} onChange={set('email')} type="email" style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }} className="w-full px-4 py-3 text-sm rounded outline-none" placeholder="your@email.com" />
                </div>
                <div>
                  <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Organization</label>
                  <input value={form.organization} onChange={set('organization')} type="text" style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }} className="w-full px-4 py-3 text-sm rounded outline-none" placeholder="Publisher, institution, media outlet..." />
                </div>
                <div>
                  <label style={{ color: '#0F1B1F' }} className="text-xs font-semibold uppercase tracking-wider block mb-1">Reason for Contact *</label>
                  <select required value={form.reason} onChange={set('reason')} style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }} className="w-full px-4 py-3 text-sm rounded outline-none">
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
                  <textarea required value={form.message} onChange={set('message')} rows={5} style={{ backgroundColor: 'white', border: '1px solid #D8AB69', color: '#0F1B1F' }} className="w-full px-4 py-3 text-sm rounded outline-none resize-none" placeholder="Tell us what you have in mind." />
                </div>
                {status === 'error' && (
                  <p style={{ color: '#B4533C' }} className="text-sm">Something went wrong. Please try again or email directly.</p>
                )}
                <button type="submit" disabled={status === 'sending'} style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', opacity: status === 'sending' ? 0.7 : 1 }} className="w-full py-4 text-sm font-semibold rounded transition-opacity">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
