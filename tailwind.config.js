/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          night: '#0F1B1F',
          DEFAULT: '#1A3A42',
          light: '#2A5A66',
        },
        gold: {
          wheat: '#D8AB69',
          light: '#E8C88A',
          dark: '#B8894A',
        },
        cream: '#F5F0E8',
        offwhite: '#FAFAF7',
        // Arc colors — section progression that mirrors the book's tonal arc.
        // Awareness · Grief · Capacity · Belonging.
        arc: {
          cedar: '#2D4A47',   // Awareness · cool
          amber: '#B86B3A',   // Grief · warm
          moss:  '#3F5D3A',   // Capacity · living
          bloom: '#E8C68A',   // Belonging · soft
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
