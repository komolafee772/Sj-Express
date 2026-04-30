/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A4D8F",
        secondary: "#0B3D91",
        accent: "#40D0E0",
        'brand-blue': {
          50: '#f0f4f9',
          100: '#e1e9f3',
          200: '#c2d3e7',
          300: '#a3bddb',
          400: '#6691c3',
          500: '#1A4D8F',
          600: '#174581',
          700: '#133a6c',
          800: '#0f2e56',
          900: '#0c2646',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
