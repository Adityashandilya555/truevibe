/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        emotion: {
          joy: '#FFD700',        // Gold
          trust: '#4169E1',      // Royal Blue
          fear: '#800080',       // Purple
          surprise: '#FFA500',   // Orange
          sadness: '#0000FF',    // Blue
          disgust: '#008000',    // Green
          anger: '#FF0000',      // Red
          anticipation: '#FFFF00', // Yellow
          neutral: '#A9A9A9'     // Dark Gray (fallback)
        }
      },
      borderColor: {
        emotion: {
          joy: '#FFD700',
          trust: '#4169E1',
          fear: '#800080',
          surprise: '#FFA500',
          sadness: '#0000FF',
          disgust: '#008000',
          anger: '#FF0000',
          anticipation: '#FFFF00',
          neutral: '#A9A9A9'
        }
      }
    },
  },
  plugins: [],
}
