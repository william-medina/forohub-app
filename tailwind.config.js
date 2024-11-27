/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['"Inter"', 'sans-serif'],
      },
      screens: {
        'sm-500': '500px',
        'sm-420': '420px', 
        'sm-380': '380px', 
        'xs': '320px', 
      },
    },
  },
  plugins: [],
}

