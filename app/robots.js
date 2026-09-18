/**
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 *
 * /robots.txt. Every crawler is welcome, AI assistants included: being quoted
 * in an AI answer is traffic too. Only the API routes stay out of indexes,
 * since they return data rather than pages.
 */
const SITE = 'https://thefoundedproject.com'

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
