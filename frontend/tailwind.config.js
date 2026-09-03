/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#44474d",
        "primary": "#000412",
        "primary-container": "#0f1e36",
        "on-primary-container": "#7886a3",
        "secondary": "#4e5e7f",
        "secondary-container": "#c7d7fe",
        "on-secondary-container": "#4d5d7e",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "outline": "#75777e",
        "outline-variant": "#c5c6ce"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
        "sidebar-width": "17.5rem"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
