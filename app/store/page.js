export const metadata = {
  title: 'Store | The Founded Project',
  description: 'Shop apparel and goods from The Founded Project, Founded Emerging, Rhetorical Points, and GroundedVote.',
}

const ETSY_STORE = 'https://www.etsy.com/shop/TheFoundedStore'

const PRODUCTS = [
  {
    brand: 'The Founded',
    name: 'AGENCY MATTERS Hoodie',
    price: '$54.99',
    image: '/store/agency-matters-hoodie.webp',
    href: 'https://www.etsy.com/listing/4573022500/copy-of-facts-over-feelings-hoodie',
    note: 'A declaration and a reminder: agency changes what comes next.',
  },
  {
    brand: 'The Founded',
    name: 'The Founded Hardcover Journal',
    price: '$27.99',
    image: '/store/founded-journal.webp',
    href: 'https://www.etsy.com/listing/4571748263/the-founded-hardcover-journal-agency-and',
    note: 'A place to record decisions, direction, and the work of governing a life.',
  },
  {
    brand: 'The Founded',
    name: 'RESOURCED Signature Water Bottle',
    price: '$49.99',
    image: '/store/resourced-signature-bottle.webp',
    href: 'https://www.etsy.com/listing/4570971603/resourced-water-bottle-the-founded-17-oz',
    note: 'The original stainless-steel RESOURCED bottle in black or white.',
  },
  {
    brand: 'The Founded',
    name: 'RESOURCED Sport Water Bottle',
    price: '$29.99',
    image: '/store/resourced-sport-bottle.webp',
    href: 'https://www.etsy.com/listing/4571761584/resourced-sport-water-bottle-the-founded',
    note: 'A lighter everyday companion for movement, practice, and recovery.',
  },
  {
    brand: 'Founded Emerging',
    name: 'INEVITABLE Flat Bill Cap',
    price: '$34.99',
    image: '/store/inevitable-cap.webp',
    href: 'https://www.etsy.com/listing/4571764698/inevitable-embroidered-flat-bill-cap',
    note: 'Educated. Emerging. Becoming harder to overlook.',
  },
  {
    brand: 'Rhetorical Points',
    name: 'Facts Over Feelings Hoodie',
    price: '$54.99',
    image: '/store/facts-over-feelings-hoodie.webp',
    href: 'https://www.etsy.com/listing/4571743211/facts-over-feelings-hoodie-rhetorical',
    note: 'Emotion carries information. Evidence still has to carry the claim.',
  },
  {
    brand: 'Rhetorical Points',
    name: 'Verify Before You Vilify Hoodie',
    price: '$54.99',
    image: '/store/verify-before-vilify-hoodie.webp',
    href: 'https://www.etsy.com/listing/4573057271/verify-before-you-vilify-hoodie',
    note: 'Slow the verdict down long enough to check the claim.',
  },
  {
    brand: 'GroundedVote',
    name: 'Policy Over Party Crewneck',
    price: '$40.99',
    image: '/store/policy-over-party-crewneck.webp',
    href: 'https://www.etsy.com/listing/4573079316/policy-over-party-crewneck-groundedvote',
    note: 'Ask what the policy does before asking which team proposed it.',
  },
  {
    brand: 'GroundedVote',
    name: 'Policy Over Party Long Sleeve Tee',
    price: '$30.99',
    image: '/store/policy-over-party-long-sleeve.jpg',
    href: 'https://www.etsy.com/listing/4573065717/policy-over-party-long-sleeve-tee',
    note: 'The Policy Over Party equation on a lighter long-sleeve layer.',
  },
]

const COMING_SOON = [
  {
    brand: 'Afro-Loon of Minnesota',
    name: 'Afro-Loon Embroidered Cap',
    price: '$44.99',
    image: '/store/afro-loon-embroidered-cap.png',
    imageBackground: '#121212',
    note: 'A circular embroidered loon badge carrying Minnesota identity through a Black cultural lens.',
  },
  {
    brand: 'Black Art Saves Lives',
    name: 'Black Art Saves Lives Tee',
    image: '/store/black-art-saves-lives-tee.png',
    imageBackground: '#111111',
    note: 'A flowering Black power fist for the art, expression, and imagination that keep people alive.',
  },
  {
    brand: 'The Founded',
    name: 'I AM AGENTIC Tee',
    image: '/store/i-am-agentic-tee.png',
    imageBackground: '#111111',
    note: 'Agency is not a destination. It is a practice.',
  },
  {
    brand: 'Founded Emerging',
    name: 'EDUCATED & EMERGING Hoodie',
    image: '/store/educated-emerging-hoodie.png',
    imageBackground: '#103B31',
    note: 'Education creates the conditions; emergence makes growth visible.',
  },
  {
    brand: 'Rhetorical Points',
    name: 'RHETORICAL ORACLE Cap',
    image: '/store/rhetorical-oracle-cap.png',
    imageBackground: '#111111',
    note: 'For the person who asks the second question before accepting the first answer.',
  },
  {
    brand: 'The Founded',
    name: 'RECLAIMED / GOVERNED / DISCERNING',
    image: '/store/reclaimed-governed-discerning.png',
    imageBackground: '#F5F0E8',
    note: 'Three capacities at the center of reclaiming and governing a life.',
  },
]

