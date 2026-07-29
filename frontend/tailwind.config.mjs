/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9fe',
          300: '#9cbafd',
          400: '#6892fa',
          500: '#3b66f5',
          600: '#2547eb',
          700: '#1d35d8',
          800: '#1e2cb0',
          900: '#1e296b',
          950: '#0f1744',
        },
        navy: {
          50: '#f4f6f8',
          100: '#e5e9f0',
          200: '#cdd5e1',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        }
      }
    },
  },
  plugins: [],
}

