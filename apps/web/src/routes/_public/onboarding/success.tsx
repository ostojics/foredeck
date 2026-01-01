import {OnboardingSuccessPage} from '@/modules/onboarding/pages/success-page/onboarding-success-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_public/onboarding/success')({
  component: OnboardingSuccessPage,
});
