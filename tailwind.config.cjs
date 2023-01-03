/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      keyframes: {
        'moving-line': {
          from: {
              width: '0px', 
          },
          to: { 
              width: 'auto', 
          },
      },'md-moving-line': {
        from: {
            width: '0px', 
        },
        to: { 
            width: '25rem', 
        },
    },  'back-line': {
        to: {
            width: '0px', 
        },
        
    },
    },
    animation: {
      'moving-line': 'moving-line .8s  forwards',
      'md-moving-line': 'md-moving-line .8s  forwards',
      'back-line': 'back-line .8s  forwards',
    },


    },
  },
  plugins: [],
}
