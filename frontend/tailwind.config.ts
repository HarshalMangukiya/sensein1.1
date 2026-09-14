import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          light: '#6B253D',
          DEFAULT: '#4A1528',
          dark: '#38101E',
          deep: '#260812',
        },
        alabaster: {
          light: '#FDFBF9',
          DEFAULT: '#FAF7F5',
          warm: '#F5EFEB',
          dark: '#EAE5E0',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          muted: '#6E6E6E',
          subtle: '#8E8E8E',
        },
        border: {
          DEFAULT: '#EAE5E0',
          subtle: '#F0ECE8',
        },
        emerald: {
          DEFAULT: '#0F766E',
          accent: '#059669',
          light: '#E6F4F1',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#E5CCA0',
          rich: '#B38B3A',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -10px rgba(74, 21, 40, 0.08)',
        'luxury-hover': '0 20px 40px -15px rgba(74, 21, 40, 0.15)',
        drawer: '-10px 0 35px rgba(0, 0, 0, 0.12)',
      },
      letterSpacing: {
        widest: '0.25em',
        editorial: '0.15em',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tickerRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        ticker: 'ticker 25s linear infinite',
        'ticker-right': 'tickerRight 28s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
