/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-dark": "var(--primary-dark)",
        secondary: "#727CF5",
        success: "#0ACF97",
        warning: "#FFA808",
        danger: "var(--danger)",
        "danger-dark": "var(--danger-dark)",
      },
      minHeight: {
        screen: "100vh",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
  darkMode: "class",
};
