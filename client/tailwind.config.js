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
        "primary": "#41416E",
        "secondary": "#8472FC",
        "dark-mode": "#26252A",
        "dark-mode-secondary": "#161616",
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