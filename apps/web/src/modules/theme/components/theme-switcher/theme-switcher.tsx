import {useTheme} from '../../use-theme';
import styles from './theme-switcher.module.scss';
import {Sun} from '@/icons/sun';
import {Moon} from '@/icons/moon';

export function ThemeSwitcher() {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles['theme-switcher']}
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className={styles['theme-switcher__icon']} />
      ) : (
        <Sun className={styles['theme-switcher__icon']} />
      )}
    </button>
  );
}
