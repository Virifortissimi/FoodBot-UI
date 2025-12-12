/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c7a7b',
          dark: '#1f5a5b',
        },
        secondary: {
          DEFAULT: '#d4a574',
          dark: '#a87c54',
        },
      },
    },
  },
  plugins: [],
}

