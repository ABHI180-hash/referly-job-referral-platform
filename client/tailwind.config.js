/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F9FAFB',
          subtle: '#F4F5F7',
          dark: '#090A0F',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          muted: '#F1F5F9',
          border: 'rgba(15, 23, 42, 0.08)',
        },
        ink: {
          DEFAULT: '#090A0F',
          muted: '#525866',
          subtle: '#868C98',
          inverted: '#FFFFFF',
        },
        cobalt: {
          50: '#F0F6FE',
          100: '#E0EDFE',
          200: '#BAE0FD',
          300: '#7DC4FB',
          400: '#38A4F7',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        brand: {
          50: '#F0F6FE',
          100: '#E0EDFE',
          200: '#BAE0FD',
          300: '#7DC4FB',
          400: '#38A4F7',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.75rem, 5vw, 3.75rem)', { lineHeight: '1.14', letterSpacing: '-0.02em', fontWeight: '700' }],
        'section-heading': ['clamp(2.125rem, 3.5vw, 2.625rem)', { lineHeight: '1.2', letterSpacing: '-0.018em', fontWeight: '700' }],
        'page-heading': ['clamp(1.75rem, 2.8vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'card-heading': ['clamp(1.2rem, 1.8vw, 1.375rem)', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'subheading': ['clamp(1.0625rem, 1.4vw, 1.25rem)', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        normal: '0',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 8px 20px -4px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'dropdown': '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 10px -4px rgba(15, 23, 42, 0.04)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
        'float': '0 20px 35px -10px rgba(15, 23, 42, 0.08)',
      },
      maxWidth: {
        'content': '1280px',
      }
    },
  },
  plugins: [],
}
