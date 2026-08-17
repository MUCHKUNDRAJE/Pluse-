/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        urgent: {
          red: "#EF4444",
          "red-dark": "#991B1B",
          yellow: "#F59E0B",
          "yellow-dark": "#92400E",
          green: "#10B981",
          "green-dark": "#065F46",
        },
        brand: {
          blue: "#3B82F6",
          dark: "#0B0F19",
          card: "#151C2C",
          border: "#2A364F",
          accent: "#06B6D4",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
