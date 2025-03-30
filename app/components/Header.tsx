"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Gemini Chat AI</h1>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}