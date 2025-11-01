export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Eye-catching Neon Interface Color Palette
        neon: {
          background: '#0a0a0f',      // Deep dark blue-black
          primary: '#00d4ff',         // Bright cyan blue
          secondary: '#ff0080',       // Hot pink
          highlight: '#ffd700',       // Gold
          accent: '#7c3aed',         // Purple
          text: '#f8fafc',           // Pure white
          // Additional vibrant shades
          'bg-light': '#1a1a2e',     // Darker background variant
          'primary-light': '#33dfff', // Lighter cyan
          'primary-dark': '#0099cc',  // Darker cyan
          'secondary-light': '#ff3399', // Lighter pink
          'secondary-dark': '#cc0066',  // Darker pink
          'highlight-light': '#ffed4e', // Lighter gold
          'highlight-dark': '#b8860b',  // Darker gold
          'accent-light': '#8b5cf6',   // Lighter purple
          'accent-dark': '#5b21b6',    // Darker purple
          'success': '#10b981',       // Emerald green
          'warning': '#f59e0b',       // Amber
          'danger': '#ef4444',        // Red
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.5)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
