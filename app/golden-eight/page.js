// ─── ENROLLMENT SWITCH ────────────────────────────────────────────────────────
// One line controls the enrollment button. Stripe is live (Rooted Reclaimers LLC,
// public name The Founded Project LLC), but no payment link exists yet for this
// specific course, so STRIPE_PAYMENT_LINK is empty and the button reads "Reserve
// a seat", opening an email to docthompsondacmdc@gmail.com with the subject
// filled in. Create a one-time $249 price + payment link in Stripe, paste the
// link between the quotes below, and the button becomes Stripe checkout.
// Nothing else on the page changes.
const STRIPE_PAYMENT_LINK = ''

const RESERVE_MAILTO =
  'mailto:docthompsondacmdc@gmail.com?subject=' +
  encodeURIComponent('Reserve a seat: Golden Eight, Cohort 1')

const ENROLL_HREF = STRIPE_PAYMENT_LINK || RESERVE_MAILTO
const ENROLL_LABEL = STRIPE_PAYMENT_LINK ? 'Enroll · $249' : 'Reserve a seat'

export const metadata = {
  alternates: { canonical: '/golden-eight' },
  title: 'Golden Eight | The Founded Project',
  description:
    'Golden Eight, a ten-week Baduanjin course taught live by Stephen Thompson. Cohort 1 starts the week of November 12, 2026. 8 to 10 seats. $249.',
}

const MODULES = [
  { n: '01', title: 'Entering the Brocade', line: 'The five evidence lanes, a standing or seated base, and unforced breath. You learn to change or stop a movement without apology, before you learn the first one.' },
  { n: '02', title: 'Hold Up Heaven (Two Hands)', line: 'An upward reach that lengthens the whole trunk. Sanjiao named as a traditional whole-region framework, not a map onto Western anatomy.' },
  { n: '03', title: 'Draw the Bow (Left and Right)', line: 'A wide stance and an archer’s draw, worked on both sides. Liver and Lung named as a traditional relationship, not an anatomical left-right claim.' },
  { n: '04', title: 'Raise One Hand / Separate Heaven and Earth', line: 'One hand rises while the other presses down, alternating sides without leaning. Spleen ascent and Stomach descent, named as the traditional middle-region model they are.' },
  { n: '05', title: 'Look Back (Wise Owl Gazes Backward)', line: 'A gentle rotation led by the eyes, then the neck, then the upper trunk, with full return to center between sides. Eye-only movement is offered for anyone managing dizziness or neck concerns.' },
  { n: '06', title: 'Sway the Head and Swing the Tail', line: 'A side-to-side weight shift and trunk arc, in standing or seated form. Heart and Kidney named as a traditional upper-lower model, not literal cardiac heat.' },
  { n: '07', title: 'Reach the Feet (Two Hands)', line: 'A supported hip hinge and a controlled return. Foot contact is optional; the fold and the return get the attention, not the reach.' },
  { n: '08', title: 'Fists and Fierce Eyes', line: 'Deliberate muscular effort, then a full release. “Angry eyes” means a focused gaze, not an emotional state.' },
  { n: '09', title: 'Seven Jolts', line: 'A slow heel raise and a quiet landing, up to seven rounds. Fewer rounds is the sounder choice when fatigue builds, not a failed attempt.' },
  { n: '10', title: 'Weaving the Eight', line: 'The full sequence, led twice: once for technique, once for continuity. You leave with a practice plan sized to your actual week.' },
]

function FactPill({ label, value }) {
  return (
    <div style={{ border: '1px solid rgba(216,171,105,0.3)', borderRadius: 8, padding: '16px 22px', minWidth: 150 }}>
      <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
      <p style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 600 }}>{value}</p>
    </div>
  )
}

