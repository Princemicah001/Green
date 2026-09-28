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
        eco: {
          950: "#0B0D0F", // Near Black
          900: "#111417",
          850: "#15181B", // Graphite
          800: "#1B1F23", // Surface
          750: "#22272D",
          700: "#2A2F34", // Border
          600: "#383F46",
          500: "#4D565F",
          400: "#60676E", // Muted Text
          300: "#8B9299", // Secondary Text
          200: "#B8BEC4",
          100: "#E1E4E7",
          50: "#F4F5F6",  // Primary Text
        },
        status: {
          healthy: {
            DEFAULT: "#2E8B57",
            subtle: "rgba(46, 139, 87, 0.12)",
            border: "rgba(46, 139, 87, 0.35)",
            text: "#3DD68C",
          },
          watch: {
            DEFAULT: "#C9822B",
            subtle: "rgba(201, 130, 43, 0.12)",
            border: "rgba(201, 130, 43, 0.35)",
            text: "#F59E0B",
          },
          stressed: {
            DEFAULT: "#D9532F",
            subtle: "rgba(217, 83, 47, 0.12)",
            border: "rgba(217, 83, 47, 0.35)",
            text: "#FB7142",
          },
          critical: {
            DEFAULT: "#B93838",
            subtle: "rgba(185, 56, 56, 0.14)",
            border: "rgba(185, 56, 56, 0.4)",
            text: "#F87171",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "'SF Mono'",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.02em",
        tighter: "-0.015em",
        tight: "-0.01em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.12em",
      },
    },
  },
  plugins: [],
};
export default config;
