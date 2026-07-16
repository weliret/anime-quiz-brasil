/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        neon: {
          blue: '#00f0ff',
          purple: '#b026ff',
          pink: '#ff0080',
          green: '#39ff14',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00f0ff 0%, #b026ff 50%, #ff0080 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(176, 38, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
