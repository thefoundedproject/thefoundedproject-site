import Script from 'next/script'
import Nav from './Nav'

/**
 * Public-site layout: nav, footer, and the William concierge widget.
 * Every public page sits inside this route group. The Research Atlas
 * (/atlas) is deliberately outside it.
 */

// William — the Founded Project concierge. Served by the isolated concierge
// service; no access to this site's code or data.
const CONCIERGE_URL = 'https://rhetoricalpoints-production-4da4.up.railway.app'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#17110B' }} className="text-gray-400 py-16 px-6 mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/brand/logo_mark_gold.png" alt="" className="h-9 w-auto" />
              <span className="text-white font-semibold text-lg" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>The Founded Project</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-4">
              Get humans organized and reinforced. Answering questions society has yet to ask.
            </p>
            <div style={{ width: '40px', height: '2px', backgroundColor: '#E0A45B' }} className="mt-4" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://thefounded.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">The Founded</a></li>
              <li><a href="https://thefoundedemerging.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Founded Emerging</a></li>
              <li><a href="https://groundedvote.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GroundedVote</a></li>
              <li><a href="https://rhetoricalpoints.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RhetoricalPoints</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Services</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://greydoc.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GreyDoc Consulting</a></li>
              <li><a href="/certification" className="hover:text-white transition-colors">Certification</a></li>
              <li><a href="/golden-eight" className="hover:text-white transition-colors">Golden Eight</a></li>
              <li><a href="/speaking" className="hover:text-white transition-colors">Speaking</a></li>
              <li><a href="/books" className="hover:text-white transition-colors">Books</a></li>
              <li><a href="/store" className="hover:text-white transition-colors">Store</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Stephen Thompson</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        {/* Permission line — present on every page, every visit. */}
        <div className="border-t border-gray-800 pt-8 pb-6 text-center">
          <p style={{ color: '#D8AB69', fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            You can stop anytime. No pushing through.
            <br />
            Pause check: breath, shoulders, jaw. You choose the pace.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-gray-800 pt-6">
          <p className="text-xs">© 2026 Stephen Thompson, DC, DACM. All rights reserved.</p>
          <p className="text-xs">The Founded Project · Stockheart Whole Health · GreyDoc Consulting · Odigo Properties</p>
        </div>
        <p className="text-xs text-gray-500 mt-4" style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.6 }}>
          Photography via Unsplash: Alexander Grey, Melissa Askew.
          <br />
          The Founded app screenshots, interaction patterns, and copy are proprietary work of Stephen Thompson. Unauthorized reproduction, reverse engineering, or derivative use is prohibited.
        </p>
      </div>
    </footer>
  )
}

export default function SiteLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Script id="rpc-config" strategy="beforeInteractive">
        {`window.RP_CONCIERGE={site:'thefoundedproject',api:'${CONCIERGE_URL}',name:'William',accent:'#D8AB69'}`}
      </Script>
      <Script src={`${CONCIERGE_URL}/widget.js`} strategy="afterInteractive" />
    </>
  )
}