function ProductCard({ product }) {
  const isComingSoon = !product.href

  return (
    <article style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15,27,31,0.09)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: product.imageBackground || '#EFEAE1', aspectRatio: '1 / 1', overflow: 'hidden', padding: isComingSoon ? 24 : 0 }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: isComingSoon ? 'contain' : 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ color: '#9A7135', fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>{product.brand}</p>
        <h2 style={{ color: '#0F1B1F', fontSize: 20, lineHeight: 1.25, marginBottom: 10 }}>{product.name}</h2>
        <p style={{ color: 'rgba(15,27,31,0.62)', fontSize: 13, lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{product.note}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#0F1B1F', fontSize: 18, fontWeight: 800 }}>{product.price || 'Coming soon'}</span>
          <a href={product.href || ETSY_STORE} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#0F1B1F', color: '#D8AB69', padding: '11px 18px', borderRadius: 6, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
            {isComingSoon ? 'Visit Etsy →' : 'Buy on Etsy →'}
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Store() {
  return (
    <>
      <section style={{ backgroundColor: '#0F1B1F', padding: '104px 24px 88px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#D8AB69', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>The Founded Project Store</p>
          <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.03em', maxWidth: 850, marginBottom: 26 }}>
            Wear the work.<br /><span style={{ color: '#D8AB69' }}>Carry the language.</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 17, lineHeight: 1.75, maxWidth: 650, marginBottom: 34 }}>
            Objects from across the Founded ecosystem—designed to make agency, discernment, reclamation, and grounded civic life visible in the world.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#shop" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F', padding: '14px 28px', borderRadius: 6, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>Shop the collection ↓</a>
            <a href={ETSY_STORE} target="_blank" rel="noopener noreferrer" style={{ border: '1px solid rgba(216,171,105,0.35)', color: '#D8AB69', padding: '14px 28px', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Visit our Etsy store →</a>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#D8AB69', padding: '24px' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center md:justify-between">
          {['Four ecosystem brands', 'Made to order', 'Secure Etsy checkout', 'Shipped to your door'].map(item => (
            <span key={item} style={{ color: '#0F1B1F', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>◈ {item}</span>
          ))}
        </div>
      </section>

      <section id="shop" style={{ backgroundColor: '#F5F0E8', padding: '82px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#9A7135', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Available now</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 42 }}>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 300, lineHeight: 1.15 }}>The first Founded collection.</h2>
            <p style={{ color: 'rgba(15,27,31,0.55)', fontSize: 13 }}>Purchases are securely completed on Etsy.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 22 }}>
            {PRODUCTS.map(product => <ProductCard key={product.name} product={product} />)}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#E9E1D4', padding: '82px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#9A7135', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>New designs</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 42 }}>
            <h2 style={{ color: '#0F1B1F', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 300, lineHeight: 1.15 }}>Coming into the collection.</h2>
            <p style={{ color: 'rgba(15,27,31,0.55)', fontSize: 13, maxWidth: 430 }}>These designs are in production. The Etsy store will carry each product as it clears final review.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 22 }}>
            {COMING_SOON.map(product => <ProductCard key={product.name} product={product} />)}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#0F1B1F', padding: '76px 24px' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ color: '#F5F0E8', fontSize: 'clamp(21px, 3vw, 32px)', fontWeight: 300, lineHeight: 1.55, marginBottom: 28 }}>
            These are not slogans detached from the work. They are pieces of a shared language for people reclaiming agency, practicing discernment, and building lives they can govern.
          </p>
          <a href={ETSY_STORE} target="_blank" rel="noopener noreferrer" style={{ color: '#D8AB69', fontSize: 13, fontWeight: 800, textDecoration: 'none', borderBottom: '1px solid rgba(216,171,105,0.35)', paddingBottom: 3 }}>See everything on Etsy →</a>
        </div>
      </section>
    </>
  )
}
