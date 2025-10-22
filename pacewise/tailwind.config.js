/** @type {import('tailwindcss').Config} */
const animate = require("tailwindcss-animate");

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [animate, require("tailwind-scrollbar-hide")],
};
