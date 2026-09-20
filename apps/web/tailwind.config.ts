import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF8F2',
          200: '#F5EFE6', // Main warm cream background
          300: '#ECE3D4', // Border / Divider cream
          400: '#E0D4C0',
          500: '#D2C2A8',
          600: '#B8A487',
          700: '#9B8566',
          800: '#7A664D',
          900: '#544431',
        },
        navy: {
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C7DAFE',
          300: '#A4C3FE',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E3A8A', // Outgoing message navy blue
          800: '#162E4D', // Card / panel navy
          900: '#0F2744', // Darker navy rail
          950: '#0A192F', // Deepest luxury navy blue
        },
        wa: {
          green: '#1D4ED8', // Navy royal accent
          greenDark: '#1E3A8A',
          greenLight: '#3B82F6',
          greenMsg: '#1E3A8A', // Outgoing message bubble (Navy)
          greenMsgHover: '#172E6E',
          blueTick: '#38BDF8', // Cyan blue tick
          bgDark: '#F5EFE6', // Chat background (Cream)
          panelDark: '#FAF8F2', // Left chat list & panels (Light Cream)
          headerDark: '#ECE3D4', // Top header / composer panel
          hoverDark: '#EBE2D2', // Item hover cream
          activeDark: '#DFD4C0', // Item active / borders
          borderDark: '#E5DCCE', // Subtle divider borders
          inputDark: '#FFFFFF', // Search / text inputs
          textPrimary: '#0F172A', // Main dark navy text
          textSecondary: '#64748B', // Subtitles & timestamps
          textMuted: '#94A3B8', // Muted hints
          unreadBadge: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.15s ease-in-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
