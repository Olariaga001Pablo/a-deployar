import type { Config } from "tailwindcss";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Agrega tus colores personalizados aquí
        customYellow: "#f4c790",
        customDarkGray: "#1d1313",
        customFarmColor: "#F4EB9E",
        customQuarryColor: "#7EBEB2",
        customSawmillColor: "#529A47",
        customBarracksColor: "#087EFF",
        customMineColor: "#DA901C",
        customWhiteColor: "#F6E7D3",
        customRedColor: "#db1414",
        customGrayColor: "#262525"
      },
      borderWidth: {
        '12': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
