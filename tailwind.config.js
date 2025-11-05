/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fraggle: {
          pink: "#ff6ea8",
          orange: "#ff8c42",
          yellow: "#ffd166",
          green: "#22c55e",
          teal: "#2dd4bf",
          blue: "#60a5fa",
          purple: "#a78bfa",
          rock: "#111827",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,255,255,0.15)",
        neonglow: "0 0 20px rgba(255, 110, 168, 0.6), 0 0 40px rgba(96, 165, 250, 0.3)",
      },
    },
  },
  plugins: [],
};
