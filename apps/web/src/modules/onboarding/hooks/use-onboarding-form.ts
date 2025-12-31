import {useForm} from 'react-hook-form';
import {OnboardingDTO, onboardingSchema} from '@acme/contracts';
import {standardSchemaResolver} from '@hookform/resolvers/standard-schema';

export const useOnboardingForm = () => {
  return useForm<OnboardingDTO>({
    resolver: standardSchemaResolver(onboardingSchema),
    defaultValues: {
      companyName: '',
      companyUrl: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};
