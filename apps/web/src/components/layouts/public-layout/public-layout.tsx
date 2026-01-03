import {ReactNode} from 'react';
import {ThemeSwitcher} from '@/modules/theme/components/theme-switcher/theme-switcher';
import styles from './public-layout.module.scss';
import {Mail01} from '@/icons/mail-01';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({children}: PublicLayoutProps) {
  return (
    <div className={styles['public-layout']}>
      <header className={styles['public-layout__header']}>
        <div className={styles['public-layout__actions']}>
          <ThemeSwitcher />
        </div>
      </header>
      <main className={styles['public-layout__content']}>{children}</main>
      <footer className={styles['public-layout__footer']}>
        <Mail01 className={styles['public-layout__mail-icon']} />
        <a href="mailto:contact@foredeck.com" className={styles['public-layout__contact']}>
          contact@foredeck.com
        </a>
      </footer>
    </div>
  );
}
