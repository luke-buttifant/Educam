module.exports = {
  mode: "jit",
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-illustration': "url('./images/loginIllustration.png')",
      },
      colors: {
        "white-smoke": "#F9FAF4",
        "deep-space-sparkle": "#4A6163",
        "sandy-brown": "#F9A66C",
        "pastel-orange": "#FFC94B",
        "light-coral": "#F17A7E",
        "primary": "#41416E",
        "secondary": "#8472FC",
        "dark-mode": "#26252A",
        "dark-mode-secondary": "#161616",

        gray: {
          900: "#202225",
          800: "#2f3136",
          700: "#36393f",
          600: "#4f545c",
          400: "#d4d7dc",
          300: "#e3e5e8",
          200: "#ebedef",
          100: "#f2f3f5",
        }
      },
    },
    fontFamily: {
      Sora: ["Sora", "sans-serif"],
    },
    container: {
      center: true,
      padding: "1rem",
    },

  },
  plugins: [],
}