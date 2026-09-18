// ─── ENROLLMENT SWITCH ────────────────────────────────────────────────────────
// One line controls the enrollment button. Stripe is live (Rooted Reclaimers
// LLC, public name The Founded Project LLC), but no payment link exists yet
// for this specific course, so STRIPE_PAYMENT_LINK is empty and the button
// reads "Reserve a seat", opening an email to docthompsondacmdc@gmail.com with
// the subject filled in. Create a one-time $299 price + payment link in
// Stripe, paste the link between the quotes below, and the button becomes
// Stripe checkout. Nothing else on the page changes.
const STRIPE_PAYMENT_LINK = ''

const RESERVE_MAILTO =
  'mailto:docthompsondacmdc@gmail.com?subject=' +
  encodeURIComponent('Reserve a seat: Thompson Coaching Method Certification, Cohort 1')

const ENROLL_HREF = STRIPE_PAYMENT_LINK || RESERVE_MAILTO
const ENROLL_LABEL = STRIPE_PAYMENT_LINK ? 'Enroll · $299' : 'Reserve a seat'

export const metadata = {
  alternates: { canonical: '/certification' },
  title: 'Practitioner Certification | Thompson Coaching Method',
  description:
    'The Thompson Coaching Method Practitioner Certification. A coaching method for licensed clinicians, certified on recorded and documented work. Cohort 1 starts the week of October 12, 2026. Eight seats. $299.',
}

const MODULES = [
  { n: '01', title: 'What Coaching Is', line: 'The three lanes of coaching, treatment, and education, the six core principles, and the six lenses the whole method looks through.' },
  { n: '02', title: 'The Session', line: 'The nine-step session map, the four-element close, and the session note you complete within 24 hours.' },
  { n: '03', title: 'Core Skills Lab', line: 'Open questions, affirmations, reflections, summaries, and change talk, counted from your own recordings.' },
  { n: '04', title: 'Right-Sized Goals', line: 'Micro-commitments, floor goals, and the confidence check, with a redesign of any plan the client rates below seven.' },
  { n: '05', title: 'Retention, Setbacks, and Renewal', line: 'The checkpoints across an arc, the setback autopsy, and the honest conversation at the end of the work.' },
  { n: '06', title: 'Discovery, Intake, and Ethical Conversion', line: 'The discovery call as a fit judgment, with a close built on one recommendation and one question.' },
  { n: '07', title: 'Scope and Ethics', line: 'Finding lane drift in your own recordings, and the mark, route, and document procedure for the clinical moment.' },
  { n: '08', title: 'Practice Standards and Readiness', line: 'The weekly self-review cycle and the evidence file that carries your certification.' },
]

