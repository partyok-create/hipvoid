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
        'hv-cyan':    '#2DE1FF',
        'hv-yellow':  '#F8E71C',
        'hv-muted':   '#9AA0B2',
        'hv-border':  '#161922',
        'hv-surface': '#0E1016',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        orb: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '0.9', transform: 'scale(1.02)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(45,225,255,0.3), inset 0 0 40px rgba(0,0,0,0.9)' },
          '50%':      { boxShadow: '0 0 80px rgba(45,225,255,0.6), inset 0 0 60px rgba(0,0,0,0.8)' },
        },
      },
      animation: {
        'orb':        'orb 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
