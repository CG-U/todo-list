/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeOutRight: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": {
            opacity: 0,
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        fadeOutRight: "fadeOutRight 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "halloween",
      "dark",
      "nord",
      {
        night: {
          ...require("daisyui/src/theming/themes")["night"],
          ".input-primary": {
            text: "#fff",
          },
        },
      },
    ],
  },
};
