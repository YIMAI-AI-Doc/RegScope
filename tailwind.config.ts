import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f8fc",
          100: "#ebf0f8",
          200: "#d7dfef",
          300: "#b8c7df",
          400: "#8fa2c2",
          500: "#657999",
          600: "#465a78",
          700: "#31405a",
          800: "#1e2a3f",
          900: "#0f1727",
        },
      },
      boxShadow: {
        card: "0 18px 50px rgba(16, 24, 40, 0.08)",
      },
      backgroundImage: {
        "regscope-grid":
          "linear-gradient(rgba(104, 132, 171, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(104, 132, 171, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
