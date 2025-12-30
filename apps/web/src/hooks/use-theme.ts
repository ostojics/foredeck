import {useContext} from 'react';
import {ThemeContext, ThemeContextType} from '../context/theme-context';

/**
 * Hook to access the current theme and toggle function
 * Must be used within a ThemeProvider
 *
 * @returns {ThemeContextType} Object containing:
 *   - theme: Current theme ('light' | 'dark')
 *   - toggleTheme: Function to toggle between themes
 *
 * @example
 * const { theme, toggleTheme } = useTheme();
 *
 * // Use theme for conditional rendering
 * const icon = theme === 'light' ? <SunIcon /> : <MoonIcon />;
 *
 * // Toggle theme on button click
 * <button onClick={toggleTheme}>Switch Theme</button>
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