const BENCHMARKS = [
  'Reflections above questions at two to one, counted from assessed segments of your recordings.',
  'Coach talk time under 35 percent of each session.',
  'All four close elements present in every session: commitment, floor goal, confidence rating, barrier plan.',
  'Every session note complete within 24 hours, to standard.',
  'Zero unresolved scope violations across the whole arc: clinical questions marked, routed, and documented.',
  'A written self-review that matches an independent reviewer within tolerance.',
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

export default function Certification() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '96px 24px 72px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Thompson Coaching Method</p>
          <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, maxWidth: 720 }}>
            Practitioner <span style={{ color: '#D8AB69' }}>Certification</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 17, lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            A coaching method for licensed clinicians, built by Stephen Thompson and certified on evidence.
            You record your own sessions, measure your own speech against published benchmarks, and submit
            an evidence file an independent reviewer scores. The certificate states exactly what you demonstrated.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 15, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>
            Cohort 1 starts the week of October 12, 2026. Eight seats. First cohort.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <EnrollButton />
            <a href="#how-you-certify" style={{ border: '1px solid rgba(216,171,105,0.3)', color: 'rgba(216,171,105,0.8)', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              How you certify ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <FactPill label="Starts" value="Week of Oct 12, 2026" />
            <FactPill label="Seats" value="Eight" />
            <FactPill label="Price" value="$299" />
            <FactPill label="Format" value="Live cohort + recorded practice" />
          </div>
        </div>
      </section>

      {/* ── WHAT COACHING IS ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>What this trains</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Coaching is a structured conversation that moves a client from awareness to action.
          </h2>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Your clinical training built a reflex: a person presents a problem, you diagnose the pattern, and you
            deliver the answer. That reflex is exactly right in treatment, and it quietly ruins coaching, because
            a delivered answer belongs to the deliverer. The client walks out carrying your plan, and plans a person
            did not build are the plans that person abandons first.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            This method trains the third lane. Treatment runs on your clinical judgment. Education runs on your
            explanation. Coaching runs on the client&#39;s own commitment, and the discipline of the method is keeping
            that engine running instead of quietly replacing it with the first two. The shift asks you to spend what
            you know at the rate the client can convert it into behavior. Your depth stays. The overload goes.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            The certification fits licensed clinicians and health practitioners adding coaching to their working
            week: the practitioner whose patients understand their condition well and still leave each appointment
            with a week that produces nothing. The method gives that week a structure, and it gives you a way to
            prove, from recordings and notes, that you run the structure to standard.
          </p>
        </div>
      </section>

      {/* ── THE EIGHT MODULES ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The course</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 16 }}>Eight modules, one system.</h2>
          <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: 15, lineHeight: 1.7, maxWidth: 560, marginBottom: 48 }}>
            One module a week across the cohort. Each week pairs a live session with self-paced chapter work,
            a worksheet, and a module check. Every skill gets measured the same way you will measure it in
            practice: from a recording, against a stated standard.
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

      {/* ── HOW YOU CERTIFY ──────────────────────────────────────────────── */}
      <section id="how-you-certify" style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>How you certify</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            Documented performance, never time in a chair.
          </h2>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            The certification closes with a capstone: one complete mock coaching arc, recorded in five parts,
            from a discovery call through four full sessions and a renewal conversation. You run the arc with one
            practice partner, a colleague or willing volunteer who plays the client from a written brief. You code
            your own recordings, write an honest self-review, and submit the evidence file. An independent reviewer
            scores it asynchronously against a rubric you can read before you start. The method has no secret standards.
          </p>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            The capstone passes on six benchmark checks, and every one is binary:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {BENCHMARKS.map(b => (
              <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#D8AB69', fontSize: 13, marginTop: 3 }}>◈</span>
                <p style={{ color: 'rgba(15,27,31,0.8)', fontSize: 15, lineHeight: 1.7 }}>{b}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            A missed benchmark is a training signal with a route attached, never a verdict on you, and the $299
            includes every retake the standard requires. The pathway delays certification until the evidence meets
            the standard, and the calendar has never certified anyone in either direction.
          </p>
        </div>
      </section>

      {/* ── WHAT IT IS NOT ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '72px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Said plainly</p>
          <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 300, marginBottom: 24, lineHeight: 1.25 }}>
            This is a method credential.
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            It certifies that you demonstrated the Thompson Coaching Method at practitioner level, Stages 1 and 2
            of its training pathway, on recorded and documented work. It is not a license. It grants no board
            credential and no clinical authority, it is not a therapy training, and it grants no standing to train
            others in the method.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 16, lineHeight: 1.8 }}>
            Completing it also does not create NBHWC eligibility. For the learner who plans to pursue national
            board certification later through an NBHWC-approved program, a bonus appendix maps this course onto
            the board&#39;s competency territory and says honestly where your remaining study time belongs.
          </p>
        </div>
      </section>

      {/* ── THE COHORT ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Cohort 1</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, marginBottom: 28, lineHeight: 1.2 }}>
            The week of October 12, 2026.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Eight live weeks</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                One 90-minute live session a week, evenings, with the module&#39;s chapter, worksheet, and check
                completed at your own pace around your practice. The cohort takes Thanksgiving week off.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>A capstone window</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                After the eighth session you get an eight-week window to record the five-part capstone arc with
                your practice partner and submit the evidence file. The reviewer returns it within 14 days.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#0F1B1F', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>A practice partner</h3>
              <p style={{ color: 'rgba(15,27,31,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                You will need one person willing to play a mock client across the course and the capstone. The
                welcome email sets this expectation on day one, because the partner is real work and deserves
                honest notice.
              </p>
            </div>
          </div>
          <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.8 }}>
            $299 covers the whole certification: the eight modules, the live sessions, the written integration
            check, the capstone review, and any retakes. Eight seats. First cohort.
          </p>
        </div>
      </section>

      {/* ── THE FIT QUESTION + ENROLL ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '88px 24px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>One recommendation, one question</p>
          <p style={{ color: '#F5F0E8', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 300, lineHeight: 1.55, marginBottom: 24 }}>
            If you are a licensed clinician whose patients keep understanding more and changing less, this
            certification fits the problem you actually have.
          </p>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
            Is this the practice you want to run?
          </p>
          <EnrollButton />
          <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 13, lineHeight: 1.7, marginTop: 28 }}>
            Questions first? Email{' '}
            <a href="mailto:docthompsondacmdc@gmail.com" style={{ color: 'rgba(216,171,105,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.3)' }}>
              docthompsondacmdc@gmail.com
            </a>{' '}
            and ask anything. A no-pressure answer is part of the method.
          </p>
        </div>
      </section>
    </>
  )
}
