import React, {useEffect} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {Button} from '@/components/button/button';
import styles from './onboarding-success-page.module.scss';

export const OnboardingSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      void navigate({to: '/'});
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles['onboarding-success-page']}>
      <div className={styles['onboarding-success-page__content']}>
        <h1 className={styles['onboarding-success-page__title']}>Your account is ready.</h1>
        <p className={styles['onboarding-success-page__message']}>
          You&apos;ll be redirected to your dashboard shortly.
        </p>
        <Button onClick={() => navigate({to: '/'})} variant="secondary">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
