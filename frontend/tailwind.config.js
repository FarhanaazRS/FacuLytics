/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f9fafb',
          text: '#000000',
          'text-secondary': '#6b7280',
        },
        // Dark mode colors
        dark: {
          bg: '#000000',
          'bg-secondary': '#111827',
          text: '#ffffff',
          'text-secondary': '#d1d5db',
        },
      },
    },
  },
  plugins: [],
};