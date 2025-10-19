/** @type {import('tailwindcss').Config} */
const animate = require("tailwindcss-animate");

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [animate],
};
