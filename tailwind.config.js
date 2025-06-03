/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00E0FF', // Cyan brillant pour CINEWAVE
        'primary-dark': '#0088A3',
        background: {
          dark: '#000000',
          light: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}

