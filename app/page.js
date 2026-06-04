'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ─── Quiz Funnel ──────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: 'When you think about the current state of your life, what feels most true?',
    options: [
      { label: 'I am building, but without a blueprint.', value: 'a' },
      { label: 'I survived something. Now I need structure.', value: 'b' },
      { label: 'I have the vision. I am missing the infrastructure.', value: 'c' },
      { label: 'I feel like I am performing competence I do not fully feel.', value: 'd' },
    ],
  },
  {
    q: 'When a major decision arrives, what happens inside you?',
    options: [
      { label: 'I move fast. Urgency is my default.', value: 'a' },
      { label: 'I freeze. The weight of it is heavy.', value: 'b' },
      { label: 'I consult people. But I am not always sure they are the right people.', value: 'c' },
      { label: 'I make the decision alone and carry the outcome alone.', value: 'd' },
    ],
  },
  {
    q: 'What do you most need right now?',
    options: [
      { label: 'A system that holds what matters.', value: 'a' },
      { label: 'Language for what I am already experiencing.', value: 'b' },
      { label: 'A board of people who will tell me the truth.', value: 'c' },
      { label: 'Protection for what I have built.', value: 'd' },
    ],
  },
]

const PROFILES = {
  a: { title: 'The Builder Without a Blueprint', description: 'You are in motion. You have instinct, capacity, and drive. What is missing is structure — not because you are not capable of it, but because no one handed it to you. The Human Enterprise framework was built exactly for this moment.', next: 'The Founded App starts where you are. It builds the blueprint around the life you are already living.', cta: 'Start with The Founded App', href: 'https://thefounded.app' },
  b: { title: 'The Reclaimer', description: 'You survived something. That survival is not your weakness — it is the foundation of your intelligence. What you need now is a structure that honors what your nervous system learned and gives it somewhere to evolve.', next: 'The Human Enterprise framework was designed to meet people in reclamation, not just aspiration.', cta: 'Read the Framework', href: '/about' },
  c: { title: 'The Visionary Missing Infrastructure', description: 'You can see exactly where you are going. The challenge is the scaffolding between here and there. That is not a vision problem. That is a governance problem — and governance is solvable.', next: 'The Founded Project gives your vision the structure it needs to move from concept to protection.', cta: 'Explore the Ecosystem', href: '/projects' },
  d: { title: 'The Competent Carrier', description: 'You are excellent. You are also exhausted from performing that excellence in rooms that were not built for you. The framework does not ask you to perform. It asks what you actually need — and it builds around that.', next: 'You have already proven competence. Now protect it.', cta: 'Meet Dr. Thompson', href: '/about' },
}

