module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "dark-primary": "var(--dark-primary)",
        "dark-background": "var(--dark-background)",
        "light-background": "var(--light-background)",
        container: "var(--container)",
      },
      fontFamily: {
        manga: ["Staatliches", "cursive"],
        main: ["Roboto", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
