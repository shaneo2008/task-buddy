/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FFFDF8',
          100: '#F6E5CC',
          200: '#EDD9B8',
          300: '#E0C9A5',
          400: '#D4BFA3',
          bg:  '#F6E5CC',
        },
        cocoa: {
          50:  '#8C7461',
          100: '#6B5647',
          200: '#4A3A2E',
          300: '#24130D',
          text: '#24130D',
        },
        peach: {
          100: '#F0A275',
          200: '#E8956A',
          300: '#D98255',
          accent: '#F0A275',
        },
        olive: {
          50:  '#B8C5A8',
          100: '#A8B89A',
          200: '#8FA67D',
          300: '#7A9268',
          accent: '#A8B89A',
        },
        danger: '#E88B8B',
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'DM Sans', 'system-ui', 'serif'],
        body:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(180deg, #F6E5CC 0%, #EDD9B8 50%, #E0C9A5 100%)',
        'cream-glow':     'radial-gradient(ellipse at 50% 0%, rgba(240, 162, 117, 0.12) 0%, rgba(240, 162, 117, 0.04) 35%, transparent 72%)',
      },
    },
  },
  plugins: [],
};
