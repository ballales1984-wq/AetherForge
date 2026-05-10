import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          black: "#050505",
          silver: "#a1a1aa",
          mist: "#e4e4e7",
          ember: "#ea580c",
          red: "#ef4444",
        },
        cyan: {
          300: "#22d3ee",
          400: "#22d3ee",
          500: "#06b6d4",
          900: "#155e75",
        },
        purple: {
          300: "#c084fc",
          500: "#a855f7",
          900: "#581c87",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
