import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#000000',
          red: '#f7768e',
          green: '#9ece6a',
          yellow: '#e0af68',
          blue: '#7aa2f7',
          magenta: '#bb9af7',
          cyan: '#7dcfff',
          white: '#FFFFFF',
          gray: '#414868',
          bg: '#000000',
          fg: '#c0caf5',
        },
        celeste: {
          DEFAULT: '#B2FFFF',
          50: '#f0ffff',
          100: '#e0ffff',
          200: '#c2ffff',
          300: '#a3ffff',
          400: '#85ffff',
          500: '#B2FFFF',
          600: '#00e5e5',
          700: '#00b2b2',
          800: '#008080',
          900: '#004d4d',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#B2FFFF',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        paper: {
          white: '#FFFFFF',
          black: '#000000',
        }
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-light': '4px 4px 0px 0px rgba(255,255,255,1)',
        'brutal-celeste': '4px 4px 0px 0px #B2FFFF',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