function EnrollButton({ dark }) {
  return (
    <a
      href={ENROLL_HREF}
      style={{
        backgroundColor: dark ? '#0F1B1F' : '#D8AB69',
        color: dark ? '#D8AB69' : '#0F1B1F',
        padding: '14px 36px',
        borderRadius: 6,
        fontSize: 15,
        fontWeight: 700,
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      {ENROLL_LABEL} →
    </a>
  )
}

export default function GoldenEight() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '96px 24px 72px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Golden Eight</p>
          <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, maxWidth: 720 }}>
            Eight movements. <span style={{ color: '#D8AB69' }}>A practice you actually keep.</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 17, lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            Golden Eight is a ten-week introduction to Baduanjin, taught live by Stephen Thompson and built around
            the standardized Health Qigong sequence. You learn each movement standing, get a seated and
            reduced-range version of every one, and learn which claims come from history, from traditional Chinese
            medicine, from the modern Health Qigong standard, from biomedical research, and from Rooted Reclaimers&#39;
            own agency framework, so you always know what kind of claim you are hearing.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 15, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>
            Cohort 1 starts the week of November 12, 2026. 8 to 10 seats. First cohort.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <EnrollButton />
            <a href="#the-cohort" style={{ border: '1px solid rgba(216,171,105,0.3)', color: 'rgba(216,171,105,0.8)', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              How the cohort runs ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <FactPill label="Starts" value="Week of Nov 12, 2026" />
            <FactPill label="Seats" value="8 to 10" />
            <FactPill label="Price" value="$249" />
            <FactPill label="Format" value="Live, Saturdays 7:00am Central" />
          </div>
        </div>
      </section>

      {/* ── WHAT THIS TRAINS ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>What this trains</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Eight movements built for repetition, not for a stage.
          </h2>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Baduanjin means Eight Pieces of Brocade. The name reaches back to Song-era literature, and the
            movements and their sequencing have changed across centuries of daoyin texts. This course anchors on
            the modern standardized Health Qigong sequence, and teaches the traditional Chinese medicine
            associations that travel with each movement as what they are: a traditional framework, not an anatomy
            lesson.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Every module runs the same way. You learn the standing version first, then get the seated or
            reduced-range version built into that same module, not bolted on as an afterthought. Where the seated
            version changes something real, a balance point, a weight shift, a range of motion, the module names
            the change instead of hiding it. Five evidence lanes run under every claim you hear: what history
            documents, what traditional Chinese medicine holds as a framework, what the modern Health Qigong
            standard sets as technique, what biomedical research has actually measured, and what Rooted Reclaimers&#39;
            agency framework draws from the movement. You leave able to tell those five apart on your own.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            The course fits a thoughtful beginner or a returning practitioner who wants a calm, structured practice
            and prefers choice over performance pressure. It does not fit someone looking for a workout, a
            competition form, or a medical treatment, and the next section says why.
          </p>
        </div>
      </section>

      {/* ── THE TEN MODULES ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The course</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 16 }}>Ten modules, one sequence.</h2>
          <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: 15, lineHeight: 1.7, maxWidth: 560, marginBottom: 48 }}>
            One module a week, each running about an hour live. Every session pairs demonstration with a component
            drill, a full guided practice, and a seated or reduced-range adaptation lab, so the version you actually
            need gets practiced, not just described.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {MODULES.map(m => (
              <div key={m.n} style={{ border: '1px solid rgba(216,171,105,0.18)', borderRadius: 8, padding: '24px 24px 28px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <p style={{ color: 'rgba(216,171,105,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 10 }}>MODULE {m.n}</p>
                <h3 style={{ color: '#D8AB69', fontSize: 17, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{m.title}</h3>
                <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 13, lineHeight: 1.7 }}>{m.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOU LEAVE WITH ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>You leave with</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            A sequence you can actually run again on your own.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'A complete, memorable eight-movement sequence, in the version that fits your body.',
              'Setup, breathing, transition, and correction cues for every movement.',
              'A seated and lower-intensity path built into each module, not offered as an afterthought.',
              'A workbook and a short micropractice menu you can run on a busy day.',
              'The ability to name which of the five evidence lanes any claim about the practice belongs to.',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#D8AB69', fontSize: 13, marginTop: 3 }}>◈</span>
                <p style={{ color: 'rgba(15,27,31,0.8)', fontSize: 15, lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS NOT ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '72px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Said plainly</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 300, marginBottom: 24, lineHeight: 1.25 }}>
            This is educational movement instruction.
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Golden Eight teaches movement, breath, and evidence literacy. It is not medical care, not
            psychotherapy, not rehabilitation, and not a promise to treat, prevent, or cure any disease. Work
            inside a comfortable range at every session. For symptoms, an injury, or a condition-specific question,
            get care from someone qualified to answer it first.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 16, lineHeight: 1.8 }}>
            Traditional Chinese medicine associations appear throughout the course as a traditional framework, the
            way the tradition itself holds them. They are not presented as anatomy, and the course does not
            translate them into a biomedical mechanism they were never built to name.
          </p>
        </div>
      </section>

      {/* ── THE COHORT ───────────────────────────────────────────────────── */}
      <section id="the-cohort" style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Cohort 1</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            The week of November 12, 2026.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ten Saturday mornings</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                One live session a week, roughly an hour, Saturdays at 7:00am Central.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>A seated or standing base</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                Every module teaches both paths in the same session. Choose your base at the start of each class,
                and change it mid-session if your body asks for something different that day.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>A practice plan you set</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                Module 10 closes the course with a plan sized to your actual week: a two-minute micropractice, a
                one-movement focus, a half-set, or the complete sequence. You choose the frequency and the stop
                rule.
              </p>
            </div>
          </div>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
            $249 covers the whole course: ten live sessions, the workbook, the practice videos, and the completion
            certificate. 8 to 10 seats. First cohort.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 13, lineHeight: 1.7 }}>
            Enrollment and billing route through Rooted Reclaimers LLC.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '72px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Questions</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 300, marginBottom: 32, lineHeight: 1.25 }}>
            Before you enroll.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { q: 'Do I need experience?', a: 'No. The course begins with stance, breath, pacing, and adaptation. Module 1 assumes nothing.' },
              { q: 'Do I need to stand?', a: 'No. Every movement includes a seated version built into the same module. Where the seated version changes something real, the module names the change instead of hiding it.' },
              { q: 'Is this a medical program?', a: 'No. The course discusses research carefully, but it does not diagnose or treat anything.' },
              { q: 'How much room do I need?', a: 'Enough space to extend both arms without hitting furniture, and a stable chair nearby.' },
            ].map(item => (
              <div key={item.q}>
                <p style={{ color: '#D8AB69', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{item.q}</p>
                <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FIT QUESTION + ENROLL ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '88px 24px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>One recommendation, one question</p>
          <p style={{ color: '#F5F0E8', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 300, lineHeight: 1.55, marginBottom: 24 }}>
            If you want a calm, structured practice you will actually return to, and not a workout or a cure,
            ten weeks with Stephen Thompson builds it.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
            Is this the practice you want to build?
          </p>
          <EnrollButton />
          <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 13, lineHeight: 1.7, marginTop: 28 }}>
            Questions first? Email{' '}
            <a href="mailto:docthompsondacmdc@gmail.com" style={{ color: 'rgba(216,171,105,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.3)' }}>
              docthompsondacmdc@gmail.com
            </a>{' '}
            and ask anything before you commit a seat.
          </p>
        </div>
      </section>
    </>
  )
}
