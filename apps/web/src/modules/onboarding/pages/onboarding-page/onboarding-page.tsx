import {Route} from '@/routes/onboarding/index';
import {OnboardingForm} from '../../components/onboarding-form/onboarding-form';
import styles from './onboarding-page.module.scss';

export const OnboardingPage = () => {
  const {licenseKey} = Route.useSearch();

  return (
    <div className={styles['onboarding-page']}>
      <div className={styles['onboarding-page__header']}>
        <h1 className={styles['onboarding-page__title']}>Welcome to Foredeck</h1>
        <p className={styles['onboarding-page__subtitle']}>Let's get your account set up.</p>
      </div>
      <OnboardingForm licenseKey={licenseKey} />
    </div>
  );
};
