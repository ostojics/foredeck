import {useTheme} from '../../hooks/use-theme';
import styles from './theme-switch.module.scss';

/**
 * A toggle switch component for switching between light and dark themes
 * Uses the useTheme hook to access theme state and toggle function
 */
export function ThemeSwitch() {
  const {theme, toggleTheme} = useTheme();
  const isLightMode = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isLightMode}
      aria-label={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
      className={`${styles.switch} ${!isLightMode ? styles.toggled : ''}`}
      onClick={toggleTheme}
    >
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={`${styles.icon} ${styles.sun} ${isLightMode ? styles.active : ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </span>
      <span className={`${styles.icon} ${styles.moon} ${!isLightMode ? styles.active : ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
    </button>
  );
}
