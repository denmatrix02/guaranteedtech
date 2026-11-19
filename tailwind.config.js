/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFB200",
          yellowHover: "#E6A100",
          yellowLight: "#FFF7E6",
          dark: "#0F172A",
          charcoal: "#1E293B",
          slate: "#334155",
          muted: "#64748B",
          lightGray: "#F8F9FA",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["'Outfit'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        outfit: ["'Outfit'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
