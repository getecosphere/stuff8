/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Onest', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        navy: {
          50: '#f2f6f4',
          100: '#e2ece7',
          200: '#c6d9d0',
          300: '#a0bfb3',
          400: '#6f9d8c',
          500: '#4d806d',
          600: '#3a6656',
          700: '#2f5345',
          800: '#27433a',
          900: '#1b3029',
          950: '#0f1e1a',
        },
        paper: {
          50: '#fffdf7',
          100: '#faf6ec',
          200: '#f3ecd9',
          300: '#eadfc2',
        },
        clay: {
          50: '#fdf3ee',
          100: '#fae4d8',
          200: '#f3c4ab',
          300: '#eb9e77',
          400: '#e07a4a',
          500: '#d65f2e',
          600: '#b84a22',
          700: '#983a1c',
          800: '#7a3018',
          900: '#642a16',
        },
      },
    },
  },
  plugins: [],
}
