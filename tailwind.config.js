// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prolinco-primary': '#FFC400',
        'prolinco-secondary': '#002B7F',
        'prolinco-light': '#F8F8F8',
        'prolinco-dark': '#333333',
      },
    },
  },
  plugins: [],
}