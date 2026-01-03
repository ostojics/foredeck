import {createContext, useEffect, useState, ReactNode} from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme-preference';

/**
 * Determines the initial theme preference
 * 1. First checks localStorage for saved preference
 * 2. Falls back to system preference via prefers-color-scheme
 */
const getColorPreference = (): Theme => {
  if (typeof window !== 'undefined') {
    const storedPreference = localStorage.getItem(STORAGE_KEY);
    if (storedPreference === 'light' || storedPreference === 'dark') {
      return storedPreference;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }

  return 'light';
};

/**
 * Syncs the theme to the DOM by setting the data-theme attribute on <html>
 */
const reflectPreference = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getColorPreference);

  useEffect(() => {
    reflectPreference(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent): void => {
      const hasStoredPreference = localStorage.getItem(STORAGE_KEY);
      if (!hasStoredPreference) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        reflectPreference(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = (): void => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    reflectPreference(newTheme);
  };

  return <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>;
}
