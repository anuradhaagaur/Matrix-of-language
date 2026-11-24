/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0610',
          bgSecondary: '#100916',
          card: '#140D1B',
          elevated: '#1B1023',
          input: '#100B16',
          pink: '#FF3CAC',
          magenta: '#F000FF',
          purple: '#B44AFF',
          violet: '#7C3AED',
          primary: '#FFF1FA',
          secondary: '#C2AFC3',
          muted: '#A58BA0',
          disabled: '#67596C',
          border: 'rgba(255, 60, 172, 0.16)',
          borderHover: 'rgba(255, 60, 172, 0.55)',
          borderActive: 'rgba(240, 0, 255, 0.75)',
        },
        // Backwards compatibility mappings for matrix namespace
        matrix: {
          950: '#0B0610',
          900: '#100916',
          850: '#140D1B',
          elevated: '#1B1023',
          input: '#100B16',
          neon: '#FF3CAC', // Neon pink
          secondary: '#F000FF', // Electric magenta
          purple: '#B44AFF', // Purple
          muted: '#A58BA0', // Muted text
          violet: '#7C3AED', // Deep violet
          primary: '#FFF1FA', // Off-white primary text
          textMuted: '#C2AFC3', // Secondary text
          border: 'rgba(255, 60, 172, 0.16)',
          borderGlow: 'rgba(255, 60, 172, 0.55)',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(255, 60, 172, 0.25)',
        'neon-md': '0 0 20px rgba(255, 60, 172, 0.35)',
        'neon-lg': '0 0 40px rgba(240, 0, 255, 0.40)',
        'neon-inset': 'inset 0 0 15px rgba(255, 60, 172, 0.15)',
        'purple-sm': '0 0 10px rgba(180, 74, 255, 0.20)',
        'purple-md': '0 0 20px rgba(180, 74, 255, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'radar': 'radar 3s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radar: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
