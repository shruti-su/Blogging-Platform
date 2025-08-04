import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// Create the Theme Context
const ThemeContext = createContext(null);

/**
 * Custom hook to use the theme context.
 * @returns {{theme: 'light' | 'dark', toggleTheme: () => void}} The current theme and a function to toggle it.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * ThemeProvider component to wrap your application.
 * It manages the theme state, persists it to local storage,
 * and applies the 'dark' class to the document's <html> element.
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme:
  // 1. Check local storage for user's explicit preference.
  // 2. If no preference, detect system preference (prefers-color-scheme).
  // 3. Default to 'light' if none of the above apply (e.g., SSR environment).
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme; // User's explicit preference from local storage
      }
      // Detect system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : "light"; // Initial theme based on system
    }
    return "light"; // Default for server-side rendering or initial render
  });

  // Effect to apply/remove the 'dark' class on the <html> element
  // and to save the theme to local storage.
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme); // Persist the current theme
  }, [theme]); // Re-run effect whenever 'theme' state changes

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
