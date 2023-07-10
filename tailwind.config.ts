import { shadcnPlugin } from "./src/styles/shadcn-plugin";
import { type Config } from "tailwindcss";

const headerSize = "6rem";
const footerSize = "2.5rem";

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      height: {
        page: `calc(100vh - ${footerSize})`,
        header: headerSize,
        footer: footerSize,
      },
      padding: {
        header: headerSize,
      },
    },
  },

  plugins: [
    shadcnPlugin,
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config;
