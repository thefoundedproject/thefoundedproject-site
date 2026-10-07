import Link from 'next/link'

export default function AtlasNotFound() {
  return (
    <div className="a-measure a-stack">
      <h1>That record isn&apos;t here.</h1>
      <p className="a-muted">The ID may have been retired when the manuscript changed. Search for the text instead.</p>
      <div className="a-row">
        <Link href="/atlas/explore" className="a-btn">Search the atlas</Link>
        <Link href="/atlas" className="a-btn a-btn-secondary">Start here</Link>
      </div>
    </div>
  )
}
