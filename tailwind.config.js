/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)'
        },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)'
        },
        border: 'var(--border)'
      }
    },
  },
  plugins: [],
};