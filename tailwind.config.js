/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        yellow: {
          400: '#FBBF24',
          500: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
};