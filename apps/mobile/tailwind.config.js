/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bervic: {
          red: "#DC2626",
          crimson: "#991B1B",
          ruby: "#7F1D1D",
          rose: "#FEF2F2",
          subtle: "#FEE2E2",
          white: "#FFFFFF",
          canvas: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
