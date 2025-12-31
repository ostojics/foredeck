import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';
import {OnboardingPage} from '../../modules/onboarding/pages/onboarding-page/onboarding-page';

const onboardingSearchSchema = z.object({
  licenseKey: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
  validateSearch: onboardingSearchSchema,
});
