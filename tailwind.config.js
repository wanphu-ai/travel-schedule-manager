/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Analogous Color Palette (Phối màu Tương đồng: Teal -> Emerald -> Cyan -> Sky)
        analogous: {
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            900: '#134e4a',
          },
          emerald: {
            500: '#10b981',
            600: '#059669',
          },
          cyan: {
            500: '#06b6d4',
            600: '#0891b2',
          },
          sky: {
            500: '#0ea5e9',
            600: '#0284c7',
          }
        }
      }
    },
  },
  plugins: [],
}
