import { useEffect } from "react";
import { create } from "zustand";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: getSystemTheme(),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));

/**Responsible for toggling 'dark' class on the html element based on theme store state*/
export const ThemeHandler = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <></>;
};

/**Returns the system theme preference at client side.
Because of this feature, we need to prevent Next.js hydration mismatch throughout the app components.
Since we don't know client's theme at SSR, theme based conditional rendering must be done with hooks at client side, and not hard coded in the JSX.
https://nextjs.org/docs/messages/react-hydration-error */
function getSystemTheme() {
  if (typeof window === "undefined") return "light"; // If window is undefined, we are on server side

  const systemIsDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return systemIsDark ? "dark" : "light";
}
