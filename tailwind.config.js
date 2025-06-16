/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ["./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo 600
        secondary: "#F59E0B", // Amber 500
        background: "#F3F4F6", // Gray 200
        text: "#111827", // Gray 900
        light: {
          100: "D6C6FF",
          200: "#E0D4FF",
          300: "#E8DFFF",
        },
        dark: {
          100: "#1E1E2F", 
          200: "#27293D", 
          300: "#32344A", 
        },
        accent: '#AB8BFF'
      },
      
    },
  },
  plugins: [],
}

