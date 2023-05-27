/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    debugScreens: {
      position: ['top', 'left']
    },
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1100px',
    },
    extend: {
      fontFamily: {
        "pt": ['PT Sans, sans-serif'],
        "black": ['Palanquin Dark, sans-serif'],
      },
      colors:{
      '202124':'#202124',
      'eeedfd': '#eeedfd',
      'e15146':'#BF4565',
      'f07167':'#BF4565',
      'ffbeb9':'#E63769',
      'e5e5e5': '#e5e5e5',
      '003049': '#003049',
      '343a40':'#343a40',
      'f5f3f4':'#f5f3f4'
      }
    },
  },
  plugins: [
  ],
}