function QuizFunnel() {
  const [step, setStep] = useState(0) // 0 = intro, 1-3 = questions, 4 = email, 5 = result
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const question = QUIZ[step - 1]

  const handleSelect = (val) => setSelected(val)

  const handleNext = () => {
    if (!selected) return
    const newAnswers = [...answers, { q: QUIZ[step - 1].q, a: QUIZ[step - 1].options.find(o => o.value === selected).label }]
    setAnswers(newAnswers)
    setSelected(null)
    if (step < QUIZ.length) {
      setStep(step + 1)
    } else {
      // Determine profile from majority answer
      const freq = {}
      newAnswers.forEach(a => {
        const val = QUIZ.find(q => q.q === a.q)?.options.find(o => o.label === a.a)?.value
        if (val) freq[val] = (freq[val] || 0) + 1
      })
      const topVal = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'a'
      setProfile(PROFILES[topVal])
      setStep(4)
    }
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers, profile }),
      })
    } catch {}
    setLoading(false)
    setStep(5)
  }

  if (step === 0) return (
    <div className="text-center">
      <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-4">Self-Assessment</p>
      <h3 className="text-white text-2xl font-light mb-4">Three questions.<br />One honest look.</h3>
      <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
        No optimization tips. No productivity hacks. Just a clearer picture of where you actually are.
      </p>
      <button onClick={() => setStep(1)} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="px-8 py-3 text-sm font-bold rounded hover:opacity-90 transition-opacity">
        Begin
      </button>
    </div>
  )

  if (step >= 1 && step <= QUIZ.length) return (
    <div>
      <div className="flex gap-1 mb-8">
        {QUIZ.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, backgroundColor: i < step ? '#D8AB69' : 'rgba(216,171,105,0.2)', borderRadius: 2 }} />
        ))}
      </div>
      <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-4">{step} of {QUIZ.length}</p>
      <h3 className="text-white text-xl font-light mb-8 leading-relaxed">{question.q}</h3>
      <div className="space-y-3 mb-8">
        {question.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="w-full text-left px-5 py-4 rounded text-sm transition-all"
            style={{
              backgroundColor: selected === opt.value ? '#D8AB69' : 'rgba(255,255,255,0.06)',
              color: selected === opt.value ? '#0F1B1F' : '#F5F0E8',
              border: `1px solid ${selected === opt.value ? '#D8AB69' : 'rgba(216,171,105,0.2)'}`,
              fontWeight: selected === opt.value ? 600 : 400,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={!selected} style={{ backgroundColor: selected ? '#D8AB69' : 'rgba(216,171,105,0.3)', color: '#0F1B1F', opacity: selected ? 1 : 0.5 }} className="px-8 py-3 text-sm font-bold rounded transition-all">
        {step === QUIZ.length ? 'See my profile' : 'Continue'}
      </button>
    </div>
  )

  if (step === 4) return (
    <div>
      <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-4">One more thing</p>
      <h3 className="text-white text-xl font-light mb-3">Where should we send your results?</h3>
      <p className="text-gray-400 text-sm mb-6">Your profile and the next step for your specific situation.</p>
      <form onSubmit={handleEmail} className="space-y-3">
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(216,171,105,0.3)', color: 'white' }} className="w-full px-4 py-3 text-sm rounded outline-none placeholder-gray-600" />
        <button type="submit" disabled={loading} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="w-full py-3 text-sm font-bold rounded hover:opacity-90 transition-opacity">
          {loading ? 'Sending...' : 'Get my results'}
        </button>
      </form>
      <p className="text-gray-600 text-xs mt-3 text-center">No spam. Unsubscribe anytime.</p>
    </div>
  )

  if (step === 5 && profile) return (
    <div>
      <p style={{ color: '#D8AB69' }} className="text-xs font-bold uppercase tracking-widest mb-3">Your Profile</p>
      <h3 className="text-white text-xl font-semibold mb-4">{profile.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{profile.description}</p>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">{profile.next}</p>
      <a href={profile.href} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="inline-block px-8 py-3 text-sm font-bold rounded hover:opacity-90 transition-opacity">
        {profile.cta} →
      </a>
    </div>
  )

  return null
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* ── HERO: Full screen dark, cinematic ───────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', minHeight: '100vh', position: 'relative', overflow: 'hidden' }} className="flex flex-col justify-between px-6 py-20">
        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(216,171,105,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(216,171,105,0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div className="max-w-6xl mx-auto w-full">
          {/* Eyebrow */}
          <div style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 1s ease 200ms' }}>
            <p style={{ color: '#D8AB69', letterSpacing: '0.2em' }} className="text-xs font-bold uppercase mb-16">The Founded Project</p>
          </div>

          {/* Main statement — staggered lines */}
          <div className="max-w-4xl">
            {['You already know', 'something', <span key="3" style={{ color: '#D8AB69' }}>isn&apos;t working.</span>].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <div style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(100%)',
                  transition: `opacity 0.9s ease ${400 + i * 150}ms, transform 0.9s ease ${400 + i * 150}ms`,
                  fontSize: 'clamp(52px, 9vw, 110px)',
                  fontWeight: 300,
                  color: '#F5F0E8',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                }}>
                  {line}
                </div>
              </div>
            ))}
          </div>

          {/* Sub-statement */}
          <div style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 1.2s ease 1200ms', maxWidth: 480, marginTop: 48 }}>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 18, lineHeight: 1.7 }}>
              The question is what to do about it.
            </p>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 18, lineHeight: 1.7, marginTop: 12 }}>
              Dr. Stephen Thompson built this work to answer that. Every platform, book, and tool here begins from the same place: the people most likely to be extracted from deserve the same structural intelligence that institutions use every day.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 1.5s ease 2s' }} className="max-w-6xl mx-auto w-full flex items-end justify-between">
          <div style={{ color: 'rgba(245,240,232,0.3)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Dr. Stephen Thompson · DC · DACM · FAIHM
          </div>
          <div style={{ color: 'rgba(216,171,105,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            Scroll
            <div style={{ width: 40, height: 1, backgroundColor: 'rgba(216,171,105,0.5)' }} />
          </div>
        </div>
      </section>

      {/* ── STATEMENT: The gap ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-0">
            <div className="md:col-span-2 md:pt-4">
              <Reveal>
                <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Work</p>
              </Reveal>
            </div>
            <div className="md:col-span-10">
              <Reveal delay={100}>
                <p style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.3, letterSpacing: '-0.02em', maxWidth: 760 }}>
                  Modern life is not randomly traumatizing.
                  <br />It is <em>organized</em> that way.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div style={{ width: 60, height: 2, backgroundColor: '#D8AB69', margin: '32px 0' }} />
              </Reveal>
              <Reveal delay={300}>
                <p style={{ color: '#0F1B1F', fontSize: 17, lineHeight: 1.85, maxWidth: 620, marginBottom: 20 }}>
                  Some people inherit governance structures before they know what governance is. Mentorship. Financial fluency. Institutional access. Protected space to fail. That inheritance is called privilege plasticity.
                </p>
              </Reveal>
              <Reveal delay={400}>
                <p style={{ color: '#0F1B1F', fontSize: 17, lineHeight: 1.85, maxWidth: 620, marginBottom: 20 }}>
                  Others develop survival plasticity. The body and mind adapt to endure what they cannot change. That adaptation is genius. The problem is when it becomes the only tool in the room.
                </p>
              </Reveal>
              <Reveal delay={500}>
                <p style={{ color: '#0F1B1F', fontSize: 17, lineHeight: 1.85, maxWidth: 620 }}>
                  The Founded Project is built for people who survived and are ready for something steadier. The work here gives that steadiness a structure.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ────────────────────────────────────────────────────── */}
      <Reveal>
        <section style={{ backgroundColor: '#D8AB69', padding: '80px 24px' }}>
          <div className="max-w-6xl mx-auto">
            <p style={{ color: '#0F1B1F', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.5, maxWidth: 700 }}>
              &ldquo;Survival is genius. The goal is to give that genius somewhere to go.&rdquo;
            </p>
            <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 20 }}>
              Dr. Stephen Thompson · Human Enterprise Theory
            </p>
          </div>
        </section>
      </Reveal>

      {/* ── THE THREE PLATFORMS ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Three Platforms</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 80 }}>
              Every tool built here<br />serves the same person.
            </h2>
          </Reveal>

          {[
            { num: '01', name: 'The Founded App', sub: 'Human Enterprise Theory, applied', url: 'https://thefounded.app', desc: 'A personal governance platform. You build your mission, your board, your six capitals, and your decision architecture. The same tools institutions use — applied to the life you are actually living.', tag: 'Gov­ernance · Decision-making · Daily ritual' },
            { num: '02', name: 'Founded Emerging', sub: 'For students building without a map', url: 'https://thefoundedemerging.app', desc: 'Human Enterprise Theory applied to high school and college students. Six modules that give young people the structural tools that institutions quietly teach to some and withhold from others.', tag: 'Youth · Leadership · Governance' },
            { num: '03', name: 'GroundedVote', sub: 'Civic alignment without the noise', url: 'https://groundedvote.com', desc: 'A nonpartisan civic tool that shows you which candidates match what you actually believe — not your party, not your fear. Built on a bias-audited AI pipeline. Built for people the information system has failed.', tag: 'Civic · Democracy · Alignment' },
          ].map((platform, i) => (
            <Reveal key={platform.num} delay={i * 120}>
              <a href={platform.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderTop: '1px solid rgba(216,171,105,0.2)', padding: '40px 0', textDecoration: 'none' }} className="group">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-1">
                    <span style={{ color: 'rgba(216,171,105,0.4)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>{platform.num}</span>
                  </div>
                  <div className="md:col-span-4">
                    <p style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 600, marginBottom: 4, transition: 'color 0.2s' }} className="group-hover:text-yellow-300">{platform.name}</p>
                    <p style={{ color: 'rgba(216,171,105,0.7)', fontSize: 13 }}>{platform.sub}</p>
                  </div>
                  <div className="md:col-span-5">
                    <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 15, lineHeight: 1.7 }}>{platform.desc}</p>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end">
                    <span style={{ color: '#D8AB69', fontSize: 22, transition: 'transform 0.2s' }} className="group-hover:translate-x-2">→</span>
                  </div>
                </div>
                <div className="md:ml-[calc(100%/12)]">
                  <p style={{ color: 'rgba(216,171,105,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>{platform.tag}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── QUIZ FUNNEL ────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A3A42', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Find Your Entry Point</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 24 }}>
              Where in this work<br />do you belong right now?
            </h2>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Three honest questions. One honest look at where you are. The answer points you toward the right place to begin.
            </p>
            <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: 13, lineHeight: 1.6 }}>
              There is no wrong answer here. This is motivational interviewing, not a personality quiz. What you say tells you something true about where you are, and what you might need next.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ backgroundColor: 'rgba(15,27,31,0.6)', borderRadius: 12, padding: '40px', border: '1px solid rgba(216,171,105,0.15)' }}>
              <QuizFunnel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BOOKS ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-0 mb-16">
            <div className="md:col-span-2">
              <Reveal><p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', paddingTop: 4 }}>The Books</p></Reveal>
            </div>
            <div className="md:col-span-10">
              <Reveal><h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em' }}>Published and forthcoming.</h2></Reveal>
            </div>
          </div>

          {[
            { title: 'The South Never Lost', status: 'Available', desc: 'The South was never defeated. This book names what it preserved, what it is still protecting, and what the algorithm is trying to extract.', year: '2026' },
            { title: 'Journey from the Edge', status: 'Forthcoming', desc: 'The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice.', year: '2026' },
            { title: 'P/AIRS Bodywork', status: 'Forthcoming', desc: 'A practitioner guide to the body as a site of healing. Touch, relationship, and the nervous system.', year: '2026' },
            { title: 'Human Enterprise Theory', status: 'Forthcoming', desc: 'The governance framework. Structure for people who reclaimed their lives and are ready to protect what they built.', year: '2026' },
          ].map((book, i) => (
            <Reveal key={book.title} delay={i * 80}>
              <div style={{ borderTop: '1px solid rgba(15,27,31,0.12)', padding: '32px 0', display: 'grid' }} className="grid md:grid-cols-12 gap-4 items-baseline">
                <div className="md:col-span-2">
                  <span style={{ color: 'rgba(15,27,31,0.3)', fontSize: 12 }}>{book.year}</span>
                </div>
                <div className="md:col-span-5">
                  <p style={{ color: '#0F1B1F', fontSize: 18, fontWeight: 600 }}>{book.title}</p>
                </div>
                <div className="md:col-span-4">
                  <p style={{ color: 'rgba(15,27,31,0.65)', fontSize: 14, lineHeight: 1.6 }}>{book.desc}</p>
                </div>
                <div className="md:col-span-1 text-right">
                  <span style={{ backgroundColor: book.status === 'Available' ? '#D8AB69' : 'transparent', color: book.status === 'Available' ? '#0F1B1F' : 'rgba(15,27,31,0.4)', border: book.status !== 'Available' ? '1px solid rgba(15,27,31,0.2)' : 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 3 }}>{book.status}</span>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={400}>
            <div style={{ marginTop: 48 }}>
              <a href="/books" style={{ color: '#0F1B1F', borderBottom: '1px solid #D8AB69', paddingBottom: 2, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>View all books →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CREDENTIALS BAR ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', borderTop: '1px solid rgba(216,171,105,0.2)', padding: '40px 24px' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p style={{ color: '#F5F0E8', fontWeight: 600, fontSize: 16 }}>Dr. Stephen Thompson</p>
            <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 13 }}>DC · DACM · FAIHM · Northwestern Health Sciences University · AIHM Fellow</p>
          </div>
          <a href="/speaking" style={{ backgroundColor: 'transparent', color: '#D8AB69', border: '1px solid rgba(216,171,105,0.4)', padding: '10px 24px', borderRadius: 4, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Invite to Speak
          </a>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#D8AB69', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Publishers.<br />Media.<br />Partners.<br />Readers.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ color: 'rgba(15,27,31,0.75)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
              The Founded Project is growing. If you are a publisher, journalist, institution, civic organization, or aligned individual, this is where to begin.
            </p>
            <a href="/contact" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', padding: '16px 40px', borderRadius: 4, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get in Touch
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
