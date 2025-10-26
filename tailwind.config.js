/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1ABC9C',
          dark: '#16A085',
          light: '#48C9B0',
        },
        success: '#1ABC9C',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        background: {
          light: '#F5F7FA',
          DEFAULT: '#FFFFFF',
          dark: '#E5E7EB',
        },
        risk: {
          low: '#1ABC9C',
          medium: '#F39C12',
          high: '#E74C3C',
        },
      },
    },
  },
  plugins: [],
}
