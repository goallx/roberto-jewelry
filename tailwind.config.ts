import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        "extra-wide": "0.2em",
        "ultra-wide": "0.5em",
      },
      fontFamily: {
        amandine: ['"Amandine"', "sans-serif"],
        redHatText: ['"Red Hat Text"', "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-fast": "spin 0.5s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
