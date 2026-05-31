import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#020204",
        surface: "#0A0C10",
        border: "#1E2433",
        primary: "#F0F2F7",
        secondary: "#8892A4",
        accent: "rgb(var(--accent) / <alpha-value>)",
        gold: "#E8D5B0",
        green: "#3DDC84",
      },
      fontFamily: {
        spacex: ["var(--font-spacex)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      spacing: {
        section: "120px",
      },
      borderRadius: {
        card: "8px",
        button: "4px",
        tile: "12px",
      },
      animation: {
        "star-drift": "star-drift 60s linear infinite",
        "blink-separator": "blink-separator 1.2s step-end infinite",
        "scroll-left": "scroll-left 30s linear infinite",
        "scroll-right": "scroll-left 30s linear infinite reverse",
      },
      keyframes: {
        "star-drift": {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(12px, -8px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "blink-separator": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
