import React, { useEffect, useState } from "react";

export const DarkModeToggle = () => {
  // 1) Declare state for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2) Set initial mode based on localStorage or prefers-color-scheme
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // If there's a saved mode in local storage, parse it; otherwise default to system preference
    const initialMode = savedMode ? JSON.parse(savedMode) : prefersDark;
    setIsDarkMode(initialMode);

    // Apply data-theme attribute for controlling light/dark styles
    document.documentElement.setAttribute(
      "data-theme",
      initialMode ? "dark" : ""
    );
  }, []);

  // 3) Toggle function to switch modes and persist in localStorage
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Add or remove the “dark” theme
    document.documentElement.setAttribute("data-theme", newMode ? "dark" : "");

    // Save user preference in localStorage
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  // 4) Render a button that switches its text based on the theme
  return (
    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
      {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};
