import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Custom font configuration
        sans: ['MyCustomFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        airbnb: {
          red: '#FF385C',
          dark: '#222222',
          light: '#717171',
        },
      },
    },
  },
  plugins: [],
}

export default config 