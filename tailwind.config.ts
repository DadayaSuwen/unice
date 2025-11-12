import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6366f1',
        'brand-secondary': '#8b5cf6',
        'brand-accent': '#ec4899',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f5f5f7',
        'text-primary': '#1d1d1f',
        'text-secondary': '#86868b',
      },
      fontFamily: {
        'sans': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 1s ease-out forwards',
        'fadeInLeft': 'fadeInLeft 1s ease-out forwards',
        'fadeInRight': 'fadeInRight 1s ease-out forwards',
        'scaleIn': 'scaleIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;