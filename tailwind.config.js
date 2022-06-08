module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "5rem",
        xl: "6rem",
        "2xl": "7rem",
      },
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
