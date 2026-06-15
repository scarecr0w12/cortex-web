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
        surface: {
          DEFAULT: "#111118",
          light: "#18181f",
          lighter: "#1e1e28",
        },
        border: "rgba(255,255,255,0.07)",
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
        },
        text: {
          primary: "#e2e2ea",
          secondary: "#9090a8",
          muted: "#55556a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        page: "90rem",
        "page-narrow": "80rem",
        "page-content": "64rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-gradient":
          "linear-gradient(to right, #6366f1, #8b5cf6)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
