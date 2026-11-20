// ─── ENROLLMENT SWITCH ────────────────────────────────────────────────────────
// One line controls the enrollment button. Stripe is live (Rooted Reclaimers LLC,
// public name The Founded Project LLC), but the next cohort has no dates and no
// payment link yet, so STRIPE_PAYMENT_LINK is empty and the button reads "Get
// notified", opening an email with the subject filled in. It does not hold a
// seat or collect payment. Once dates are set, create a one-time $249 price and
// payment link in Stripe, paste the link between the quotes below, and the
// button becomes Stripe checkout.
const STRIPE_PAYMENT_LINK = ''

const NOTIFY_MAILTO =
  'mailto:docthompsondacmdc@gmail.com?subject=' +
  encodeURIComponent('Golden Eight: notify me about the next cohort')

const ENROLL_HREF = STRIPE_PAYMENT_LINK || NOTIFY_MAILTO
const ENROLL_LABEL = STRIPE_PAYMENT_LINK ? 'Enroll · $249' : 'Get notified when enrollment opens'

export const metadata = {
  alternates: { canonical: '/golden-eight' },
  title: 'Golden Eight | The Founded Project',
  description:
    'Golden Eight, a ten-week live Baduanjin course taught by Stephen Thompson. Eight movements, standing or seated. Next cohort early 2027. 8 to 10 seats. $249.',
}

// Each module leads with the movement. `deeper` carries the traditional or
// evidence note for readers who open it; modules without one show none.
const MODULES = [
  { n: '01', title: 'Entering the Brocade', move: 'A standing or seated base and unforced breath. You learn to change or stop a movement without apology, before you learn the first one.', deeper: 'Introduces the five evidence lanes the course uses to sort every claim it makes.' },
  { n: '02', title: 'Hold Up Heaven (Two Hands)', move: 'An upward reach that lengthens the whole trunk.', deeper: 'Sanjiao named as a traditional whole-region framework, not a map onto Western anatomy.' },
  { n: '03', title: 'Draw the Bow (Left and Right)', move: 'A wide stance and an archer’s draw, worked on both sides.', deeper: 'Liver and Lung named as a traditional relationship, not an anatomical left-right claim.' },
  { n: '04', title: 'Raise One Hand / Separate Heaven and Earth', move: 'One hand rises while the other presses down, alternating sides without leaning.', deeper: 'Spleen ascent and Stomach descent, named as the traditional middle-region model they are.' },
  { n: '05', title: 'Look Back (Wise Owl Gazes Backward)', move: 'A gentle rotation led by the eyes, then the neck, then the upper trunk, with full return to center between sides. Eye-only movement is offered for anyone managing dizziness or neck concerns.' },
  { n: '06', title: 'Sway the Head and Swing the Tail', move: 'A side-to-side weight shift and trunk arc, in standing or seated form.', deeper: 'Heart and Kidney named as a traditional upper-lower model, not literal cardiac heat.' },
  { n: '07', title: 'Reach the Feet (Two Hands)', move: 'A supported hip hinge and a controlled return. Foot contact is optional; the fold and the return get the attention, not the reach.' },
  { n: '08', title: 'Fists and Fierce Eyes', move: 'Deliberate muscular effort, then a full release. “Angry eyes” means a focused gaze, not an emotional state.' },
  { n: '09', title: 'Seven Jolts', move: 'A slow heel raise and a quiet landing, up to seven rounds. Fewer rounds is the sounder choice when fatigue builds, not a failed attempt.' },
  { n: '10', title: 'Weaving the Eight', move: 'The full sequence, led twice: once for technique, once for continuity. You leave with a practice plan sized to your actual week.' },
]

