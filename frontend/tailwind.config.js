/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clash-blue': '#3b82f6',    // Синий как в игре
        'clash-gold': '#fbbf24',    // Золотой для трофеев
        'clash-dark': '#1f2937',    // Тёмный фон
        'clash-bg': '#111827',       // Основной фон
      }
    },
  },
  plugins: [],
}