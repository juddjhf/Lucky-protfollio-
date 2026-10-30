/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#070b14", panel: "#101827", cyan: "#56e2e8", blue: "#6286ff" },
      fontFamily: { display: ["Space Grotesk", "sans-serif"], sans: ["DM Sans", "sans-serif"] }
    }
  },
  plugins: []
};
