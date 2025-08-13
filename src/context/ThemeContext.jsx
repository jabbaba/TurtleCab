import React, { createContext, useState, useMemo } from 'react';

const lightTheme = {
  dark: false,
  colors: {
    primary: '#FF6B35',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#333333',
    buttonText: '#FFFFFF',
    border: '#E9ECEF',
    placeholder: '#999999',
    error: '#FF4444',
    success: '#4CAF50',
    inputBackground: '#F8F9FA',
  },
};

// For now, light and dark themes are the same. This can be expanded later.
const darkTheme = {
  dark: true,
  colors: {
    primary: '#FF6B35',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    buttonText: '#FFFFFF',
    border: '#272727',
    placeholder: '#888888',
    error: '#FF5555',
    success: '#5CB85C',
    inputBackground: '#272727',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
