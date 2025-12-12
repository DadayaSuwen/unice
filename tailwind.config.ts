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
        // 淡金黄主题色系
        "primary-gold": "var(--primary-gold)",
        "primary-gold-hover": "var(--primary-gold-hover)",
        "primary-gold-light": "var(--primary-gold-light)",
        "primary-gold-dark": "var(--primary-gold-dark)",

        // 语义化颜色
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        foreground: "var(--foreground)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "border-color": "var(--border-color)",
        "border-light": "var(--border-light)",

        // 兼容旧版本
        "brand-primary": "var(--primary-gold)",
        "brand-secondary": "var(--text-secondary)",
        "bg-primary": "var(--background)",
        "bg-secondary": "var(--background-secondary)",
        "text-primary": "var(--foreground)",
      },
      backgroundImage: {
        "primary-gold-gradient": "var(--primary-gold-gradient)",
      },
      boxShadow: {
        gold: "var(--shadow-gold)",
        color: "var(--shadow-color)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeInUp: "fadeInUp 1s ease-out forwards",
        fadeInLeft: "fadeInLeft 1s ease-out forwards",
        fadeInRight: "fadeInRight 1s ease-out forwards",
        scaleIn: "scaleIn 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        fadeInRight: {
          from: {
            opacity: "0",
            transform: "translateX(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        scaleIn: {
          from: {
            opacity: "0",
            transform: "scale(0.9)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
