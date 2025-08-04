import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#F6F5F2",
        light: "#F6F5F2",
        dark: "#222831",
      },
      secondary: {
        DEFAULT: "#F0EBE3",
        light: "#F0EBE3",
        dark: "#393E46",
      },
      primarytext: {
        DEFAULT: "#000000",
        light: "#000000",
        dark: "#ffffff",
      },
      secondarytext: {
        DEFAULT: "#181C14",
        light: "#181C14",
        dark: "#ECDFCC",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1030px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  plugins: [],
});