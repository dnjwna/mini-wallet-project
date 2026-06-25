/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#070809',
        },
        surface: {
          DEFAULT: '#101214',
          raised: '#15181B',
        },
        line: 'rgba(255,255,255,0.07)',
        accent: {
          emerald: '#34D399',
          danger: '#F87171',
        },
        ink: {
          primary: '#F2F3F5',
          muted: '#8B95A7',
          faint: '#5B6478',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        serif: ['"Newsreader"', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};