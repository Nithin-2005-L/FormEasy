import React, { createContext, useState, useEffect } from 'react';
import { getTheme } from '../config/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const theme = getTheme(themeName);
    const root = document.documentElement;

    // Set CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    root.style.setProperty('--font-primary', theme.fonts);

    // Apply to body
    document.body.style.fontFamily = theme.fonts;
  };

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
  };

  const value = {
    currentTheme,
    switchTheme,
    theme: getTheme(currentTheme)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
