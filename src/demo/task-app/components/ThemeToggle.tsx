import { useEffect } from "../../../miniact-dom.js";
import * as React from "../../../miniact.js";
import { ThemeSettings } from "../../types.js";

function Palette() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-palette-icon lucide-palette"
    >
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function Sun() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-sun-icon lucide-sun"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function Moon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-moon-icon lucide-moon"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

interface ThemeToggleProps {
  theme: ThemeSettings;
  onThemeChange: (theme: ThemeSettings) => void;
}

const accentColors = [
  { name: "purple", value: "#9E7FFF" },
  { name: "blue", value: "#38bdf8" },
  { name: "green", value: "#10b981" },
  { name: "pink", value: "#f472b6" },
  { name: "orange", value: "#f59e0b" }
];

const ThemeToggle = ({ theme, onThemeChange }) => {
  // Apply theme mode to document
  useEffect(() => {
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply accent color as CSS variable
    document.documentElement.style.setProperty("--accent-color", theme.accentColor);

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px"
    };
    document.documentElement.style.fontSize = fontSizeMap[theme.fontSize];
  }, [theme]);

  const toggleMode = () => {
    onThemeChange({
      ...theme,
      mode: theme.mode === "light" ? "dark" : "light"
    });
  };

  const changeAccentColor = (color: string) => {
    onThemeChange({
      ...theme,
      accentColor: color
    });
  };

  const changeFontSize = (size: ThemeSettings["fontSize"]) => {
    onThemeChange({
      ...theme,
      fontSize: size
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative group">
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Theme settings"
        >
          <Palette size={18} />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg p-3 hidden group-hover:block z-10">
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Accent Color</p>
            <div className="flex space-x-2">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => changeAccentColor(color.value)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    theme.accentColor === color.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Set ${color.name} theme`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Font Size</p>
            <div className="flex space-x-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => changeFontSize(size)}
                  className={`px-2 py-1 text-xs rounded ${
                    theme.fontSize === size
                      ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={toggleMode}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label={theme.mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme.mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
};

export default ThemeToggle;
