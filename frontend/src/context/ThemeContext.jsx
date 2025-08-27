// src/context/ThemeContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Create the context object
const ThemeContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 3. Create the Provider component that will wrap your app
export const ThemeProvider = ({ children }) => {
  // State to hold the theme preference, defaulting to saved/system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for a user's saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no preference is saved, check the user's OS/browser setting
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to apply the theme to the <html> tag and save the choice
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Effect to listen for changes in the OS/browser theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Handler to update state if the system theme changes
    const handleChange = (e) => {
      // IMPORTANT: Only update if the user hasn't already made a manual choice.
      // This respects the user's explicit preference over the system's.
      if (localStorage.getItem('theme') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup the listener when the component unmounts
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Function to explicitly set a theme (e.g., from a settings page)
  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  // Provide the theme state and functions to children
  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      setTheme,
      theme: isDarkMode ? 'dark' : 'light' // Provide both boolean and string for convenience
    }}>
      {children}
    </ThemeContext.Provider>
  );
};