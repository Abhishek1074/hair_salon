/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { ink: "#130e0c", pearl: "#eae5dc", clay: "#c17a54", surface: "#1d1917" }, fontFamily: { display: ["Bebas Neue", "sans-serif"], sans: ["Inter", "sans-serif"] } } },
  plugins: []
};
