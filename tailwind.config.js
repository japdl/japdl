module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#ff0000",
        "dark-primary": "#880921",
        "dark-grey": "#111827",
      },
      fontFamily: {
        manga: ["Staatliches", "cursive"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
