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
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'white' },
        },
      },
      animation: {
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both, blink 500ms steps(40) infinite normal',
      },
    },
  },
  plugins: [],
}

