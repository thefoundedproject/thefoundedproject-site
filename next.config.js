/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  /**
   * The Research Atlas reads its ledgers from atlas-data/ (never public/, which
   * would bypass the password middleware). JSON is imported at build time; the
   * CSV and Markdown exports are read from disk on request, so a standalone
   * build has to carry the folder along.
   */
  experimental: {
    outputFileTracingIncludes: {
      '/atlas/api/[name]': ['./atlas-data/**/*'],
    },
  },

  /**
   * Short paths that get said out loud.
   *
   * "thefoundedproject.com slash join" survives being spoken on air. The real
   * path does not. Kept non-permanent (307) on purpose: a 308 gets cached hard
   * by browsers, and a shortcut that outlives the show it points at is worse
   * than no shortcut.
   */
  async redirects() {
    return [
      {
        source: '/join',
        destination: '/consider-otherwise/join',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
