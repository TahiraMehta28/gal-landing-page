/** @type {import('tailwindCSS').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF5',
        paper: '#FFFFFF',
        ink: '#1C1A15',
        spark: '#C9A227',
        gold: '#C9A227',
        moss: '#2F4B3C',
        denim: '#28365E',
        sand: '#E4DECB',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, #DFD8C4 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '22px 22px',
      },
    },
  },
  plugins: [],
}
