/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        background: { light: '#ffffff', dark: '#0f172a' },
        surface: { light: '#f8fafc', dark: '#1e293b' },
        primary: { 50: '#f0f9ff', 500: '#0ea5e9', 600: '#0284c7' },
      },
    },
  },
  plugins: [],
}
