// src/components/ThemeToggle.jsx
import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center p-2 rounded-lg
        text-gray-600 dark:text-gray-400 
        hover:text-gray-900 dark:hover:text-gray-100
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-colors duration-200
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <SunIcon 
          className={`
            absolute inset-0 w-5 h-5 transform transition-all duration-300 ease-in-out
            ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        />
        <MoonIcon 
          className={`
            absolute inset-0 w-5 h-5 transform transition-all duration-300 ease-in-out
            ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;