import {useForm} from 'react-hook-form';
import {OnboardingDTO, onboardingSchema} from '@acme/contracts';
import {standardSchemaResolver} from '@hookform/resolvers/standard-schema';

export const useOnboardingForm = (licenseKey?: string) => {
  return useForm<OnboardingDTO>({
    resolver: standardSchemaResolver(onboardingSchema),
    defaultValues: {
      licenseKey: licenseKey || '',
      companyName: '',
      companyUrl: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};
