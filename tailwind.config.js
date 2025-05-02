/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Airbnb Cereal"', 'system-ui', 'sans-serif'],
        airbnb: ['"Airbnb Cereal"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: []
}

