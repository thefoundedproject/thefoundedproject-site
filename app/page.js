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
    { label: 'I am building, but without a blueprint.', value: 'a' },
    { label: 'I survived something. Now I need structure.', value: 'b' },
    { label: 'I have the vision. I am missing the infrastructure.', value: 'c' },
    { label: 'I feel like I am performing competence I do not fully feel.', value: 'd' },
  ]},
  { q: 'When a major decision arrives, what happens?', options: [
    { label: 'I move fast. Urgency is my default.', value: 'a' },
    { label: 'I freeze. The weight of it is heavy.', value: 'b' },
    { label: 'I consult people — but I am not always sure they are the right ones.', value: 'c' },
    { label: 'I make it alone and carry the outcome alone.', value: 'd' },
  ]},
  { q: 'What do you most need right now?', options: [
    { label: 'A system that holds what matters.', value: 'a' },
    { label: 'Language for what I am already experiencing.', value: 'b' },
    { label: 'A board who will tell me the truth.', value: 'c' },
    { label: 'Protection for what I have built.', value: 'd' },
  ]},
]
const PROFILES = {
  a: { title: 'The Builder Without a Blueprint', desc: 'You have drive and instinct. What is missing is structure — not because you lack it, but because no one handed it to you.', cta: 'The Founded App starts where you are.', href: 'https://thefounded.app' },
  b: { title: 'The Reclaimer', desc: 'You survived something. That survival is the foundation of your intelligence. Now you need a structure that honors what your nervous system learned.', cta: 'Start with Journey from the Edge.', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
  c: { title: 'The Visionary Missing Infrastructure', desc: 'You can see exactly where you are going. The challenge is the scaffolding. That is a governance problem — and governance is solvable.', cta: 'The Founded App gives your vision the structure it needs.', href: 'https://thefounded.app' },
  d: { title: 'The Competent Carrier', desc: 'You are excellent and exhausted from performing it. The framework does not ask you to perform. It asks what you actually need — and builds around that.', cta: 'Begin with the framework.', href: 'https://thefounded.app' },
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
              Dr. Stephen Thompson built this work to answer questions society does not yet have language for.
            </p>
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 18, lineHeight: 1.75 }}>
              He is a clinician, a scholar, and a survivor. Everything here comes from the same place — and leads to the same destination.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, opacity: heroVisible ? 1 : 0, transition: 'opacity 1.5s 2s' }}>
          <span style={{ color: 'rgba(245,240,232,0.2)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>DC · DACM · FAIHM · Survivor · Scholar · Clinician</span>
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
            <a href="https://thefounded.app" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>The Founded App — the destination</a>
            <a href="#ecosystem" style={{ color: 'rgba(15,27,31,0.6)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Explore the full ecosystem ↓</a>
          </div>
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
              The Voice — Books & Manuscripts
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Memoir · Trauma · Reclamation', name: 'Journey from the Edge', desc: 'The body learns to survive. This book honors those adaptations, names the cost, and walks the road back to choice. On Amazon now.', href: 'https://www.amazon.com/dp/B0GTXBZGJY', nextLabel: 'Rooted Reclaimers community', nextHref: '/about#rooted', status: 'Live', delay: 0 },
              { tag: 'Somatic · Clinical · Practitioner', name: 'P/AIRS Bodywork', desc: 'A practitioner guide to the body as a site of healing. Touch, relationship, and the nervous system.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Forthcoming', delay: 80 },
              { tag: 'Civic · History · Culture', name: 'The South Never Lost', desc: 'The algorithmic plantation, democratic integrity, and what the South has always known. An unfinished reckoning.', href: null, nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'In Progress', delay: 160 },
              { tag: 'Governance · Community · Agency', name: 'The Founded: A Human Enterprise Project', desc: 'The governance framework that protects reclaimed agency through structure, counsel, and community coordination.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Forthcoming', delay: 240 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} />
              </Reveal>
            ))}
          </div>

          {/* THE PLATFORMS */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Tools — Platforms & Apps
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Governance · Daily Ritual · Decision', name: 'The Founded App', desc: 'The personal governance platform. Mission, board, six capitals, decisions, and continuity — built around the life you are actually living. This is the destination.', href: 'https://thefounded.app', status: 'Live', delay: 0 },
              { tag: 'Civic · Democracy · Alignment', name: 'GroundedVote', desc: 'A nonpartisan civic alignment engine. Bias-audited policy questions. Find out which candidates match what you actually believe — not your party, not your fear.', href: 'https://groundedvote.com', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 80 },
              { tag: 'Civic Accountability · Speech Analysis', name: 'RhetoricalPoints', desc: 'Live real-time fact-checking of political speech, debates, and broadcasts. Four AI models running in parallel to score integrity and flag violations.', href: 'https://rhetoricalpoints.com', nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'Live', delay: 160 },
              { tag: 'Education · Entertainment · AI', name: 'ChatWithMe Debates', desc: 'Bot vs. Bot structured debates on pressing topics. Each AI given distinct character traits and positions. Builds media literacy through engagement.', href: null, nextLabel: 'GroundedVote', nextHref: 'https://groundedvote.com', status: 'Live', delay: 240 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} dark />
              </Reveal>
            ))}
          </div>

          {/* COMMUNITY */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Community — Programs & Spaces
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 60 }}>
            {[
              { tag: 'Community · Healing · Reclamation', name: 'Rooted Reclaimers', desc: 'The community layer of the Thompson Ecosystem. Trauma-informed education, movement, breathwork, nutrition, and connection for people in reclamation.', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 0 },
              { tag: 'Youth · Governance · Leadership', name: 'Founded Emerging', desc: 'Human Enterprise Theory applied to high school and college students. Six modules that give young people the structural tools the institution quietly withholds from some.', href: 'https://thefoundedemerging.app', nextLabel: 'The Founded App', nextHref: 'https://thefounded.app', status: 'Live', delay: 80 },
              { tag: 'Youth · AI Literacy · Nonprofit', name: 'Youth AI Training', desc: 'AI literacy and responsible use training for young people. Curriculum for navigating a world being shaped by tools they were not invited to help design. Transitioning to nonprofit.', status: 'In Progress', nextLabel: 'Founded Emerging', nextHref: 'https://thefoundedemerging.app', delay: 160 },
            ].map(node => (
              <Reveal key={node.name} delay={node.delay}>
                <NodeCard {...node} />
              </Reveal>
            ))}
          </div>

          {/* SERVICES */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Practice — Services & Consulting
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
                desc="The 21-day structured reset program. Daily worksheets, breathwork protocols, and community accountability for people ready to rebuild from the ground up."
                nextLabel="Rooted Reclaimers"
                nextHref="/about#rooted"
                status="Live"
              />
            </Reveal>
          </div>

          {/* MERCH */}
          <Reveal delay={80}>
            <p style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(15,27,31,0.1)' }}>
              The Store — Branded Merchandise
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ backgroundColor: '#0F1B1F', borderRadius: 10, padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Founded Project Store</p>
                <h3 style={{ color: '#F5F0E8', fontSize: 24, fontWeight: 300, lineHeight: 1.3, marginBottom: 12 }}>Wear the work.<br />Carry the mission.</h3>
                <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 15, lineHeight: 1.65 }}>Branded apparel and goods from across the ecosystem — The Founded, GroundedVote, RhetoricalPoints, Journey from the Edge, and Rooted Reclaimers.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['The Founded — Governance apparel', 'GroundedVote — Civic tools merch', 'Journey from the Edge — Reclamation gear', 'Rooted Reclaimers — Community wear'].map(item => (
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
              Whether you enter through a book, a civic tool, a debate, or a consulting engagement — the arc is the same. Name the survival. Reclaim the agency. Build the governance. The Founded App is where the governance lives.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, backgroundColor: 'rgba(216,171,105,0.1)' }}>
            {[
              { from: 'Journey from the Edge', to: 'Rooted Reclaimers', arrow: 'Survival named → Community found', href: 'https://www.amazon.com/dp/B0GTXBZGJY' },
              { from: 'Rooted Reclaimers', to: 'The Founded App', arrow: 'Community found → Governance built', href: 'https://thefounded.app' },
              { from: 'RhetoricalPoints', to: 'GroundedVote', arrow: 'Truth detected → Alignment found', href: 'https://groundedvote.com' },
              { from: 'GroundedVote', to: 'The Founded App', arrow: 'Civic clarity → Personal governance', href: 'https://thefounded.app' },
              { from: 'Founded Emerging', to: 'The Founded App', arrow: 'Youth governance → Adult governance', href: 'https://thefounded.app' },
              { from: 'GreyDoc Consulting', to: 'The Founded App', arrow: 'Organizational wellness → Personal governance', href: 'https://thefounded.app' },
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
            That's the founding conviction. Everything in this ecosystem was built from it.
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
            <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>There are many doors into this ecosystem. Three honest questions will point you toward the right one.</p>
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
            { title: 'P/AIRS Bodywork', status: 'Forthcoming 2026', statusColor: '#D9A441', desc: 'A practitioner guide to the body as a site of healing. Touch, relationship, and the nervous system.', next: { label: 'The Founded App', href: 'https://thefounded.app' } },
            { title: 'The South Never Lost', status: 'In Progress', statusColor: '#D9A441', desc: 'The algorithmic plantation, democratic integrity, and what the South has always known and protected. An unfinished reckoning in progress.', next: { label: 'GroundedVote', href: 'https://groundedvote.com' } },
            { title: 'The Founded: A Human Enterprise Project', status: 'Forthcoming', statusColor: 'rgba(15,27,31,0.35)', desc: 'The governance framework. Structure for people who reclaimed their lives and are ready to protect what they built.', next: { label: 'The Founded App', href: 'https://thefounded.app' } },
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
                Clinician, author, platform builder, and civic technologist. Three generations of doctors. Two decades of practice. One mission: get humans organized and reinforced.
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
