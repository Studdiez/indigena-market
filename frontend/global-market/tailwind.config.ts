import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pulse Design System
        'wisdom-red': '#B51D19',
        'wisdom-red-dark': '#8B1515',
        'golden-sun': '#FDB910',
        'golden-sun-dark': '#E5A200',
        'deep-earth': '#1A1A1A',
        'sacred-green': '#2A5C3E',
        'surface': '#242424',
        'surface-light': '#2E2E2E',
        'border-dim': '#333333',
      },
    },
  },
  plugins: [],
}

export default config
