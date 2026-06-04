export const metadata = {
  title: 'About Dr. Stephen Thompson | The Founded Project',
  description: 'Dr. Stephen Thompson, DC, DACM, FAIHM — survivor-scholar-clinician, author, and founder of Human Enterprise Theory. Three generations of healers. Two decades of practice.',
}

export default function About() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 className="text-white text-5xl font-light leading-tight mb-6">
            Dr. Stephen Thompson
          </h1>
          <p style={{ color: '#D8AB69' }} className="text-lg mb-2">DC · DACM · FAIHM</p>
          <p className="text-gray-400">Northwestern Health Sciences University · AIHM Fellow · Survivor-Scholar-Clinician</p>
        </div>
      </section>

      {/* Bio */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div style={{ width: '60px', height: '2px', backgroundColor: '#D8AB69' }} className="mb-8" />
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              Coming from three generations of doctors, Dr. Stephen Thompson was introduced to medicine at a very early age. He completed his undergraduate work at Guilford College, then attended the prestigious Emperor&apos;s College of Traditional Oriental Medicine and Northwestern Health Sciences University, where he focused on orthopedics, pain management, and psycho-emotional disorders.
            </p>
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              With nearly two decades in clinical medicine, Dr. Thompson brings extensive experience from multiple integrative care settings. His practice incorporates Chiropractic Medicine and Traditional Chinese Medicine — including chiropractic adjustments, acupuncture, Chinese herbal therapy, bodywork, nutrition counseling, rehabilitation, and lifestyle design.
            </p>
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed mb-6">
              He is an assistant professor and lecturer at Northwestern Health Sciences University in Bloomington, MN, in the College of Health and Wellness, with emphasis on integrative care and clinical massage therapy. He volunteers his time providing trauma-informed care within the community.
            </p>
            <p style={{ color: '#0F1B1F' }} className="text-lg leading-relaxed">
              His work spans clinical practice, academic instruction, book authorship, app development, and civic technology. The throughline is a single conviction: survival is genius. Adaptation is brilliance. The goal is to give people the structure to protect what they&apos;ve built.
            </p>
          </div>
          <div>
            <div style={{ backgroundColor: '#0F1B1F' }} className="p-8 rounded-sm">
              <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-widest mb-6">Credentials</p>
              <ul className="space-y-4">
                {[
                  { abbr: 'DC', full: 'Doctor of Chiropractic' },
                  { abbr: 'DACM', full: 'Doctor of Acupuncture & Chinese Medicine' },
                  { abbr: 'FAIHM', full: 'Fellow, Academy of Integrative Health & Medicine' },
                  { abbr: 'LAc', full: 'Licensed Acupuncturist' },
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
                <li>Northwestern Health Sciences University</li>
                <li>Emperor&apos;s College of Traditional Oriental Medicine</li>
                <li>Guilford College</li>
                <li>AIHM Fellowship</li>
                <li>Stockheart Whole Health</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69' }} className="text-sm font-semibold uppercase tracking-widest mb-4">The Thompson Ecosystem</p>
          <h2 style={{ color: '#0F1B1F' }} className="text-3xl font-light mb-12">Three layers. One arc.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Journey from the Edge',
                theme: 'Survival Architecture',
                desc: 'People do not make isolated choices in a neutral world. They adapt to conditions. Journey from the Edge names those adaptations and begins the work of reclamation.',
              },
              {
                name: 'Rooted Reclaimers',
                theme: 'Reclamation',
                desc: 'The community and educational layer. Trauma-informed education, movement, breathwork, nutrition, and connection — helping people recover agency and embodied awareness.',
              },
              {
                name: 'The Human Enterprise',
                theme: 'Governance & Protection',
                desc: 'Healing creates possibility. The Human Enterprise gives that possibility structure — mission, values, advisory support, data stewardship, and community coordination.',
              },
            ].map((layer) => (
              <div key={layer.name} className="border-t-2 pt-6" style={{ borderColor: '#D8AB69' }}>
                <p style={{ color: '#D8AB69' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{layer.theme}</p>
                <h3 style={{ color: '#0F1B1F' }} className="text-lg font-semibold mb-4">{layer.name}</h3>
                <p style={{ color: '#0F1B1F' }} className="text-sm leading-relaxed opacity-80">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0F1B1F' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-white text-2xl font-light mb-2">Ready to connect?</h2>
            <p className="text-gray-400 text-sm">Publishers, media, speaking invitations, and partnership inquiries welcome.</p>
          </div>
          <div className="flex gap-4">
            <a href="/speaking" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="px-6 py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity">
              Speaking
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
