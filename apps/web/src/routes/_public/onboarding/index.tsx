import {OnboardingPage} from '@/modules/onboarding/pages/onboarding-page/onboarding-page';
import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';

const onboardingSearchSchema = z.object({
  licenseKey: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/_public/onboarding/')({
  component: OnboardingPage,
  validateSearch: onboardingSearchSchema,
});
