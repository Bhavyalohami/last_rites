import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings } from '../api/publicAPI';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primary_color: '#5C6F82',
    secondary_color: '#F5F1EB',
    font_heading: 'Playfair Display',
    font_body: 'Open Sans'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Apply CSS variables to the document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--font-heading', settings.font_heading);
    root.style.setProperty('--font-body', settings.font_body);
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};