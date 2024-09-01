/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#BFA01D",
        titleFontColor: "#7E6E3C",
        secondaryFontColor: "#696E7C",
        secFont: "#9A9EA6",
        primary02: "#F3F0E2",
        bodyTextColor: "#344054",
        placeholder: "#A1ADC1",
        sec: "#EAD96F",
        white: "#FFFFFF",
        gray: "#D9D9D9",
        hyperLinkColor: "#599CFF",
        bgColor: "#F8F8F5",
        btnColor: "#EBECEE",
        orange: "#D95723",
        red: "#A22320",
        green: "#23A450",
        yellow: "#FCCC3D",
        hover: "#F9F2C4",
        "black-1": "#333333",
        "white-2": "#f5f6f8",
        "red-1": "#A70000",
        "red-2": "#F6E5E5",
        "white-1": "#EAECEE",
        disable: "#D6D9DD",
        "green-1": "#00B633",
        "blue-1": "#073763CC",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      boxShadow: {
        "table-shadow": "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
        "input-shadow": " 0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
        "card-shadow": "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
      },
    },
  },
  plugins: [],
};
