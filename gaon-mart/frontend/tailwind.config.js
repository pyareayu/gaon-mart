/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        litchi: {
          50: "#fff1f0",
          100: "#ffe1de",
          400: "#ef6d5f",
          500: "#e14c3a",
          600: "#c53a2a",
          700: "#9e2c1f",
        },
        leaf: {
          50: "#f0f7ec",
          100: "#dcedd0",
          400: "#6ea648",
          500: "#4d8330",
          600: "#3b6624",
          700: "#2c4d1b",
        },
        mustard: {
          50: "#fdf8e8",
          100: "#faedbf",
          400: "#e8b923",
          500: "#cf9f14",
        },
        earth: {
          50: "#faf7f2",
          100: "#f1ebe0",
          800: "#463527",
          900: "#2c2118",
        },
      },
      fontFamily: {
        display: ["'Poppins'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(44, 33, 24, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
