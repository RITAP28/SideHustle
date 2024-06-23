/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Dmsans: ["DM Sans", "sans-serif"],
        Philosopher: ["Philosopher", "sans-serif"],
        SpaceGrotesk: ["SpaceGrotesk", "sans-serif"],
        Dmserif: ["DM Serif Text", "serif"],
        Code: ["Source Code Pro", "monospace"]
      }
    },
  },
  plugins: [],
}

