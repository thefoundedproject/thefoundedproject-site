'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Scroll Reveal ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `all 0.8s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// ─── Quiz ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  { q: 'When you think about where you are right now, what feels most true?', options: [
    { label: 'I\'m building, but without a blueprint.', value: 'a' },
    { label: 'I survived something. Now I need structure.', value: 'b' },
    { label: 'I have the vision. I\'m missing the infrastructure.', value: 'c' },
    { label: 'I feel like I\'m performing competence I don\'t fully feel.', value: 'd' },
  ]},
  { q: 'When a major decision arrives, what happens?', options: [
    { label: 'I move fast. Urgency is my default.', value: 'a' },
    { label: 'I freeze. The weight of it is heavy.', value: 'b' },
    { label: 'I consult people, but I\'m not always sure they\'re the right ones.', value: 'c' },
    { label: 'I make it alone and carry the outcome alone.', value: 'd' },
  ]},
  { q: 'What do you most need right now?', options: [
    { label: 'Daily structure for what matters most.', value: 'a' },
    { label: 'Language for what I\'m already experiencing.', value: 'b' },
    { label: 'A board who will tell me the truth.', value: 'c' },
    { label: 'Protection for what I\'ve built.', value: 'd' },
  ]},
]
const PROFILES = {
  a: { title: 'The Builder Without a Blueprint', desc: 'You have drive and instinct. You\'ve been building your life from scratch every day. We can give you the structure to do it on purpose.', cta: 'The Founded App starts where you are.', href: 'https://thefounded.app' },
  b: { title: 'The Reclaimer', desc: 'You survived something hard. Your survival built your intelligence. Now you need a structure that respects what your body already knows.', cta: 'Start with Journey from the Edge.', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
  c: { title: 'The Visionary Missing Infrastructure', desc: 'You can see exactly where you\'re going. You\'re missing the scaffolding to get there. We can build that with you.', cta: 'The Founded App gives your vision the structure it needs.', href: 'https://thefounded.app' },
  d: { title: 'The Competent Carrier', desc: 'You\'re excellent and exhausted from performing it. We won\'t ask you to perform here. We\'ll ask what you actually need and build the structure around your answer.', cta: 'Begin with the framework.', href: 'https://thefounded.app' },
}

function QuizFunnel() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const q = QUIZ[step - 1]

  const handleNext = () => {
    if (!selected) return
    const newA = [...answers, { q: q.q, a: q.options.find(o => o.value === selected).label }]
    setAnswers(newA)
    setSelected(null)
    if (step < QUIZ.length) { setStep(step + 1) }
    else {
      const freq = {}
      newA.forEach(a => { const v = QUIZ.find(x => x.q === a.q)?.options.find(o => o.label === a.a)?.value; if (v) freq[v] = (freq[v] || 0) + 1 })
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'a'
      setProfile(PROFILES[top])
      setStep(4)
    }
  }
  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await fetch('/api/quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, answers, profile }) }) } catch {}
    setLoading(false)
    setStep(5)
  }

  if (step === 0) return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Find Your Entry Point</p>
      <h3 style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Three questions. One honest look.</h3>
      <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 14, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 28px' }}>No optimization tips. Just a clearer picture of where you actually are.</p>
      <button onClick={() => setStep(1)} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '14px 40px', borderRadius: 6, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>Begin</button>
    </div>
  )
  if (step >= 1 && step <= QUIZ.length) return (
    <div>
      <div style={{ display: 'flex', gap: 5, marginBottom: 32 }}>
        {QUIZ.map((_, i) => <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, backgroundColor: i < step ? '#D8AB69' : 'rgba(216,171,105,0.2)' }} />)}
      </div>
      <h3 style={{ color: '#F5F0E8', fontSize: 19, fontWeight: 300, lineHeight: 1.45, marginBottom: 24 }}>{q.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {q.options.map(opt => (
          <button key={opt.value} onClick={() => setSelected(opt.value)} style={{ textAlign: 'left', padding: '14px 18px', borderRadius: 7, fontSize: 14, lineHeight: 1.5, cursor: 'pointer', transition: 'all 0.15s', backgroundColor: selected === opt.value ? '#D8AB69' : 'rgba(255,255,255,0.06)', color: selected === opt.value ? '#0F1B1F' : '#F5F0E8', border: `1.5px solid ${selected === opt.value ? '#D8AB69' : 'rgba(216,171,105,0.15)'}`, fontWeight: selected === opt.value ? 600 : 400 }}>{opt.label}</button>
        ))}
      </div>
      <button onClick={handleNext} disabled={!selected} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 14, border: 'none', cursor: selected ? 'pointer' : 'default', opacity: selected ? 1 : 0.4 }}>
        {step === QUIZ.length ? 'See my profile' : 'Continue'}
      </button>
    </div>
  )
  if (step === 4) return (
    <div>
      <h3 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 300, marginBottom: 8 }}>Where do we send this?</h3>
      <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 14, marginBottom: 24 }}>Your profile and the right next step for your specific situation.</p>
      <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ padding: '14px 16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(216,171,105,0.3)', borderRadius: 6, fontSize: 15, color: 'white', outline: 'none' }} />
        <button type="submit" disabled={loading} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '14px', borderRadius: 6, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>{loading ? 'Sending...' : 'Get my results'}</button>
      </form>
    </div>
  )
  if (step === 5 && profile) return (
    <div>
      <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Your Profile</p>
      <h3 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{profile.title}</h3>
      <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{profile.desc}</p>
      <p style={{ color: '#D8AB69', fontSize: 14, fontStyle: 'italic', marginBottom: 24 }}>{profile.cta}</p>
      <a href={profile.href} style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Go there now →</a>
    </div>
  )
  return null
}


