import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#FBFBFD",       // Apple light canvas
          card: "#FFFFFF",     // Apple smooth card
          subtle: "#F5F5F7",   // Apple subtle background
          border: "#E5E5EA",   // Apple border
          hover: "#E8E8ED",
          text: "#1D1D1F",     // Apple primary text
          secondary: "#515458",// Apple secondary text
          muted: "#86868B",    // Apple muted text
        },
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
        env: {
          emerald: "#059669",
          forest: "#065F46",
          leaf: "#10B981",
          sky: "#0284C7",
          cyan: "#0EA5E9",
          amber: "#D97706",
          orange: "#EA580C",
          crimson: "#DC2626",
        },
        status: {
          healthy: {
            DEFAULT: "#059669",
            subtle: "rgba(5, 150, 105, 0.12)",
            border: "rgba(5, 150, 105, 0.35)",
            text: "#059669",
          },
          watch: {
            DEFAULT: "#D97706",
            subtle: "rgba(217, 119, 6, 0.12)",
            border: "rgba(217, 119, 6, 0.35)",
            text: "#D97706",
          },
          stressed: {
            DEFAULT: "#EA580C",
            subtle: "rgba(234, 88, 12, 0.12)",
            border: "rgba(234, 88, 12, 0.35)",
            text: "#EA580C",
          },
          critical: {
            DEFAULT: "#DC2626",
            subtle: "rgba(220, 38, 38, 0.12)",
            border: "rgba(220, 38, 38, 0.35)",
            text: "#DC2626",
          },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
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
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
