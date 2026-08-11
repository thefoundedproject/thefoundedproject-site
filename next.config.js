/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

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