// ─── APP MOCKUP ────────────────────────────────────────────────────────────────
function AppMockup() {
  const screens = [
    { label: 'Dashboard', icon: '◉', active: true },
    { label: 'Mission', icon: '▣', active: false },
    { label: 'Board', icon: '◎', active: false },
    { label: 'Decide', icon: '◈', active: false },
  ]
  const items = [
    { title: 'Morning Ritual', sub: 'Complete · 4 steps done', status: '#3D8B5E' },
    { title: 'Board Meeting', sub: 'Advisor response waiting', status: '#C88A00' },
    { title: 'Capital Review', sub: 'Social capital: 3 open loops', status: '#C88A00' },
    { title: 'Decision Queue', sub: '2 decisions pending', status: '#C88A00' },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap', padding: '20px 0' }}>
      {/* Phone mockup */}
      <div style={{
        width: 260,
        backgroundColor: '#0A1519',
        borderRadius: 40,
        padding: 14,
        boxShadow: '0 60px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(216,171,105,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{ width: 60, height: 6, backgroundColor: '#0A1519', borderRadius: 3, border: '1px solid rgba(216,171,105,0.1)' }} />
        </div>
        {/* Screen */}
        <div style={{ backgroundColor: '#0F1B1F', borderRadius: 28, overflow: 'hidden', minHeight: 520 }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px 0', marginBottom: 4 }}>
            <span style={{ color: 'rgba(216,171,105,0.4)', fontSize: 9, fontWeight: 600 }}>9:41</span>
            <span style={{ color: 'rgba(216,171,105,0.4)', fontSize: 9 }}>● ●●</span>
          </div>
          {/* Header */}
          <div style={{ padding: '12px 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ color: 'rgba(216,171,105,0.5)', fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>The Founded</p>
                <p style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 600 }}>Good morning.</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(216,171,105,0.15)', border: '1px solid rgba(216,171,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#D8AB69', fontSize: 14 }}>◎</span>
              </div>
            </div>
            {/* Mission pill */}
            <div style={{ backgroundColor: 'rgba(216,171,105,0.1)', border: '1px solid rgba(216,171,105,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Mission</p>
              <p style={{ color: '#F5F0E8', fontSize: 11, lineHeight: 1.4 }}>Get humans organized and reinforced.</p>
            </div>
            {/* Items */}
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.status, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#F5F0E8', fontSize: 10, fontWeight: 600, marginBottom: 1 }}>{item.title}</p>
                  <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 9 }}>{item.sub}</p>
                </div>
                <span style={{ color: 'rgba(216,171,105,0.3)', fontSize: 10 }}>›</span>
              </div>
            ))}
          </div>
          {/* Bottom nav */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 8px', borderTop: '1px solid rgba(216,171,105,0.08)', marginTop: 8 }}>
            {screens.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: s.active ? 1 : 0.35 }}>
                <span style={{ color: s.active ? '#D8AB69' : 'rgba(245,240,232,0.5)', fontSize: 14 }}>{s.icon}</span>
                <span style={{ color: s.active ? '#D8AB69' : 'rgba(245,240,232,0.5)', fontSize: 7, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Home indicator */}
        <div style={{ width: 70, height: 4, backgroundColor: 'rgba(216,171,105,0.25)', borderRadius: 2, margin: '10px auto 4px' }} />
      </div>

      {/* Feature callouts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 220 }}>
        {[
          { icon: '◉', label: 'Personal Governance', sub: 'Mission, board, six capitals' },
          { icon: '◎', label: 'Advisory Board', sub: 'Real advisors. Real counsel.' },
          { icon: '◈', label: 'Decision Framework', sub: 'Structure for hard choices' },
          { icon: '▣', label: 'Evening Ritual', sub: 'Close the day with intention' },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ color: '#D8AB69', fontSize: 18, marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ color: '#F5F0E8', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{f.label}</p>
              <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 11, lineHeight: 1.4 }}>{f.sub}</p>
            </div>
          </div>
        ))}
        <a href="https://thefounded.app" target="_blank" rel="noopener noreferrer"
          style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '10px 20px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginTop: 8, display: 'block' }}>
          Get The Founded App →
        </a>
      </div>
    </div>
  )
}

// ─── NODE CARD ─────────────────────────────────────────────────────────────────
function NodeCard({ tag, name, desc, href, nextLabel, nextHref, status, dark = false }) {
  const bg = dark ? '#0F1B1F' : '#F5F0E8'
  const text = dark ? '#F5F0E8' : '#0F1B1F'
  const sub = dark ? 'rgba(245,240,232,0.55)' : 'rgba(15,27,31,0.6)'
  const border = dark ? 'rgba(216,171,105,0.15)' : 'rgba(15,27,31,0.1)'

  return (
    <div style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '28px', display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{tag}</p>
        {status && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 3, backgroundColor: status === 'Live' ? 'rgba(109,139,95,0.2)' : status === 'In Progress' ? 'rgba(217,164,65,0.2)' : 'rgba(216,171,105,0.1)', color: status === 'Live' ? '#6D8B5F' : status === 'In Progress' ? '#D9A441' : 'rgba(216,171,105,0.6)', whiteSpace: 'nowrap' }}>{status}</span>}
      </div>
      <div>
        <p style={{ color: text, fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{name}</p>
        <p style={{ color: sub, fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {href && (
          <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ color: '#D8AB69', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
            Visit site →
          </a>
        )}
        {nextLabel && nextHref && (
          <a href={nextHref} target={nextHref.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ color: sub, fontSize: 11, textDecoration: 'none', letterSpacing: '0.05em' }}>
            Natural next: {nextLabel} →
          </a>
        )}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 60%, rgba(216,171,105,0.05) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(216,171,105,0.03) 0%, transparent 45%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 80, opacity: heroVisible ? 1 : 0, transition: 'opacity 0.8s 200ms' }}>The Founded Project</p>

          <div style={{ maxWidth: 900 }}>
            {[
              'Get humans',
              <span key="2"><span style={{ color: '#D8AB69' }}>organized</span> and</span>,
              'reinforced.',
            ].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 'clamp(50px, 9vw, 108px)', fontWeight: 300, color: '#F5F0E8', lineHeight: 1.05, letterSpacing: '-0.025em', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(100%)', transition: `all 0.9s ease ${350 + i * 140}ms` }}>{line}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 560, marginTop: 48, opacity: heroVisible ? 1 : 0, transition: 'opacity 1.2s ease 1.1s' }}>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 18, lineHeight: 1.75, marginBottom: 14 }}>
              This work came from survival. It grew into a system.
            </p>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 18, lineHeight: 1.75 }}>
              The destination is a life you govern on your own terms. Answering questions society has yet to ask.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, opacity: heroVisible ? 1 : 0, transition: 'opacity 1.5s 2s' }}>
          <span style={{ color: 'rgba(245,240,232,0.2)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Survivor · Scholar · Clinician · DC · DACM · BCTMB · FAIHM</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#ecosystem" style={{ color: 'rgba(216,171,105,0.6)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>See the work ↓</a>
            <a href="https://thefounded.app" style={{ color: '#D8AB69', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>The App →</a>
          </div>
        </div>
      </section>

      {/* ── ANCHOR STATEMENT ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#D8AB69', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <p style={{ color: '#0F1B1F', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 300, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              &ldquo;Survival is genius.<br />The goal is to give that genius somewhere to go.&rdquo;
            </p>
            <p style={{ color: 'rgba(15,27,31,0.55)', fontSize: 13, marginTop: 16, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dr. Stephen Thompson</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <a href="https://thefounded.app" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Go to The Founded App</a>
            <a href="#ecosystem" style={{ color: 'rgba(15,27,31,0.6)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Explore the full ecosystem ↓</a>
          </div>
        </div>
      </section>

      {/* ── APP MOCKUP ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '80px 24px', borderTop: '1px solid rgba(216,171,105,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>The Platform</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 300, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>Personal governance. In your pocket.</h2>
            <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px', textAlign: 'center' }}>
              The Founded App gives you the structure to govern your life intentionally. Mission, board, decisions, continuity.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <AppMockup />
          </Reveal>
        </div>
      </section>

      {/* ── AGENCY AT EVERY SCALE — workflow ──────────────────────────────── */}
      <section style={{ backgroundColor: '#1A3A42', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Workflow</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.025em', marginBottom: 16 }}>Agency at every scale.</h2>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 17, lineHeight: 1.7, maxWidth: 720, marginBottom: 56 }}>
              Civic agency doesn&apos;t start in the voting booth. It starts in your body and works outward from there: into your closest relationships, into the groups you build with, and into the public square. Each layer needs different tools. This ecosystem has tools for each one.
            </p>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid rgba(216,171,105,0.15)', borderRadius: 10, overflow: 'hidden' }}>
            {[
              {
                tier: '01 · Self',
                title: 'Trust in the body.',
                body: 'Your body has been through a lifetime of struggles, stressors, big and little T traumas, many of which have not been dealt with. You may have noticed your body responding to environments before your brain has the opportunity to catch up. Like when you get a headache every Sunday night before the work week begins, or when your stomach turns when you get a certain email or notification. Our goal is to call out those adaptations, establish boundaries, and build some structure to better navigate your life.',
                tools: [
                  { name: 'Journey from the Edge', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
                  { name: 'The Founded App', href: 'https://thefounded.app' },
                  { name: 'P/AIRS Bodywork', href: null },
                ],
                delay: 0,
              },
              {
                tier: '02 · Family',
                title: 'Trust between people.',
                body: 'Your closest relationships have been through years of misunderstood signals, old hurts, and patterns you’ve been carrying since you were a kid. You may have noticed yourself shutting down before you can catch what set it off. Like when a comment shifts the whole evening, or when a text takes too long to come back and you’re already telling yourself a story about why. Our goal is to call out those patterns, find the people who actually show up for you, and build some structure for honest conversation.',
                tools: [
                  { name: 'Rooted Reclaimers', href: '/about#rooted' },
                  { name: 'P/AIRS Bodywork', href: null },
                  { name: 'Founded Emerging', href: 'https://thefoundedemerging.app' },
                ],
                delay: 80,
              },
              {
                tier: '03 · Community',
                title: 'Trust in your people.',
                body: 'Your groups and boards have been through years of side conversations, dominant voices, fake urgency, and decisions you ended up making alone anyway. You may have noticed yourself agreeing in the moment before you know whether you actually agreed. Like when a meeting ends and the real conversation happens in the parking lot, or when an advisor says yes when you needed the hard answer. Our goal is to call out those dynamics, find advisors who push back when it matters, and build governance that protects the people in it.',
                tools: [
                  { name: 'The Founded App', href: 'https://thefounded.app' },
                  { name: 'Founded Emerging', href: 'https://thefoundedemerging.app' },
                  { name: 'GreyDoc Consulting', href: 'https://greydoc.com' },
                ],
                delay: 160,
              },
              {
                tier: '04 · Society',
                title: 'Trust in the signal.',
                body: 'The public square has been through decades of manufactured outrage, ads that look like news, debates that keep you watching, and candidates who tested every word with a focus group. You may have noticed yourself getting angry online without knowing why, or believing a story before checking who paid for it. Like when an algorithm shows you the worst version of the politicians you already distrust, or when a candidate says something and you can’t tell if it’s true. Our goal is to call out the noise, get clear on what you actually believe, and build the tools to help you vote your values.',
                tools: [
                  { name: 'RhetoricalPoints', href: 'https://rhetoricalpoints.com' },
                  { name: 'GroundedVote', href: 'https://groundedvote.com' },
                  { name: 'The South Never Lost', href: null },
                ],
                delay: 240,
              },
            ].map((tier, idx, arr) => (
              <Reveal key={tier.tier} delay={tier.delay}>
                <div style={{ backgroundColor: 'rgba(15,27,31,0.5)', padding: '40px 36px', borderBottom: idx < arr.length - 1 ? '1px solid rgba(216,171,105,0.12)' : 'none', display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: 40, alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#D8AB69', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>{tier.tier}</p>
                    <h3 style={{ color: '#F5F0E8', fontSize: 26, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.015em', marginBottom: 18 }}>{tier.title}</h3>
                    <p style={{ color: 'rgba(216,171,105,0.55)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Tools at this layer</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {tier.tools.map((tool) => (
                        <li key={tool.name}>
                          {tool.href ? (
                            <a href={tool.href} target={tool.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: '#D8AB69', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>◈ {tool.name}</a>
                          ) : (
                            <span style={{ color: 'rgba(245,240,232,0.35)', fontSize: 13, fontWeight: 600 }}>◈ {tool.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p style={{ color: 'rgba(245,240,232,0.62)', fontSize: 15.5, lineHeight: 1.75, margin: 0 }}>{tier.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 16, lineHeight: 1.75, maxWidth: 720, marginTop: 56 }}>
              Every layer feeds the others. None of it works in isolation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FULL ECOSYSTEM MAP ───────────────────────────────────────────── */}
      <section id="ecosystem" style={{ backgroundColor: '#F5F0E8', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Full Ecosystem</p>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.025em', marginBottom: 8 }}>Every node.</h2>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.025em', marginBottom: 60 }}>One architecture.</h2>
          </Reveal>

          {/* THE BOOKS */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Voice: Books & Manuscripts
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Memoir · Trauma · Reclamation', name: 'Journey from the Edge', desc: 'The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice. On Amazon now.', href: 'https://www.amazon.com/dp/B0GTXBZGJY', nextLabel: 'Rooted Reclaimers community', nextHref: '/about#rooted', status: 'Live', delay: 0 },
              { tag: 'Somatic · Clinical · Practitioner', name: 'P/AIRS Bodywork', desc: 'A practitioner manual for daily somatic work. Touch. Conversation. Nervous system practice you can pick up between clients.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Forthcoming', delay: 80 },
              { tag: 'Civic · History · Culture', name: 'The South Never Lost', desc: 'The algorithmic plantation, democratic integrity, and what the South has always known. An unfinished reckoning.', href: null, nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'In Progress', delay: 160 },
              { tag: 'Governance · Community · Agency', name: 'The Founded: A Human Enterprise Project', desc: 'Reclaimed agency deserves somewhere to live. Human Enterprise Theory is the structure. Built for survivors ready to protect what they built.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Forthcoming', delay: 240 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} />
              </Reveal>
            ))}
          </div>

          {/* THE PLATFORMS */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Tools: Platforms & Apps
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Governance · Daily Ritual · Decision', name: 'The Founded App', desc: 'You\'re already governing your life. This gives you the structure to do it intentionally. Mission. Board. Decisions. Continuity. Built around the life you\'re actually living. This is the destination.', href: 'https://thefounded.app', status: 'Live', delay: 0 },
              { tag: 'Civic Agency · Vote · Alignment', name: 'GroundedVote', desc: 'Your vote should reflect what you actually believe. Honest, bias-audited questions show you which candidates match your values.', href: 'https://groundedvote.com', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 80 },
              { tag: 'Civic Agency · Signal · Discourse', name: 'RhetoricalPoints', desc: 'Public discourse runs on disorientation. Four AI models score political speech in real time. Hear what people are actually saying. Signal restored.', href: 'https://rhetoricalpoints.com', nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'Live', delay: 160 },
              { tag: 'Education · Entertainment · AI', name: 'ChatWithMe Debates', desc: 'Watch two AIs argue. Notice who you believe. That is the lesson. That is the literacy.', href: null, nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'Live', delay: 240 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} dark />
              </Reveal>
            ))}
          </div>

          {/* COMMUNITY */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Community: Programs & Spaces
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Community · Healing · Reclamation', name: 'Rooted Reclaimers', desc: 'The community layer of the Thompson Ecosystem. Trauma-informed education, movement, breathwork, nutrition, and connection. Daily work, done together.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 0 },
              { tag: 'Youth · Governance · Leadership', name: 'Founded Emerging', desc: 'Human Enterprise Theory applied to high school and college students. Six modules teaching them the structural tools that school never gets to.', href: 'https://thefoundedemerging.app', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 80 },
              { tag: 'Youth · AI Literacy · Nonprofit', name: 'Youth AI Training', desc: 'AI literacy training for young people. They will live in a world tech founders, governments, and ad platforms are designing right now. They deserve the language to understand it and the skill to respond. Transitioning to nonprofit.', status: 'In Progress', nextLabel: 'Founded Emerging', nextHref: 'https://thefoundedemerging.app', delay: 160 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} />
              </Reveal>
            ))}
          </div>

          {/* SERVICES */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Practice: Services & Consulting
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            <Reveal delay={0}>
              <NodeCard
                tag="Corporate Wellness · AI Training"
                name="GreyDoc Consulting"
                desc="Corporate wellness, integrative health consulting, and AI training for organizations. Burnout avoidance, moral distress, professional sustainability, and responsible AI deployment."
                href="https://greydoc.com"
                nextLabel="The Founded App"
                nextHref="https://thefounded.app"
                status="Live"
              />
            </Reveal>
            <Reveal delay={80}>
              <NodeCard
                tag="Books · Coaching · Frameworks"
                name="Rooted Reset"
                desc="A 21-day structured reset program. Daily worksheets, breathwork protocols, and community accountability. 21 days of rebuilding from the ground up."
                nextLabel="Rooted Reclaimers"
                nextHref="/about#rooted"
                status="Live"
              />
            </Reveal>
          </div>

          {/* MERCH */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Store: Branded Merchandise
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ backgroundColor: '#0F1B1F', borderRadius: 10, padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Founded Project Store</p>
                <h3 style={{ color: '#F5F0E8', fontSize: 24, fontWeight: 300, lineHeight: 1.3, marginBottom: 12 }}>Wear the work.<br />Carry the mission.</h3>
                <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 15, lineHeight: 1.65 }}>Branded apparel and goods from across the ecosystem. The Founded, GroundedVote, RhetoricalPoints, Journey from the Edge, and Rooted Reclaimers.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['The Founded: Governance apparel', 'GroundedVote: Civic tools merch', 'Journey from the Edge: Reclamation gear', 'Rooted Reclaimers: Community wear'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(245,240,232,0.6)', fontSize: 14 }}>
                    <span style={{ color: '#D8AB69' }}>◈</span>{item}
                  </div>
                ))}
                <a href="/store" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '12px 24px', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block', marginTop: 12, width: 'fit-content' }}>Shop the store →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE ARC — guided tour ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Arc</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.025em', marginBottom: 12 }}>Every road leads here.</h2>
            <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 17, lineHeight: 1.7, maxWidth: 560, marginBottom: 60 }}>
              Whether you enter through a book, a civic tool, a debate, or a consulting engagement, the arc is the same. Name the survival. Reclaim the agency. Build the governance. The Founded App is where the governance lives.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, backgroundColor: 'rgba(216,171,105,0.1)' }}>
            {[
              { from: 'Journey from the Edge', to: 'Rooted Reclaimers', arrow: 'Name it. Find your people.', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
              { from: 'Rooted Reclaimers', to: 'The Founded App', arrow: 'Find your people. Build your governance.', href: 'https://thefounded.app' },
              { from: 'RhetoricalPoints', to: 'GroundedVote', arrow: 'Detect the noise. Find your alignment.', href: 'https://groundedvote.com' },
              { from: 'GroundedVote', to: 'The Founded App', arrow: 'Know where you stand. Build from there.', href: 'https://thefounded.app' },
              { from: 'Founded Emerging', to: 'The Founded App', arrow: 'Youth governance. Adult governance.', href: 'https://thefounded.app' },
              { from: 'GreyDoc Consulting', to: 'The Founded App', arrow: 'Organizational wellness. Personal governance.', href: 'https://thefounded.app' },
            ].map((arc, i) => (
              <Reveal key={arc.from} delay={i * 60}>
                <a href={arc.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', backgroundColor: '#0F1B1F', padding: '28px 24px', textDecoration: 'none', transition: 'background 0.2s' }}>
                  <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 12, marginBottom: 8 }}>{arc.from}</p>
                  <p style={{ color: 'rgba(216,171,105,0.5)', fontSize: 11, marginBottom: 6 }}>→</p>
                  <p style={{ color: '#F5F0E8', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{arc.to}</p>
                  <p style={{ color: 'rgba(216,171,105,0.5)', fontSize: 11, lineHeight: 1.5 }}>{arc.arrow}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div style={{ marginTop: 60, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="https://thefounded.app" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '18px 48px', borderRadius: 6, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Go to The Founded App</a>
              <a href="/about" style={{ backgroundColor: 'transparent', color: 'rgba(245,240,232,0.6)', padding: '18px 48px', borderRadius: 6, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)' }}>Meet Dr. Thompson</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONVICTION / HOPE MARKER ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#D8AB69', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#0F1B1F', fontSize: 'clamp(24px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.4, letterSpacing: '-0.02em' }}>
            The most vulnerable people deserve<br />the most sophisticated tools.
          </p>
          <div style={{ width: 40, height: 2, backgroundColor: '#0F1B1F', margin: '32px auto', opacity: 0.3 }} />
          <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            That is the founding conviction. That conviction shapes everything we build here.
          </p>
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A3A42', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 64, alignItems: 'start' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Find Your Entry Point</p>
            <h2 style={{ color: '#F5F0E8', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 24 }}>
              Where in this work<br />do you belong right now?
            </h2>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>This ecosystem has many doors. Three honest questions will point you toward the right one.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              {[
                { label: 'Start with the books →', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
                { label: 'Check your civic alignment →', href: 'https://groundedvote.com' },
                { label: 'Go straight to the app →', href: 'https://thefounded.app' },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(216,171,105,0.6)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>{l.label}</a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ backgroundColor: 'rgba(15,27,31,0.6)', border: '1px solid rgba(216,171,105,0.15)', borderRadius: 12, padding: '40px' }}>
              <QuizFunnel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BOOKS (corrected) ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Books</p>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.025em', marginBottom: 64 }}>The voice of the work.</h2>
          </Reveal>

          {[
            { title: 'Journey from the Edge', status: 'Available on Amazon', statusColor: '#6D8B5F', desc: 'The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice. The first volume in the Thompson Ecosystem.', link: { label: 'Buy on Amazon →', href: 'https://www.amazon.com/dp/B0GTXBZGJY' }, next: { label: 'Rooted Reclaimers', href: '/about#rooted' } },
            { title: 'P/AIRS Bodywork', status: 'Forthcoming 2026', statusColor: '#D9A441', desc: 'A practitioner manual for daily somatic work. Touch. Conversation. Nervous system practice you can pick up between clients.', next: { label: 'The Founded App', href: 'https://thefounded.app' } },
            { title: 'The South Never Lost', status: 'In Progress', statusColor: '#D9A441', desc: 'The algorithmic plantation, democratic integrity, and what the South has always known and protected. An unfinished reckoning in progress.', next: { label: 'GroundedVote', href: 'https://groundedvote.com' } },
            { title: 'The Founded: A Human Enterprise Project', status: 'Forthcoming', statusColor: 'rgba(15,27,31,0.35)', desc: 'The governance framework. Structure for survivors ready to protect what they built.', next: { label: 'The Founded App', href: 'https://thefounded.app' } },
          ].map((book, i) => (
            <Reveal key={book.title} delay={i * 80}>
              <div style={{ borderTop: '1px solid rgba(15,27,31,0.1)', padding: '32px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, alignItems: 'start' }}>
                <div>
                  <p style={{ color: book.statusColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{book.status}</p>
                  <p style={{ color: '#0F1B1F', fontSize: 18, fontWeight: 700 }}>{book.title}</p>
                </div>
                <p style={{ color: 'rgba(15,27,31,0.6)', fontSize: 14, lineHeight: 1.7 }}>{book.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {book.link && <a href={book.link.href} target="_blank" rel="noopener noreferrer" style={{ color: '#0F1B1F', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #D8AB69', paddingBottom: 1, width: 'fit-content' }}>{book.link.label}</a>}
                  {book.next && <a href={book.next.href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(15,27,31,0.45)', fontSize: 12, textDecoration: 'none' }}>Natural next: {book.next.label} →</a>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DR. THOMPSON + CREDENTIALS ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center', borderBottom: '1px solid rgba(216,171,105,0.15)', paddingBottom: 48, marginBottom: 48 }}>
          <Reveal>
            <div>
              <p style={{ color: '#F5F0E8', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Dr. Stephen Thompson</p>
              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 13, marginBottom: 16 }}>DC · DACM · FAIHM · Northwestern Health Sciences · AIHM Fellow</p>
              <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 14, lineHeight: 1.65, maxWidth: 420 }}>
                Clinician, author, and builder of systems for human reclamation. Three generations of doctors. Two decades of practice. One mission: get humans organized and reinforced.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Meet Dr. Thompson', href: '/about' },
                { label: 'Invite to speak', href: '/speaking' },
                { label: 'GreyDoc Consulting', href: 'https://greydoc.com' },
                { label: 'Publisher / media inquiries', href: '/contact' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ color: 'rgba(216,171,105,0.7)', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.2)', paddingBottom: 10 }}>{l.label} →</a>
              ))}
            </div>
          </Reveal>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <p style={{ color: 'rgba(245,240,232,0.3)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>The destination for every node in this ecosystem</p>
            <a href="https://thefounded.app" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '18px 56px', borderRadius: 6, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              The Founded App
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
