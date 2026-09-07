/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          red: '#DC2626',
          navy: '#0F172A',
          bg: '#F8FAFC',
          text: '#111827',
          muted: '#64748B',
          border: '#E2E8F0',
          'blue-light': '#EFF6FF',
          'red-light': '#FEF2F2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}