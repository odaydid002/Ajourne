/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins-Regular', 'sans-serif'],
        "Poppins-Light": ["Poppins-Light", "sans-serif"],
        "Poppins-Medium": ["Poppins-Medium", "sans-serif"],
        "Poppins-Regular": ["Poppins-Regular", "sans-serif"],
        "Poppins-Bold": ["Poppins-Bold", "sans-serif"],
        "Poppins-Black": ["Poppins-Black", "sans-serif"]
      },
      colors: {
        background: {
          DEFAULT: "#F4F4F4",
          dark: "#181818",
        },
        foreground: {
          DEFAULT: "#333333",
          dark: "#ffffff",
        },
        "container": {
          DEFAULT: "#FFFFFF",
          dark: "#121212"
        },
        "input": {
          DEFAULT: "#ffffff",
          dark: "#303030"
        },
        "primary": {
          100: '#FF5555',
          200: '#FF937E'
        },
        "secondary": {
          100: "#A3D78A",
          200: "#C1E59F",
          "trans": "rgba(163, 215, 138, 0.2)",
          "darker": "#7CB86B"
        },
        accent: "#F15758",
        black: {
          DEFAULT: "#000000",
          100: '#8C8E98',
          200: '#666876',
          300: "#191d31"
        },
        danger: "#F75555",
        inp: "rgba(80,80,80,0.15)"
      }
    },
  },
  plugins: [],
}