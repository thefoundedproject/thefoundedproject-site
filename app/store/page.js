export const metadata = {
  title: 'Store | The Founded Project',
  description: 'Wear the work. Back the mission. Branded apparel and goods from across The Founded Project ecosystem. The Founded, GroundedVote, RhetoricalPoints, Journey from the Edge, and Rooted Reclaimers.',
}

const COLLECTIONS = [
  {
    brand: 'The Founded',
    tag: 'Personal Governance · Human Enterprise',
    color: '#0F1B1F',
    textColor: '#D8AB69',
    description: 'Governance apparel for survivors building serious lives. Minimal. Intentional. Apparel that lasts.',
    items: ['Structured Governance Tee', 'Founded Crewneck', 'Human Enterprise Cap', 'Governance Hoodie'],
    badge: 'Core Collection',
  },
  {
    brand: 'GroundedVote',
    tag: 'Civic Alignment · Democracy',
    color: '#1A3A42',
    textColor: '#D8AB69',
    description: 'Civic participation gear. For voters who go off their actual convictions.',
    items: ['Grounded Voter Tee', 'Civic Alignment Cap', 'GroundedVote Tote', 'Democracy Hoodie'],
    badge: 'Civic Collection',
  },
  {
    brand: 'Journey from the Edge',
    tag: 'Memoir · Reclamation · Survival',
    color: '#2C1810',
    textColor: '#D8AB69',
    description: 'Wearable reclamation. Built from one conviction: survival is genius. Apparel for survivors ready to give that genius somewhere to go.',
    items: ['Survival Is Genius Tee', 'Journey Crewneck', 'Edge to Edge Cap', 'Reclamation Tote'],
    badge: 'Book Collection',
  },
  {
    brand: 'Rooted Reclaimers',
    tag: 'Community · Healing · Belonging',
    color: '#1B2D1E',
    textColor: '#D8AB69',
    description: 'Community wear for the daily work of reclamation. Every piece signals that you belong. You\'re rebuilding on your own terms.',
    items: ['Rooted Community Tee', 'Reclaimers Crewneck', 'Breathwork Cap', 'Movement Shorts'],
    badge: 'Community Collection',
  },
  {
    brand: 'RhetoricalPoints',
    tag: 'Truth · Accountability · Media Literacy',
    color: '#0D1F2D',
    textColor: '#D8AB69',
    description: 'Wear your commitment to truth. For the fact-checkers, journalists, and citizens who keep power honest.',
    items: ['Fact-Check Tee', 'Integrity Cap', 'RhetoricalPoints Tote', 'Truth Hoodie'],
    badge: 'Civic Tools Collection',
  },
]

function CollectionCard({ brand, tag, color, textColor, description, items, badge }) {
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1.5px solid rgba(15,27,31,0.08)' }}>
      {/* Header */}
      <div style={{ backgroundColor: color, padding: '32px' }}>
        <span style={{ color: 'rgba(216,171,105,0.5)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{badge}</span>
        <h3 style={{ color: textColor, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{brand}</h3>
        <p style={{ color: 'rgba(216,171,105,0.55)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tag}</p>
      </div>
      {/* Body */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '28px 32px' }}>
        <p style={{ color: 'rgba(15,27,31,0.65)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>{description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {items.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F1B1F', fontSize: 12 }}>
              <span style={{ color: '#D8AB69', fontSize: 10 }}>◈</span>
              {item}
            </div>
          ))}
        </div>
        <a
          href="https://thefoundedproject.com/store"
          style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', padding: '10px 24px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
        >
          Shop {brand} →
        </a>
      </div>
    </div>
  )
}

// ─── Phone Mockup (merch preview) ─────────────────────────────────────────────
function MerchMockup() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{
        width: 280,
        backgroundColor: '#0F1B1F',
        borderRadius: 32,
        padding: '16px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(216,171,105,0.15)',
        position: 'relative',
      }}>
        {/* Screen */}
        <div style={{ backgroundColor: '#1A3A42', borderRadius: 22, overflow: 'hidden', padding: '24px 20px' }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <span style={{ color: 'rgba(216,171,105,0.5)', fontSize: 10 }}>9:41</span>
            <span style={{ color: 'rgba(216,171,105,0.5)', fontSize: 10 }}>●●●</span>
          </div>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ color: '#D8AB69', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>The Founded Project</span>
            <div style={{ width: 40, height: 1, backgroundColor: 'rgba(216,171,105,0.3)', margin: '8px auto 0' }} />
          </div>
          {/* Product cards */}
          {['Founded Tee', 'Governance Cap', 'Reclamation Hoodie'].map((item, i) => (
            <div key={item} style={{
              backgroundColor: i === 0 ? '#D8AB69' : 'rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: i === 0 ? '#0F1B1F' : 'rgba(245,240,232,0.8)', fontSize: 11, fontWeight: 600 }}>{item}</span>
              <span style={{ color: i === 0 ? '#0F1B1F' : '#D8AB69', fontSize: 11, fontWeight: 700 }}>$38</span>
            </div>
          ))}
          <div style={{ backgroundColor: '#D8AB69', borderRadius: 10, padding: '12px', textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#0F1B1F', fontSize: 12, fontWeight: 700 }}>Shop All →</span>
          </div>
        </div>
        {/* Home indicator */}
        <div style={{ width: 80, height: 4, backgroundColor: 'rgba(216,171,105,0.3)', borderRadius: 2, margin: '12px auto 4px' }} />
      </div>
    </div>
  )
}

export default function Store() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', paddingTop: '96px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>The Founded Project Store</p>
            <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 }}>
              Wear the work.<br />
              <span style={{ color: '#D8AB69' }}>Back the mission.</span>
            </h1>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
              Every collection in the store connects to a node in the ecosystem. Wear what you believe. Signal what you\'re building.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#collections" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Browse Collections ↓
              </a>
              <a href="https://thefounded.app" target="_blank" rel="noopener noreferrer"
                style={{ border: '1px solid rgba(216,171,105,0.3)', color: 'rgba(216,171,105,0.7)', padding: '14px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                The App →
              </a>
            </div>
          </div>
          <MerchMockup />
        </div>
      </section>

      {/* ── MISSION STRIP ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#D8AB69', padding: '28px 24px' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8 justify-center md:justify-between items-center">
          {['5 Ecosystem Collections', 'Mission-Driven Design', 'Quality Apparel & Goods', 'Ships Nationwide'].map(item => (
            <span key={item} style={{ color: '#0F1B1F', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>◈ {item}</span>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────────────────────────────── */}
      <section id="collections" style={{ backgroundColor: '#F5F0E8', padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Collections</p>
          <h2 style={{ color: '#0F1B1F', fontSize: 36, fontWeight: 300, marginBottom: 48 }}>Every collection is a conviction.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {COLLECTIONS.map(c => <CollectionCard key={c.brand} {...c} />)}
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0F1B1F', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ color: 'rgba(216,171,105,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Why a store</p>
          <p style={{ color: '#F5F0E8', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 300, lineHeight: 1.55, marginBottom: 32 }}>
            The work travels farther when we can see each other doing it. A tee is a signal. A cap is a flag. Wear this work and you help the next survivor find their way here.
          </p>
          <div style={{ width: 40, height: 2, backgroundColor: '#D8AB69', margin: '0 auto 32px' }} />
          <a href="/about" style={{ color: 'rgba(216,171,105,0.7)', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.3)', paddingBottom: 2 }}>
            Learn about the ecosystem →
          </a>
        </div>
      </section>
    </>
  )
}
