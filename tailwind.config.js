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
        fids: {
          bg: '#0a0c10',
          card: '#111317',
          border: '#1f2229',
          accent: '#2d7aff',
        }
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}