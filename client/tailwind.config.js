/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy Blue - Dominant dark blue/navy for headers and navigation
        primary: {
          50: '#e6e9f0',
          100: '#ccd3e1',
          200: '#99a7c3',
          300: '#667ba5',
          400: '#334f87',
          500: '#0A1F44', // Main navy blue
          600: '#081932',
          700: '#061328',
          800: '#040d1e',
          900: '#020714',
        },
        // Accent Orange - For buttons and call-to-action
        accent: {
          50: '#fef3e8',
          100: '#fde7d1',
          200: '#fbcfa3',
          300: '#f9b775',
          400: '#f79f47',
          500: '#F58C38', // Main orange accent
          600: '#c4702d',
          700: '#935422',
          800: '#623816',
          900: '#311c0b',
        },
        // Secondary Green - For success states and nature themes
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Background colors
        bg: {
          white: '#FFFFFF',
          light: '#F5F7FA',
          gray: '#F9FAFB',
        },
        // Text colors
        text: {
          dark: '#1F2937',
          medium: '#4B5563',
          light: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
  },
  plugins: [],
}


