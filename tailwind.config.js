/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#4299e1',
        secondary: '#718096',
        success: '#38a169',
        danger: '#e53e3e',
      },
      boxShadow: {
        'custom': '0 2px 4px rgba(0,0,0,0.1)',
        'custom-hover': '0 4px 6px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
