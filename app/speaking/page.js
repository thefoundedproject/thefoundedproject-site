/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * Speaking page — talk topics, format, credentials, and inquiry path.
 */

export const metadata = {
  title: 'Speaking | The Founded Project',
  description: 'Dr. Stephen Thompson speaks on Human Enterprise Theory, body-first medicine, civic agency, and the architecture of self-governance. Conferences, keynotes, and institutional cohorts.',
}

function TalkCard({ title, audience, blurb }) {
  return (
    <article style={{ borderTop: '1px solid rgba(15,27,31,0.12)', padding: '28px 0' }}>
      <h3 style={{ color: '#0F1B1F', fontSize: 20, fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{audience}</p>
      <p style={{ color: 'rgba(15,27,31,0.78)', fontSize: 16, lineHeight: 1.7 }}>{blurb}</p>
    </article>
  )
}

export default function SpeakingPage() {
  return (
    <main style={{ backgroundColor: '#F5F0E8' }} className="min-h-screen px-6 py-24">
      <article className="max-w-3xl mx-auto">
        <a href="/" style={{ color: 'rgba(15,27,31,0.5)' }} className="text-xs uppercase tracking-widest mb-6 inline-block hover:opacity-80">
          ← Home
        </a>
        <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-3">Speaking</p>
        <h1 style={{ color: '#0F1B1F' }} className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
          Bringing the work to your audience.
        </h1>
        <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 620 }} className="mb-16">
          Dr. Stephen Thompson speaks at conferences, professional gatherings, institutional cohorts, and educational settings. The talks are clinical where the audience is clinical, philosophical where the audience is philosophical, and practical where the work has to land in someone&apos;s Monday morning.
        </p>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ color: '#0F1B1F', fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Topics</h2>
          <p style={{ color: 'rgba(15,27,31,0.55)', fontSize: 13, marginBottom: 8 }}>Each topic comes as a 45-minute keynote, a 90-minute workshop, or a multi-session cohort engagement.</p>

          <TalkCard
            title="Human Enterprise Theory: Your Life Is the Most Important Enterprise You Will Ever Run"
            audience="General audiences · Conferences · Universities"
            blurb="The framework that treats every person as an enterprise with a mission, a board, departments, and capital being stewarded across years. The diagnosis (extraction) and the destination (governance) in one talk."
          />
          <TalkCard
            title="Body-First Medicine: What the Fascia Knows the Chart Doesn&apos;t"
            audience="Clinical · Bodywork · Integrative medicine"
            blurb="Fifteen years of clinical work with patients whose bodies remembered what their charts couldn&apos;t hold. The clinical case for P/AIRS bodywork and somatic-first practice."
          />
          <TalkCard
            title="The Algorithmic Plantation: Civic Agency in the Age of Extraction"
            audience="Civic · Political · Educational · HBCU"
            blurb="The South as proving ground for algorithmic extraction at scale. How belief, vote, and self-image get shaped, and the media literacy that protects against it. Draws from The South Never Lost."
          />
          <TalkCard
            title="Emerging Adult Governance: Before They Build Anything, They Need a Mission"
            audience="High schools · Colleges · Fraternities/sororities · Youth orgs"
            blurb="The case for teaching governance of self before any of the bigger goals. The Founded Emerging framework, the six capitals, the architecture for the first decade of adult decisions."
          />
          <TalkCard
            title="Survivor Genius: Treating Adaptation as Brilliance, Not Damage"
            audience="Mental health · Trauma-informed · Recovery"
            blurb="The clinical orientation that grounds the entire Founded Project: survival is genius. The work is to give that genius somewhere to go. Drawn from Journey from the Edge and the clinical practice underneath it."
          />
        </section>

        <section style={{ marginBottom: 64 }}>
          <h2 style={{ color: '#0F1B1F', fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Credentials</h2>
          <div style={{ backgroundColor: 'rgba(216,171,105,0.08)', borderLeft: '3px solid #9E6F2C', padding: '24px 28px', borderRadius: '0 8px 8px 0' }}>
            <p style={{ color: '#0F1B1F', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
              <b>Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM</b>
            </p>
            <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
              Chiropractor (Doctor of Chiropractic), Doctor of Acupuncture and Chinese Medicine, Board-Certified Therapeutic Massage and Bodywork, Fellow of the Academy of Integrative Health and Medicine. Twenty years of clinical practice, training faculty for AIHM and Northwestern Health Sciences University, and the builder of the Founded Project ecosystem.
            </p>
          </div>
        </section>

        <div style={{ padding: '32px 36px', backgroundColor: '#0F1B1F', borderRadius: 10 }}>
          <p style={{ color: '#D8AB69', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Coming Soon</p>
          <h3 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 400, marginBottom: 12, lineHeight: 1.4 }}>
            A formal speaker reel, a press kit, and an online booking calendar are in production.
          </h3>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
            In the meantime, the cleanest path is direct contact. Tell us your event, your audience, your dates, and the topic that fits. We respond within two business days.
          </p>
          <a href="/contact" style={{ color: '#D8AB69', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.4)', paddingBottom: 2 }}>
            Inquire about speaking →
          </a>
        </div>

        <p style={{ color: 'rgba(15,27,31,0.5)' }} className="text-sm italic mt-12">
          Dr. Stephen Thompson, DC, DACM, BCTMB, FAIHM<br />
          The Founded Project
        </p>
      </article>
    </main>
  )
}
