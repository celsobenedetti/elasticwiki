import { shadcnPlugin } from "./src/styles/shadcn-plugin";
import { type Config } from "tailwindcss";

const header = { header: "6rem" };

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      height: header,
      padding: header,
    },
  },

  plugins: [
    shadcnPlugin,
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config;
