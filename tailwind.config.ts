import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Legacy support
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Primary Brand - note Teal Green (replacing purple)
        primary: {
          50: '#e8f9f6',   // Very light teal for backgrounds
          100: '#c7f2eb',  // Light teal for hover states
          200: '#9fe9de',  // Lighter active states
          300: '#6dd9ca',  // Medium-light teal
          400: '#41c9b4',  // note signature color
          500: '#2ea690',  // Darker variant for hover
          600: '#258975',  // Deep teal for pressed states
          700: '#1e7b65',  // note success green
          800: '#176553',  // Very dark teal
          900: '#114f42',  // Deepest teal for text
        },

        // Accent - Warm Coral (complementary to teal)
        accent: {
          50: '#fff5f5',   // Very light coral
          100: '#ffe3e3',  // Light coral
          200: '#ffc9c9',  // Lighter coral
          300: '#ffa8a8',  // Medium coral
          400: '#ff8787',  // Bright coral
          500: '#ff6b6b',  // Vibrant coral (primary accent)
          600: '#fa5252',  // Deep coral
          700: '#f03e3e',  // Darker coral
          800: '#e03131',  // Very dark coral
          900: '#c92a2a',  // Deepest coral
        },

        // Success - Using note's success color
        success: {
          50: '#e8f9f6',
          100: '#c7f2eb',
          200: '#9fe9de',
          300: '#6dd9ca',
          400: '#41c9b4',
          500: '#2ea690',
          600: '#258975',
          700: '#1e7b65',  // note official success
          800: '#176553',
          900: '#114f42',
        },

        // Warning/Caution - Using note's caution color
        warning: {
          50: '#fff9e6',
          100: '#fff0c2',
          200: '#ffe69a',
          300: '#ffdb70',
          400: '#ffd04d',
          500: '#f5c02b',
          600: '#e0ad1f',
          700: '#c99a16',
          800: '#ac7a2d',  // note official caution
          900: '#8f6424',
        },

        // Danger - Using note's danger color
        danger: {
          50: '#ffe6e6',
          100: '#ffc2c2',
          200: '#ff9a9a',
          300: '#ff7070',
          400: '#ff4d4d',
          500: '#e63939',
          600: '#cc2e2e',
          700: '#b22323',  // note official danger
          800: '#991d1d',
          900: '#801818',
        },

        // Like/Engagement - Using note's like color
        like: {
          50: '#ffe9f0',
          100: '#ffc9dc',
          200: '#ffa3c5',
          300: '#ff7dad',
          400: '#f55d92',
          500: '#e9447a',
          600: '#d13e5c',  // note official like/engagement
          700: '#b8354f',
          800: '#9e2d42',
          900: '#852537',
        },

        // Neutral - note's text and surface colors
        neutral: {
          50: '#f5f8fa',   // note surface quaternary
          100: '#e8eef2',  // Light gray
          200: '#d1dce3',  // Border light
          300: '#b3c5d1',  // Border medium
          400: '#8fa5b5',  // Text tertiary
          500: '#6b8599',  // Text secondary
          600: '#4d6679',  // Text clickable
          700: '#334b5f',  // Text primary
          800: '#1a2f3f',  // Dark text
          900: '#08131a',  // note primary dark
        },

        // Dark mode backgrounds (using note's dark theme)
        dark: {
          bg: {
            primary: '#08131a',    // note primary dark
            secondary: '#0f1c24',  // Slightly lighter
            tertiary: '#162730',   // Card backgrounds
            quaternary: '#1d323d', // Elevated surfaces
          },
          border: '#2a424f',       // Dark borders
          text: {
            primary: 'rgba(255, 255, 255, 0.90)',   // 90% white
            secondary: 'rgba(255, 255, 255, 0.70)', // 70% white
            tertiary: 'rgba(255, 255, 255, 0.50)',  // 50% white
          }
        },
      },

      backgroundImage: {
        // Updated gradients using note brand colors
        'gradient-primary': 'linear-gradient(135deg, #41c9b4 0%, #2ea690 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff6b6b 0%, #f03e3e 100%)',
        'gradient-success': 'linear-gradient(135deg, #2ea690 0%, #1e7b65 100%)',
        'gradient-warm': 'linear-gradient(135deg, #ff8787 0%, #fa5252 100%)',
        'gradient-hero': 'linear-gradient(135deg, #41c9b4 0%, #258975 50%, #1e7b65 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #e8f9f6 0%, #c7f2eb 100%)',

        // Glass effects with note colors
        'gradient-glass': 'linear-gradient(135deg, rgba(65, 201, 180, 0.1) 0%, rgba(46, 166, 144, 0.05) 100%)',
        'gradient-glass-warm': 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(240, 62, 62, 0.05) 100%)',

        // Radial and mesh gradients
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(65, 201, 180, 0.4) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(255, 107, 107, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(46, 166, 144, 0.3) 0px, transparent 50%)
        `,
        'gradient-mesh-dark': `
          radial-gradient(at 40% 20%, rgba(65, 201, 180, 0.2) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(255, 107, 107, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(46, 166, 144, 0.15) 0px, transparent 50%)
        `,
      },

      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-subtle': 'pulseSutble 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        pulseSutble: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(65, 201, 180, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(65, 201, 180, 0.8)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'primary': '0 10px 40px -12px rgba(65, 201, 180, 0.4)',
        'primary-lg': '0 20px 60px -15px rgba(65, 201, 180, 0.5)',
        'accent': '0 10px 40px -12px rgba(255, 107, 107, 0.4)',
        'accent-lg': '0 20px 60px -15px rgba(255, 107, 107, 0.5)',
        'success': '0 10px 40px -12px rgba(46, 166, 144, 0.4)',
        'soft': '0 2px 8px rgba(8, 19, 26, 0.08)',
        'soft-lg': '0 4px 16px rgba(8, 19, 26, 0.12)',
      },

      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
