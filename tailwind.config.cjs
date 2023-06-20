module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      colors: {
        'magnesium': '#B3B3B3',
        'astronaut': '#3D5277',
        'charcoal': '#404040',
        'mikado-yellow': '#FFC107',
        'bright-sun': '#FFD038',
        'big-stone': '#333E48',
        'french-blue': '#0067B9',
        'malibu': '#7CC1F4',
        'iron': '#D8D9D8',
      }
    },
  },
  prefix: '',
  plugins: [],
}
