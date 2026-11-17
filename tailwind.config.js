/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hust: {
          red: '#b91c1c',
          dark: '#991b1b',
          light: '#fef2f2'
        }
      }
    },
  },
  plugins: [],
}
