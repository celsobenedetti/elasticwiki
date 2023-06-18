import { useRef, useEffect } from "react";
import { create } from "zustand";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));

export const ThemeProvider = () => {
  const { theme } = useThemeStore();
  const htmlRef = useRef<HTMLHtmlElement | null>(null);

  useEffect(() => {
    htmlRef.current = document.querySelector("html");
  }, []);

  useEffect(() => {
    htmlRef.current?.classList.toggle("dark");
  }, [theme]);

  return <></>;
};
