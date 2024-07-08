/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-theme-100": "#EEF5FF",
        "app-theme-200": "#B4D4FF",
        "app-theme-300": "#86B6F6",
        "app-theme-400": "#176B87",
        "type-todo": "#FFD700",
        "type-progress": "#D6BAE9",
        "type-done": "#90EE90",
      },
    },
  },
  plugins: [],
};
