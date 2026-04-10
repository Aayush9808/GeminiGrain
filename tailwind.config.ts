import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rq: {
          bg:          '#F5F3EE',
          surface:     '#FFFFFF',
          surface2:    '#F9F7F3',
          border:      '#EDE8DE',
          'border-hi': '#DED6C7',
          amber:       '#F5A623',
          'amber-dim': '#D88906',
          green:       '#2DBD6E',
          'green-dim': '#209553',
          blue:        '#4A90D9',
          'blue-dim':  '#3673B2',
          text:        '#1A1A1A',
          muted:       '#6B6B6B',
          subtle:      '#8A8172',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans-body)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif-display)', 'Playfair Display', 'Lora', 'serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'spin-slow':     'spin 10s linear infinite',
        'glow-green':    'glowGreen 2s ease-in-out infinite alternate',
        'glow-orange':   'glowOrange 2s ease-in-out infinite alternate',
        'float':         'float 6s ease-in-out infinite',
        'slide-up':      'slideUp 0.4s ease-out',
        'fade-in':       'fadeIn 0.4s ease-out',
        'shimmer':       'shimmer 2s infinite',
        'bounce-subtle': 'bounceSub 2s ease-in-out infinite',
        'ping-slow':     'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        glowGreen: {
          from: { boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)' },
          to:   { boxShadow: '0 0 35px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)' },
        },
        glowOrange: {
          from: { boxShadow: '0 0 15px rgba(249, 115, 22, 0.1)' },
          to:   { boxShadow: '0 0 35px rgba(249, 115, 22, 0.3)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        bounceSub: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
