import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f8f5',
          100: '#e5efe9',
          200: '#c7ded2',
          300: '#9ec4b2',
          400: '#5c9a7c',
          500: '#2a6e4e',
          600: '#235c41',
          700: '#1d4a35',
          800: '#173b2a',
          900: '#122e21',
          950: '#081710',
        },
        navy: {
          50: '#fcfbf9',
          100: '#f7f6f2',
          200: '#e8e6e1',
          300: '#d5d2ca',
          400: '#a3a097',
          500: '#737067',
          600: '#54524b',
          700: '#383632',
          800: '#262522',
          900: '#1a1a18',
          950: '#111110',
        },
        accent: {
          tan: '#7c6a4f',
          gold: '#c29b38',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
