/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        elevated: "0 6px 18px rgba(16,24,40,0.06)",
      },
    },
  },
  plugins: [],
};