const LANES = [
  { lane: 'History', line: 'What the texts document: where the movements came from and how their order changed over time.' },
  { lane: 'Traditional Chinese medicine', line: 'The framework the tradition attaches to each movement, taught as a framework.' },
  { lane: 'The Health Qigong standard', line: 'What the modern standardized sequence sets as technique. It’s the version the course teaches.' },
  { lane: 'Biomedical research', line: 'What studies of Baduanjin have actually measured, and nothing past it.' },
  { lane: 'Rooted Reclaimers', line: 'What the Rooted Reclaimers agency framework draws from the movement.' },
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
      {/* ── HERO: the movement first ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '96px 24px 72px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Golden Eight</p>
          <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, maxWidth: 720 }}>
            Eight movements. <span style={{ color: '#D8AB69' }}>A practice you actually keep.</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 17, lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            Golden Eight is a ten-week live course in Baduanjin, a sequence of eight slow movements with roots in
            Chinese practice going back centuries. Stephen Thompson teaches each one from the ground up, and every
            movement comes with a seated version, so the practice fits the body you bring to it on any given day.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 15, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>
            The next cohort starts in early 2027. 8 to 10 seats.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <EnrollButton />
            <a href="#the-cohort" style={{ border: '1px solid rgba(216,171,105,0.3)', color: 'rgba(216,171,105,0.8)', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              How the cohort runs ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <FactPill label="Next cohort" value="Early 2027" />
            <FactPill label="Seats" value="8 to 10" />
            <FactPill label="Price" value="$249" />
            <FactPill label="Format" value="Live, ten weeks" />
          </div>
        </div>
      </section>

      {/* ── WHAT THE PRACTICE IS FOR ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>What this trains</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Eight movements built for repetition, not for a stage.
          </h2>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Each movement is short enough to run on a busy morning and calm enough to run on a hard one. Once you
            know all eight, you can move through the whole sequence in one sitting before the day starts, and pick
            out a single movement on the days you have less.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            You set the range. Every module teaches a standing version and a seated or reduced-range version in
            the same session, and you can change or stop a movement at any point without apology. That choice is
            part of the practice. A sequence you adapt and keep running does more for you than a perfect one you
            drop in week three.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            The course fits a thoughtful beginner or a returning practitioner who wants a calm, structured practice
            and prefers choice over performance pressure. It does not fit someone looking for a workout, a
            competition form, or a medical treatment.
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
                <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 13, lineHeight: 1.7 }}>{m.move}</p>
                {m.deeper && (
                  <details style={{ marginTop: 14 }}>
                    <summary style={{ color: 'rgba(216,171,105,0.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Go deeper</summary>
                    <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 12.5, lineHeight: 1.7, paddingTop: 8 }}>{m.deeper}</p>
                  </details>
                )}
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
              'A way to tell what kind of claim you’re hearing about the practice, using the five evidence lanes set out further down.',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#D8AB69', fontSize: 13, marginTop: 3 }}>◈</span>
                <p style={{ color: 'rgba(15,27,31,0.8)', fontSize: 15, lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAID PLAINLY ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '72px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Said plainly</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 300, marginBottom: 24, lineHeight: 1.25 }}>
            This is educational movement instruction.
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 16, lineHeight: 1.8 }}>
            Golden Eight teaches movement, breath, and evidence literacy. It is not medical care, not
            psychotherapy, not rehabilitation, and not a promise to treat, prevent, or cure any disease. Work
            inside a comfortable range at every session. For symptoms, an injury, or a condition-specific question,
            get care from someone qualified to answer it first.
          </p>
        </div>
      </section>

      {/* ── THE COHORT ───────────────────────────────────────────────────── */}
      <section id="the-cohort" style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Next cohort</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Early 2027.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ten weekly sessions</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                One live session a week, roughly an hour. The day and time are set when enrollment opens.
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
            certificate. 8 to 10 seats.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.5)', fontSize: 13, lineHeight: 1.7 }}>
            Enrollment and billing route through Rooted Reclaimers LLC. Ask to be notified and you&#39;ll hear first
            when the dates are set.
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { q: 'When does the next cohort start?', a: 'Early 2027. The dates, day, and time are set when enrollment opens, and anyone who asked to be notified hears first.' },
              { q: 'Do I need experience?', a: 'No. The course begins with stance, breath, pacing, and adaptation. Module 1 assumes nothing.' },
              { q: 'Do I need to stand?', a: 'No. Every movement includes a seated version built into the same module. Where the seated version changes something real, the module names the change instead of hiding it.' },
              { q: 'Is this a medical program?', a: 'No. The course discusses research carefully, but it does not diagnose or treat anything.' },
              { q: 'How much room do I need?', a: 'Enough space to extend both arms without hitting furniture, and a stable chair nearby.' },
            ].map(item => (
              <details key={item.q} style={{ borderTop: '1px solid rgba(216,171,105,0.18)', padding: '18px 0' }}>
                <summary style={{ color: '#D8AB69', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{item.q}</summary>
                <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, lineHeight: 1.7, paddingTop: 10 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOING DEEPER: history and the five evidence lanes ────────────── */}
      <section id="going-deeper" style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Going deeper</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Five kinds of claim, kept apart.
          </h2>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            Baduanjin means Eight Pieces of Brocade. The name reaches back to Song-era literature, and the movements
            and their sequencing have changed across centuries of daoyin texts. A practice with that much history
            attracts claims of every kind, so the course sorts each one into the lane it came from. You leave able
            to tell the five apart on your own.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
            {LANES.map(l => (
              // Stacked on a phone, side by side from md up: a fixed label column
              // left the explanation two words wide at 375px.
              <div key={l.lane} className="grid md:grid-cols-4 gap-1 md:gap-4" style={{ borderTop: '1px solid rgba(15,27,31,0.1)', paddingTop: 16 }}>
                <p className="md:col-span-1" style={{ color: '#0F1B1F', fontSize: 15, fontWeight: 700 }}>{l.lane}</p>
                <p className="md:col-span-3" style={{ color: 'rgba(15,27,31,0.7)', fontSize: 15, lineHeight: 1.7 }}>{l.line}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            Traditional Chinese medicine associations appear throughout the course as a traditional framework, in
            the tradition&#39;s own terms. They aren&#39;t presented as anatomy, and the course doesn&#39;t translate them
            into biomedical mechanisms. The module cards above list those associations under Go deeper, for each
            movement that has one.
          </p>
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
