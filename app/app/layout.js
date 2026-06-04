import './globals.css'

export const metadata = {
  title: 'The Founded Project | Dr. Stephen Thompson, DC, DACM, FAIHM',
  description: 'The Founded Project is the ecosystem of Dr. Stephen Thompson — survivor-scholar-clinician, author, and founder of Human Enterprise Theory. Books, platforms, civic tools, and healing infrastructure built to get humans organized and reinforced.',
  keywords: 'Human Enterprise Theory, Dr. Stephen Thompson, Founded Project, GroundedVote, trauma-informed, survivor scholar, Black healing, civic alignment',
  openGraph: {
    title: 'The Founded Project',
    description: 'Get humans organized and reinforced.',
    url: 'https://thefoundedproject.com',
    siteName: 'The Founded Project',
    type: 'website',
  },
}

function Nav() {
  return (
    <nav style={{ backgroundColor: '#0F1B1F' }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="text-white font-semibold text-lg tracking-wide">
          The Founded Project
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">About</a>
          <a href="/books" className="text-gray-300 hover:text-white text-sm transition-colors">Books</a>
          <a href="/projects" className="text-gray-300 hover:text-white text-sm transition-colors">Projects</a>
          <a href="/speaking" className="text-gray-300 hover:text-white text-sm transition-colors">Speaking</a>
          <a href="/contact" style={{ backgroundColor: '#D8AB69', color: '#0F1B1F' }} className="px-4 py-2 text-sm font-semibold rounded hover:opacity-90 transition-opacity">
            Connect
          </a>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-white" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F1B1F' }} className="text-gray-400 py-16 px-6 mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="text-white font-semibold text-lg mb-3">The Founded Project</div>
            <p className="text-sm leading-relaxed max-w-sm">
              Get humans organized and reinforced. Answer the questions society isn&apos;t asking yet — because they don&apos;t yet have the language.
            </p>
            <div style={{ width: '40px', height: '2px', backgroundColor: '#D8AB69' }} className="mt-4" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Ecosystem</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://thefounded.app" className="hover:text-white transition-colors">The Founded App</a></li>
              <li><a href="https://thefoundedemerging.app" className="hover:text-white transition-colors">Founded Emerging</a></li>
              <li><a href="https://groundedvote.com" className="hover:text-white transition-colors">GroundedVote</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Dr. Thompson</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/books" className="hover:text-white transition-colors">Books</a></li>
              <li><a href="/speaking" className="hover:text-white transition-colors">Speaking</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs">© 2026 Dr. Stephen Thompson, DC, DACM, FAIHM. All rights reserved.</p>
          <p className="text-xs">Dr. Stephen Thompson | DC · DACM · FAIHM · NWHSU · AIHM Fellow</p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
