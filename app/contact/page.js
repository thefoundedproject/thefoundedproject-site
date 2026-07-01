/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * Contact page. Surfaced as Support URL for App Store Connect (The Founded iOS app).
 */

export const metadata = {
  title: 'Contact | The Founded Project',
  description: 'Reach The Founded Project for app support, partnerships, speaking, or anything else.',
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{ color: '#0F1B1F' }} className="text-xl font-bold mb-3">{title}</h2>
      <div style={{ color: 'rgba(15,27,31,0.78)' }} className="leading-relaxed space-y-3 [&_a]:underline">
        {children}
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: '#F5F0E8' }} className="min-h-screen px-6 py-24">
      <article className="max-w-2xl mx-auto">
        <a href="/" style={{ color: 'rgba(15,27,31,0.5)' }} className="text-xs uppercase tracking-widest mb-6 inline-block hover:opacity-80">
          ← Home
        </a>
        <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-3">
          Contact
        </p>
        <h1 style={{ color: '#0F1B1F' }} className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-2">
          Get in touch.
        </h1>
        <p style={{ color: 'rgba(15,27,31,0.55)' }} className="text-sm mb-12">Dr. Thompson reads what comes in. Replies usually arrive within 1–2 business days.</p>

        <Section title="App support — The Founded">
          <p>
            Trouble with The Founded app, a question about how a feature works, or a bug you ran into. Send a short description of what you were doing and what happened, plus your device model and iOS version if you have them.
          </p>
          <p>
            <a href="mailto:Thefoundedproject@gmail.com" style={{ color: '#D8AB69' }} className="font-bold">
              Thefoundedproject@gmail.com
            </a>
          </p>
        </Section>

        <Section title="Speaking, press, podcasts">
          <p>
            For interviews, conference invitations, or podcast appearances for Dr. Stephen Thompson — clinician, AIHM Fellow, author of The South Never Lost and Founded Emerging — use the email above with &quot;Press&quot; or &quot;Speaking&quot; in the subject line.
          </p>
        </Section>

        <Section title="Partnerships">
          <p>
            For institutional partnerships, fellowship collaboration (AIHM, NWHSU), cohort or curriculum partnerships, or platform integrations, use the email above with &quot;Partnership&quot; in the subject line.
          </p>
        </Section>

        <Section title="Clinical practice">
          <p>
            Patient inquiries and existing-practice questions are handled separately from this site. Existing patients should use the channel they already have. New-patient inquiries are not currently being accepted through this email.
          </p>
        </Section>

        <Section title="Mailing address">
          <p style={{ color: 'rgba(15,27,31,0.6)' }}>
            The Founded Project<br />
            c/o Dr. Stephen Thompson<br />
            Minneapolis, MN, USA
          </p>
        </Section>

        <Section title="About">
          <p style={{ color: 'rgba(15,27,31,0.6)' }} className="italic">
            Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM<br />
            Founder, The Founded Project
          </p>
        </Section>
      </article>
    </main>
  )
}
