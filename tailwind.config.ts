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
        kemix: {
          navy: "#0B2D5B",
          dark: "#0F172A",
          blue: "#2563EB",
          cyan: "#60A5FA",
          sky: "#38BDF8",
          light: "#F0F7FF",
          border: "#E2E8F0",
          muted: "#64748B",
          card: "#FFFFFF",
          accent: "#1D4ED8",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        heading: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'brand': '0 10px 30px -5px rgba(11, 45, 91, 0.1), 0 4px 6px -2px rgba(11, 45, 91, 0.05)',
        'brand-lg': '0 20px 40px -10px rgba(11, 45, 91, 0.15), 0 8px 10px -4px rgba(11, 45, 91, 0.08)',
        'glow': '0 0 25px rgba(37, 99, 235, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12) 0%, rgba(11, 45, 91, 0.03) 60%, transparent 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
