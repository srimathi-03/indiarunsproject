module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7D45E0',
          cyan: '#00D4FF',
          dark: '#0F0F1A',
          card: '#1A1A2E',
          border: '#2A2A45',
          success: '#00E59B',
          warning: '#FFB800',
          danger: '#FF4D6D',
          muted: '#8B8BA7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        orbit: 'orbit 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #7D45E0' },
          '50%': { boxShadow: '0 0 30px #7D45E0, 0 0 60px #00D4FF' }
        }
      }
    }
  },
  plugins: []
}
