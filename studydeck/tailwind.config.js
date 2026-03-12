/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0f0f0f', card: '#181818', elevated: '#222222', hover: '#2a2a2a' },
        border: { DEFAULT: 'rgba(255,255,255,0.07)', light: 'rgba(255,255,255,0.12)' },
        text: { primary: '#ffffff', secondary: '#a1a1aa', muted: '#71717a' },
        accent: { DEFAULT: '#6366f1', hover: '#818cf8', muted: '#4f46e5', glow: 'rgba(99,102,241,0.15)' },
        success: { DEFAULT: '#22c55e', muted: '#166534' },
        warning: { DEFAULT: '#f59e0b', muted: '#92400e' },
        danger: { DEFAULT: '#ef4444', muted: '#991b1b' },
        subject: {
          red: '#ef4444', orange: '#f97316', amber: '#f59e0b', lime: '#84cc16',
          green: '#22c55e', teal: '#14b8a6', cyan: '#06b6d4', blue: '#3b82f6',
          indigo: '#6366f1', purple: '#a855f7', pink: '#ec4899', rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem', '3xl': '1.25rem' },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
