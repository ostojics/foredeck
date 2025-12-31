import {createFileRoute} from '@tanstack/react-router';
import {OnboardingSuccessPage} from '../../modules/onboarding/pages/success-page/onboarding-success-page';

export const Route = createFileRoute('/onboarding/success')({
  component: OnboardingSuccessPage,
});
