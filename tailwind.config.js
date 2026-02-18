/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD1DC',
          blue: '#AEC6CF',
          cream: '#FFFDD0',
          peach: '#FFDAB9',
          mint: '#B2F2BB',
        },
      },
      borderRadius: {
        'xl-plus': '2rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}