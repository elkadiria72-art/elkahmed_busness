import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F3B57",
          50: "#F3F6FA",
          100: "#E6EDF4",
          200: "#C7D7E5",
          300: "#9DB9D0",
          400: "#6D94B4",
          500: "#4A7598",
          600: "#385C7C",
          700: "#2C4963",
          800: "#1F3B57",
          900: "#1A3249",
          950: "#132435",
        },
        accent: {
          DEFAULT: "#C9A34E",
          50: "#FBF8EF",
          100: "#F6EFDA",
          200: "#EDDCB2",
          300: "#E2C584",
          400: "#D6AF5B",
          500: "#C9A34E",
          600: "#AE8840",
          700: "#8B6936",
          800: "#745632",
          900: "#63482D",
          950: "#3A2817",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(19, 36, 53, 0.05), 0 10px 30px -12px rgba(19, 36, 53, 0.12)",
        "card-hover":
          "0 2px 4px rgba(19, 36, 53, 0.06), 0 18px 40px -12px rgba(19, 36, 53, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
