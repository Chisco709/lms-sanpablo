/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)"
          },
        },
        "fade-in-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-20px)"
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)"
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: 0,
            transform: "translateX(-30px)"
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)"
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: 0,
            transform: "translateX(30px)"
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)"
          },
        },
        "scale-in": {
          "0%": {
            opacity: 0,
            transform: "scale(0.8)"
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)"
          },
        },
        "blur-in": {
          "0%": {
            opacity: 0,
            filter: "blur(10px)"
          },
          "100%": {
            opacity: 1,
            filter: "blur(0px)"
          },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
            transform: "scale(1)"
          },
          "50%": {
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.4)",
            transform: "scale(1.02)"
          },
        },
        "pulse-glow-yellow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(250, 204, 21, 0.2)",
            transform: "scale(1)"
          },
          "50%": {
            boxShadow: "0 0 40px rgba(250, 204, 21, 0.4)",
            transform: "scale(1.02)"
          },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)"
          },
          "50%": {
            transform: "translateY(-4px)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)"
          },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "slide-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(100%)"
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)"
          },
        },
        "slide-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-100%)"
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)"
          },
        },
        "zoom-in": {
          "0%": {
            opacity: 0,
            transform: "scale(0.5)"
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)"
          },
        },
        "flip": {
          "0%": { transform: "rotateY(0)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "fade-in-left": "fade-in-left 0.6s ease-out",
        "fade-in-right": "fade-in-right 0.6s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "blur-in": "blur-in 0.8s ease-out",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-glow-yellow": "pulse-glow-yellow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "gradient": "gradient 3s ease infinite",
        "bounce-gentle": "bounce-gentle 2s infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "zoom-in": "zoom-in 0.5s ease-out",
        "flip": "flip 0.6s ease-in-out",
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}